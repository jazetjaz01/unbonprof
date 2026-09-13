import Blog, { type BlogPost } from "@/components/blog";
import { createClient } from "@/lib/supabase/server";

export default async function ActualitePage() {
  const supabase = await createClient();

  const { data: posts } = await supabase
    .from("articles")
    .select("id, category, title, created_at, image_url, author:profiles(full_name, avatar_url)")
    .order("created_at", { ascending: false })
    .overrideTypes<BlogPost[]>();

  return <Blog posts={posts ?? []} />;
}
