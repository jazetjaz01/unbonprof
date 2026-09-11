"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { SubjectIcon } from "@/components/subject-icon";

export type Subject = {
  id: string;
  name: string;
};

export const SubjectsCarousel = ({ subjects }: { subjects: Subject[] }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollBy = (direction: "left" | "right") => {
    scrollRef.current?.scrollBy({
      left: direction === "left" ? -320 : 320,
      behavior: "smooth",
    });
  };

  if (subjects.length === 0) return null;

  return (
    <div className="relative flex w-full max-w-5xl items-center">
      <Button
        type="button"
        size="icon-lg"
        variant="outline"
        className="absolute left-2 z-10 rounded-full bg-white shadow-md"
        onClick={() => scrollBy("left")}
        aria-label="Précédent"
      >
        <ChevronLeft className="size-6" />
      </Button>

      <div
        ref={scrollRef}
        className="scrollbar-none flex w-full snap-x scroll-px-4 gap-6 overflow-x-auto rounded-full bg-red-50/70 px-16 py-5 mask-[linear-gradient(to_right,transparent,black_56px,black_calc(100%-56px),transparent)] [&::-webkit-scrollbar]:hidden"
      >
        {subjects.map((subject) => (
          <a
            key={subject.id}
            href={`/recherche?q=${encodeURIComponent(subject.name)}`}
            className="flex shrink-0 snap-start flex-col items-center gap-2 text-sm font-medium text-foreground"
          >
            <SubjectIcon name={subject.name} className="size-6" />
            {subject.name}
          </a>
        ))}
      </div>

      <Button
        type="button"
        size="icon-lg"
        variant="outline"
        className="absolute right-2 z-10 rounded-full bg-white shadow-md"
        onClick={() => scrollBy("right")}
        aria-label="Suivant"
      >
        <ChevronRight className="size-6" />
      </Button>
    </div>
  );
};
