import { BookOpen, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SubjectsCarousel } from "@/components/subjects-carousel";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const { data: subjects } = await supabase
    .from("subjects")
    .select("id, name")
    .order("name");

  return (
    <div className="flex flex-1 flex-col items-center justify-cxenter gap-8 bg-linear-to-t from-orange-200 to-white px-4 text-center pt-10 ">
      <h1 className="text-4xl font-bold sm:text-6xl">Trouvez le <br/>bon professeur</h1>

      <p className=" sm:hidden font-semibold">
        En ligne ou en face-à-face, faites votre choix parmi les professeurs
        particuliers inscrits
      </p>

      <form
        action="/recherche"
        className="flex w-full max-w-2xl items-center gap-2 rounded-full border-8 border-orange-100 bg-background p-2 shadow-sm"
      >
        <BookOpen className="ml-3 size-5 shrink-0 text-orange-600" />
        <input
          type="text"
          name="q"
          placeholder='Essayez "Piano"'
          className="h-10 flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground"
        />
        <Button
          type="submit"
          size="icon-lg"
          className="size-12 rounded-full bg-orange-600 text-white hover:bg-orange-600/90"
          aria-label="Rechercher"
        >
          <Search className="size-6" />
        </Button>
      </form>

      <SubjectsCarousel subjects={subjects ?? []} />
    </div>
  );
}
