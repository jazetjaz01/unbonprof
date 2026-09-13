"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "cn";

const links = [
  { href: "/dashboard", label: "Tableau de bord" },
  { href: "/dashboard/profil", label: "Mon compte" },
  { href: "/dashboard/presentation", label: "Ma presentation" },
  { href: "/dashboard/annonce", label: "Mon annonce" },
  { href: "/dashboard/messages", label: "Messages" },
  { href: "/dashboard/avis", label: "Avis reçus" },
];

const accountLinks = [
  { href: "/dashboard/profil", label: "Mon profil" },
  { href: "#", label: "Mes factures" },
  { href: "#", label: "Mes paiements" },
];

export const DashboardNav = () => {
  const pathname = usePathname();
  const isAccountActive = pathname.startsWith("/dashboard/profil");

  return (
    <nav className="flex flex-col rounded-xl border p-2 bg-white">
      {links.map(({ href, label }) => {
        const isActive = href === "/dashboard" ? pathname === href : pathname.startsWith(href);
        return (
          <div key={href}>
            <Link
              href={href}
              className={cn(
                "block rounded-md px-3 py-2 text-sm font-semibold whitespace-nowrap text-gray-500 hover:bg-muted hover:text-black",
                isActive && "text-black",
              )}
            >
              {label}
            </Link>

            {href === "/dashboard/profil" && isAccountActive && (
              <div className="ml-4 flex flex-col border-l pl-2">
                {accountLinks.map((accountLink) => {
                  const isSubActive = pathname === accountLink.href;
                  return (
                    <Link
                      key={accountLink.label}
                      href={accountLink.href}
                      className={cn(
                        "rounded-md px-3 py-1.5 text-sm whitespace-nowrap text-gray-500 hover:bg-muted hover:text-black",
                        isSubActive && "font-semibold text-black",
                      )}
                    >
                      {accountLink.label}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
};
