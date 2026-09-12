"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "cn";

const links = [
  { href: "/dashboard", label: "Tableau de bord" },
  { href: "/dashboard/profil", label: "Mon compte" },
  { href: "/dashboard/annonce", label: "Mon annonce" },
  { href: "/dashboard/avis", label: "Avis reçus" },
];

export const DashboardNav = () => {
  const pathname = usePathname();

  return (
    <nav className="w-full  border">
      <div className="mx-auto flex max-w-(--breakpoint-xl) gap-1 overflow-x-auto px-4 py-2 sm:px-6 lg:px-8">
        {links.map(({ href, label }) => {
          const isActive = href === "/dashboard" ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "shrink-0 rounded-md px-3 py-2 text-sm font-semibold whitespace-nowrap text-gray-500 hover:text-black",
                isActive && "text-black",
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
