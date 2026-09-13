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

  return (
    <div className="space-y-6">
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
