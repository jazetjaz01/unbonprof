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
      <div className="absolute left-0 z-10 flex h-full w-16 items-center justify-start rounded-l-full bg-red-50">
        <Button
          type="button"
          size="icon-lg"
          variant="outline"
          className="ml-2 rounded-full bg-white shadow-md"
          onClick={() => scrollBy("left")}
          aria-label="Précédent"
        >
          <ChevronLeft className="size-6" />
        </Button>
      </div>

      <div
        ref={scrollRef}
        className="scrollbar-none flex w-full snap-x scroll-px-16 gap-6 overflow-x-auto rounded-full bg-red-50 px-16 py-5 [&::-webkit-scrollbar]:hidden"
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

      <div className="absolute right-0 z-10 flex h-full w-16 items-center justify-end rounded-r-full bg-red-50">
        <Button
          type="button"
          size="icon-lg"
          variant="outline"
          className="mr-2 rounded-full bg-white shadow-md"
          onClick={() => scrollBy("right")}
          aria-label="Suivant"
        >
          <ChevronRight className="size-6" />
        </Button>
      </div>
    </div>
  );
};
