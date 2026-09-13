import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, email, created_at, avatar_url")
    .eq("id", user!.id)
    .single();

  const { data: teacher } = await supabase
    .from("teachers")
    .select("status")
    .eq("id", user!.id)
    .maybeSingle();

  return (
    <div className="space-y-6">
      <div className="relative mb-14">
        <div className="relative h-40 w-full overflow-hidden rounded-xl sm:h-56">
          <Image
            src="/dashboard/banniere-profil.jpg"
            alt=""
            fill
            className="object-cover"
            priority
          />
        </div>

        <span className="absolute -bottom-12 left-6 flex size-28 items-center justify-center overflow-hidden rounded-full border-4 border-background bg-orange-600 text-2xl font-semibold text-white">
          {profile?.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={profile.avatar_url}
              alt="Photo de profil"
              className="size-full object-cover"
            />
          ) : (
            (profile?.full_name?.[0]?.toUpperCase() ?? "?")
          )}
        </span>
      </div>

      <div>
        <h1 className="text-2xl font-bold">{profile?.full_name}</h1>
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
