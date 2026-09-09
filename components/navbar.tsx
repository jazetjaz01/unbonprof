import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { NavMenu } from "@/components/nav-menu";
import { NavigationSheet } from "@/components/navigation-sheet";
import { logout } from "@/app/auth/actions";
import { createClient } from "@/lib/supabase/server";

const Navbar = async () => {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

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
              <span className="hidden text-sm text-muted-foreground sm:inline">
                {user.email}
              </span>
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
