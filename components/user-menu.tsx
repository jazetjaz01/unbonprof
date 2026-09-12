"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { logout } from "@/app/auth/actions";
import { cn } from "cn";

export const UserMenu = ({ firstName }: { firstName: string | null }) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        className={cn(
          "flex items-center gap-2 rounded-full border py-1 pr-1 pl-3",
          open && "bg-orange-600 text-white",
        )}
      >
        <span className="flex size-7 items-center justify-center rounded-full">
          {open ? <X className="size-4" /> : <Menu className="size-4" />}
        </span>
        <span className="flex size-9 items-center justify-center rounded-full bg-orange-600 text-sm font-semibold text-white">
          {firstName?.[0]?.toUpperCase()}
        </span>
      </button>

      {open && (
        <div className="absolute top-full right-0 z-20 mt-2 w-56 rounded-lg  bg-popover p-1 text-popover-foreground shadow-md">
          <Link
            href="/dashboard"
            className="block rounded-md px-3 py-2 text-sm hover:bg-muted font-semibold"
            onClick={() => setOpen(false)}
          >
            Tableau de bord
          </Link>
          <Link
            href="/dashboard/annonce"
            className="block rounded-md px-3 py-2 text-sm hover:bg-muted font-semibold"
            onClick={() => setOpen(false)}
          >
            Créer une annonce
          </Link>
          <form action={logout}>
            <button
              type="submit"
              className="w-full rounded-md px-3 py-2 text-left text-sm hover:bg-muted font-semibold"
            >
              Se déconnecter
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
