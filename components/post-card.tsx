import { deletePost } from "@/app/dashboard/actions";
import { Button } from "@/components/ui/button";

export type Post = {
  id: string;
  author_id: string;
  content: string;
  image_url: string | null;
  created_at: string;
  author: {
    full_name: string | null;
    avatar_url: string | null;
  } | null;
};

export const PostCard = ({ post, canDelete }: { post: Post; canDelete?: boolean }) => (
  <div className="rounded-xl border bg-white p-4">
    <div className="flex items-start justify-between gap-3">
      <div className="flex items-center gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-orange-600 text-sm font-semibold text-white">
          {post.author?.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={post.author.avatar_url} alt="" className="size-full object-cover" />
          ) : (
            (post.author?.full_name?.[0]?.toUpperCase() ?? "?")
          )}
        </span>
        <div>
          <p className="text-sm font-semibold">{post.author?.full_name ?? "Utilisateur"}</p>
          <p className="text-xs text-muted-foreground">
            {new Date(post.created_at).toLocaleDateString("fr-FR", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
      </div>

      {canDelete && (
        <form action={deletePost}>
          <input type="hidden" name="post_id" value={post.id} />
          <Button type="submit" variant="ghost" size="sm">
            Supprimer
          </Button>
        </form>
      )}
    </div>

    <p className="mt-3 text-sm whitespace-pre-wrap">{post.content}</p>

    {post.image_url && (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={post.image_url}
        alt=""
        className="mt-3 max-h-96 w-full rounded-lg object-cover"
      />
    )}
  </div>
);
