import Link from "next/link";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
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
            <>
              <div className="flex items-center gap-2 rounded-full border py-1 pr-1 pl-3">
                <Menu className="size-4" />
                <span className="flex size-9 items-center justify-center rounded-full bg-orange-600 text-sm font-semibold text-white">
                  {firstName?.[0]?.toUpperCase()}
                </span>
              </div>
              <form action={logout}>
                <Button variant="outline">Se déconnecter</Button>
              </form>
            </>
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
