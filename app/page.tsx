import { BookOpen, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-cxenter gap-8 px-4 text-center  pt-10 ">
      <h1 className="text-6xl font-bold">Trouvez le <br/>bon professeur</h1>

      <form
        action="/recherche"
        className="flex w-full max-w-2xl items-center gap-2 rounded-full border bg-background p-2 shadow-sm"
      >
        <BookOpen className="ml-3 size-5 shrink-0 text-red-500" />
        <input
          type="text"
          name="q"
          placeholder='Essayez "Piano"'
          className="h-10 flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground"
        />
        <Button
          type="submit"
          size="icon-lg"
          className="size-12 rounded-full bg-red-500 text-white hover:bg-red-500/90"
          aria-label="Rechercher"
        >
          <Search className="size-6" />
        </Button>
      </form>
    </div>
  );
}
