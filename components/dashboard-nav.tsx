"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "cn";

const links = [
  { href: "/dashboard", label: "Vue d'ensemble" },
  { href: "/dashboard/profil", label: "Mon profil" },
  { href: "/dashboard/annonce", label: "Mon annonce" },
  { href: "/dashboard/avis", label: "Avis reçus" },
];

export const DashboardNav = () => {
  const pathname = usePathname();

  return (
    <nav className="flex gap-1 overflow-x-auto border-b pb-2 md:w-56 md:flex-col md:border-b-0 md:border-r md:pr-4 md:pb-0">
      {links.map(({ href, label }) => {
        const isActive = href === "/dashboard" ? pathname === href : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "shrink-0 rounded-md px-3 py-2 text-sm font-medium whitespace-nowrap hover:bg-muted",
              isActive && "bg-orange-600 text-white hover:bg-orange-600/90",
            )}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
};
