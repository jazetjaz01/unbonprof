import Link from "next/link";
import { PostCard, type Post } from "@/components/post-card";
import { PostComposer } from "@/components/post-composer";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("avatar_url, full_name")
    .eq("id", user!.id)
    .single();

  const { data: posts } = await supabase
    .from("posts")
    .select("id, author_id, content, image_url, created_at, author:profiles(full_name, avatar_url)")
    .order("created_at", { ascending: false })
    .limit(20)
    .overrideTypes<Post[]>();

  const { data: articles } = await supabase
    .from("articles")
    .select("slug, title")
    .order("created_at", { ascending: false })
    .limit(3);

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
      <div className="space-y-6">
        <PostComposer
          avatarUrl={profile?.avatar_url ?? null}
          authorInitial={profile?.full_name?.[0]?.toUpperCase() ?? "?"}
          authorName={profile?.full_name ?? null}
        />

        <div className="space-y-4">
          {(posts ?? []).map((post) => (
            <PostCard key={post.id} post={post} canDelete={post.author_id === user!.id} />
          ))}
        </div>
      </div>

      <aside className="h-fit rounded-xl border bg-white p-4">
        <h2 className="text-sm font-semibold">Dernières actualités</h2>
        {(articles ?? []).length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">Aucun article pour le moment.</p>
        ) : (
          <ul className="mt-3 space-y-3">
            {(articles ?? []).map((article) => (
              <li key={article.slug}>
                <Link
                  href={`/actualite/${article.slug}`}
                  className="text-sm font-medium hover:underline"
                >
                  {article.title}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </aside>
    </div>
  );
}
