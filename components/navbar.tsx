import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/logo";
import { NavMenu } from "@/components/nav-menu";
import { NavigationSheet } from "@/components/navigation-sheet";
import { logout } from "@/app/auth/actions";
import { createClient } from "@/lib/supabase/server";

const Navbar = async () => {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let firstName: string | null = null;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", user.id)
      .single();
    firstName = profile?.full_name?.split(" ")[0] ?? user.email?.split("@")[0] ?? null;
  }

  return (
    <nav className="h-16  bg-background">
      <div className="mx-auto flex h-full max-w-(--breakpoint-3xl) items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo />

        {/* Desktop Menu 
        <NavMenu className="hidden md:block" />*/}

        <div className="flex items-center gap-3">
           <NavMenu className="hidden md:block" />
          {user ? (
            <div className="group relative">
              <div className="flex items-center gap-2 rounded-full border py-1 pr-1 pl-3 group-hover:bg-orange-600 group-hover:text-white">
                <span className="flex size-7 items-center justify-center rounded-full">
                  <Menu className="size-4 group-hover:hidden" />
                  <X className="hidden size-4 group-hover:block" />
                </span>
                <span className="flex size-9 items-center justify-center rounded-full bg-orange-600 text-sm font-semibold text-white">
                  {firstName?.[0]?.toUpperCase()}
                </span>
              </div>

              <div className="invisible absolute top-full right-0 z-20 w-56 rounded-lg border bg-popover p-1 text-popover-foreground opacity-0 shadow-md transition-opacity group-hover:visible group-hover:opacity-100">
                <Link href="#" className="block rounded-md px-3 py-2 text-sm hover:bg-muted">
                  Mon compte
                </Link>
                <Link href="#" className="block rounded-md px-3 py-2 text-sm hover:bg-muted">
                  Créer une annonce
                </Link>
                <form action={logout}>
                  <button type="submit" className="w-full rounded-md px-3 py-2 text-left text-sm hover:bg-muted">
                    Se déconnecter
                  </button>
                </form>
              </div>
            </div>
          ) : (
            <Link href="/auth/login" className="text-sm font-semibold hover:underline">
              Se connecter
            </Link>
          )}

          {/* Mobile Menu */}
          <div className="md:hidden">
            <NavigationSheet />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
