import { PostCard, type Post } from "@/components/post-card";
import { createClient } from "@/lib/supabase/server";

export default async function MyPostsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: posts } = await supabase
    .from("posts")
    .select("id, author_id, content, image_url, created_at, author:profiles(full_name, avatar_url)")
    .eq("author_id", user!.id)
    .order("created_at", { ascending: false })
    .overrideTypes<Post[]>();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Mes posts</h1>
        <p className="text-muted-foreground">Retrouve ici tous les posts que tu as publiés.</p>
      </div>

      <div className="space-y-4">
        {(posts ?? []).length === 0 && (
          <p className="text-sm text-muted-foreground">
            Tu n&apos;as encore publié aucun post — rends-toi sur le tableau de bord pour en créer un.
          </p>
        )}
        {(posts ?? []).map((post) => (
          <PostCard key={post.id} post={post} canDelete />
        ))}
      </div>
    </div>
  );
}
