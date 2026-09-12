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
    <nav className="w-full border-b bg-slate-200 border">
      <div className="mx-auto flex max-w-(--breakpoint-xl) gap-1 overflow-x-auto px-4 py-2 sm:px-6 lg:px-8">
        {links.map(({ href, label }) => {
          const isActive = href === "/dashboard" ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "shrink-0 rounded-md px-3 py-2 text-sm font-medium whitespace-nowrap text-gray-300 hover:text-white",
                isActive && "text-white",
              )}
            >
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
