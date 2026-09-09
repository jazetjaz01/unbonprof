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
    <nav className="h-16 border-b bg-background">
      <div className="mx-auto flex h-full max-w-(--breakpoint-xl) items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo />

        {/* Desktop Menu */}
        <NavMenu className="hidden md:block" />

        <div className="flex items-center gap-3">
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
            <>
              <Button
                className="hidden sm:inline-flex"
                variant="outline"
                nativeButton={false}
                render={<Link href="/auth/login" />}
              >
                Sign In
              </Button>
              <Button nativeButton={false} render={<Link href="/auth/sign-up" />}>
                Get Started
              </Button>
            </>
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
