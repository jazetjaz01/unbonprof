import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PostCard, type Post } from "@/components/post-card";
import { PostComposer } from "@/components/post-composer";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("email, created_at, avatar_url, full_name")
    .eq("id", user!.id)
    .single();

  const { data: teacher } = await supabase
    .from("teachers")
    .select("status")
    .eq("id", user!.id)
    .maybeSingle();

  const { data: posts } = await supabase
    .from("posts")
    .select("id, author_id, content, image_url, created_at, author:profiles(full_name, avatar_url)")
    .order("created_at", { ascending: false })
    .limit(20)
    .overrideTypes<Post[]>();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Tableau de bord</h1>
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

      <PostComposer
        avatarUrl={profile?.avatar_url ?? null}
        authorInitial={profile?.full_name?.[0]?.toUpperCase() ?? "?"}
      />

      <div className="space-y-4">
        {(posts ?? []).map((post) => (
          <PostCard key={post.id} post={post} canDelete={post.author_id === user!.id} />
        ))}
      </div>
    </div>
  );
}
