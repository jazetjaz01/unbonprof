import { redirect } from "next/navigation";
import { createArticle } from "@/app/dashboard/actions";
import { ArticleEditor } from "@/components/article-editor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/server";

export default async function NewArticlePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    redirect("/dashboard");
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-16 xl:px-0">
      <div className="mb-4">
        <h1 className="font-heading text-base leading-snug font-medium">Rédiger un article</h1>
        <p className="text-sm text-muted-foreground">
          Ton article sera visible par tout le monde sur la page Actualités.
        </p>
      </div>

      <form action={createArticle} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Titre</Label>
          <Input id="title" name="title" required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Catégorie</Label>
          <Input id="category" name="category" placeholder="Ex. Pédagogie" required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="image">Image de couverture</Label>
          <Input id="image" name="image" type="file" accept="image/png,image/jpeg,image/webp" />
        </div>

        <div className="space-y-2">
          <Label>Contenu</Label>
          <ArticleEditor name="content" />
        </div>

        <Button type="submit">Publier l&apos;article</Button>
      </form>
    </div>
  );
}
