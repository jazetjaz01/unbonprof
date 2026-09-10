import { BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-8 px-4 text-center">
      <h1 className="text-6xl font-bold">Trouvez le <br/>bon professeur</h1>

      <form
        action="/recherche"
        className="flex w-full max-w-2xl items-center gap-2 rounded-full border bg-background p-2 shadow-sm"
      >
        <BookOpen className="ml-3 size-5 shrink-0 text-orange-500" />
        <input
          type="text"
          name="q"
          placeholder='Essayez "Piano"'
          className="h-10 flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground"
        />
        <Button
          type="submit"
          size="lg"
          className="rounded-full bg-orange-500 px-6 text-white hover:bg-orange-500/90"
        >
          Rechercher
        </Button>
      </form>
    </div>
  );
}
