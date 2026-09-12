import Link from "next/link";
import { Logo } from "@/components/logo";
import { NavMenu } from "@/components/nav-menu";
import { NavigationSheet } from "@/components/navigation-sheet";
import { UserMenu } from "@/components/user-menu";
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
            <UserMenu firstName={firstName} />
          ) : (
            <Link
              href="/auth/login"
              className="hidden text-sm font-semibold hover:underline sm:inline-flex"
            >
              Se connecter
            </Link>
          )}

          {/* Mobile Menu */}
          {!user && (
            <div className="md:hidden">
              <NavigationSheet />
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
