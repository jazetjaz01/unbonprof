import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, email, created_at")
    .eq("id", user!.id)
    .single();

  const { data: teacher } = await supabase
    .from("teachers")
    .select("status")
    .eq("id", user!.id)
    .maybeSingle();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">
          Bonjour {profile?.full_name?.split(" ")[0] ?? "👋"}
        </h1>
        <p className="text-muted-foreground">
          Voici un aperçu de ton compte unbonprof.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Compte</CardTitle>
            <CardDescription>{profile?.email}</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Membre depuis{" "}
            {profile?.created_at
              ? new Date(profile.created_at).toLocaleDateString("fr-FR")
              : "—"}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Mon annonce</CardTitle>
            <CardDescription>
              {teacher
                ? teacher.status === "published"
                  ? "Publiée"
                  : "Brouillon"
                : "Aucune annonce"}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm">
            <Link href="/dashboard/annonce" className="underline">
              {teacher ? "Gérer mon annonce" : "Créer une annonce"}
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
