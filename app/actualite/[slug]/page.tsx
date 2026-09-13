import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { deleteArticle } from "@/app/dashboard/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: article } = await supabase
    .from("articles")
    .select("id, slug, author_id, title, category, content, image_url, created_at, author:profiles(full_name, avatar_url)")
    .eq("slug", slug)
    .single()
    .overrideTypes<{
      id: string;
      slug: string;
      author_id: string;
      title: string;
      category: string;
      content: string;
      image_url: string | null;
      created_at: string;
      author: { full_name: string | null; avatar_url: string | null } | null;
    }>();

  if (!article) {
    notFound();
  }

  const isAuthor = user?.id === article.author_id;

  return (
    <article className="mx-auto max-w-(--breakpoint-md) px-6 py-16 xl:px-0">
      {article.image_url && (
        <div className="relative mb-8 aspect-video w-full overflow-hidden rounded-xl bg-muted">
          <Image
            alt={article.title}
            src={article.image_url}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      <Badge variant="secondary">{article.category}</Badge>

      <h1 className="mt-4 text-3xl font-bold tracking-[-0.02em]">{article.title}</h1>

      <div className="mt-6 flex items-center gap-2">
        <span className="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-orange-600 text-xs font-semibold text-white">
          {article.author?.avatar_url ? (
            <Image
              alt={article.author.full_name ?? ""}
              className="size-full object-cover"
              height={32}
              width={32}
              src={article.author.avatar_url}
            />
          ) : (
            (article.author?.full_name?.[0]?.toUpperCase() ?? "?")
          )}
        </span>
        <span className="font-medium text-muted-foreground">
          {article.author?.full_name ?? "Utilisateur"}
        </span>
        <span className="text-muted-foreground text-sm">
          · {new Date(article.created_at).toLocaleDateString("fr-FR")}
        </span>
      </div>

      <div
        className="prose prose-sm mt-8 max-w-none sm:prose-base"
        dangerouslySetInnerHTML={{ __html: article.content }}
      />

      {isAuthor && (
        <div className="mt-8 flex gap-2 border-t pt-6">
          <Button
            variant="outline"
            nativeButton={false}
            render={<Link href={`/actualite/${article.slug}/modifier`} />}
          >
            Modifier
          </Button>
          <form action={deleteArticle}>
            <input type="hidden" name="article_id" value={article.id} />
            <Button type="submit" variant="destructive">
              Supprimer
            </Button>
          </form>
        </div>
      )}
    </article>
  );
}
