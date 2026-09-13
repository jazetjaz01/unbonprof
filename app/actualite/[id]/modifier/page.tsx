import Image from "next/image";
import { notFound, redirect } from "next/navigation";
import { updateArticle } from "@/app/dashboard/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/lib/supabase/server";

export default async function EditArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { data: article } = await supabase
    .from("articles")
    .select("id, author_id, title, category, content, image_url")
    .eq("id", id)
    .single();

  if (!article) {
    notFound();
  }

  if (article.author_id !== user.id) {
    redirect(`/actualite/${id}`);
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-16 xl:px-0">
      <div className="mb-4">
        <h1 className="font-heading text-base leading-snug font-medium">Modifier l&apos;article</h1>
      </div>

      <form action={updateArticle} className="space-y-4">
        <input type="hidden" name="article_id" value={article.id} />

        <div className="space-y-2">
          <Label htmlFor="title">Titre</Label>
          <Input id="title" name="title" defaultValue={article.title} required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Catégorie</Label>
          <Input id="category" name="category" defaultValue={article.category} required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="image">Image de couverture</Label>
          {article.image_url && (
            <div className="relative mb-2 aspect-video w-full max-w-xs overflow-hidden rounded-lg bg-muted">
              <Image alt="" src={article.image_url} fill className="object-cover" />
            </div>
          )}
          <Input id="image" name="image" type="file" accept="image/png,image/jpeg,image/webp" />
          <p className="text-xs text-muted-foreground">
            Laisse vide pour conserver l&apos;image actuelle.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="content">Contenu</Label>
          <Textarea id="content" name="content" rows={10} defaultValue={article.content} required />
        </div>

        <Button type="submit">Enregistrer</Button>
      </form>
    </div>
  );
}
