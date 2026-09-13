import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export type BlogPost = {
  id: string;
  category: string;
  title: string;
  created_at: string;
  image_url: string | null;
  author: {
    full_name: string | null;
    avatar_url: string | null;
  } | null;
};

const Blog = ({ posts }: { posts: BlogPost[] }) => {
  return (
    <div className="mx-auto max-w-(--breakpoint-xl) px-6 py-16 xl:px-0">
      <h2 className="font-medium text-[1.5rem] tracking-tight">Actualités</h2>

      {posts.length === 0 ? (
        <p className="mt-6 text-muted-foreground">
          Aucun article publié pour le moment.
        </p>
      ) : (
        <div className="mt-6 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link href={`/actualite/${post.id}`} key={post.id}>
            <Card className="gap-3 bg-muted/30 py-0 shadow-none hover:bg-muted/50">
              <CardHeader className="p-1.5 pb-0">
                <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-muted">
                  {post.image_url && (
                    <Image
                      alt={post.title}
                      className="object-cover"
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      src={post.image_url}
                    />
                  )}
                </div>
              </CardHeader>
              <CardContent className="px-4 pt-0 pb-5">
                <Badge variant="secondary">{post.category}</Badge>

                <h3 className="mt-4 font-medium text-[1.4rem] text-xl tracking-[-0.02em]">
                  {post.title}
                </h3>
                <div className="mt-6 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-orange-600 text-xs font-semibold text-white">
                      {post.author?.avatar_url ? (
                        <Image
                          alt={post.author.full_name ?? ""}
                          className="size-full object-cover"
                          height={32}
                          width={32}
                          src={post.author.avatar_url}
                        />
                      ) : (
                        (post.author?.full_name?.[0]?.toUpperCase() ?? "?")
                      )}
                    </span>
                    <span className="font-medium text-muted-foreground">
                      {post.author?.full_name ?? "Utilisateur"}
                    </span>
                  </div>

                  <span className="text-muted-foreground text-sm">
                    {new Date(post.created_at).toLocaleDateString("fr-FR")}
                  </span>
                </div>
              </CardContent>
            </Card>
            </Link>
          ))}
        </div>
      )}

      <div className="mt-10 text-center">
        <Link href="/actualite/nouveau" className="underline">
          Rédiger un article
        </Link>
      </div>
    </div>
  );
};

export default Blog;
