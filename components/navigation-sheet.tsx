import Link from "next/link";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
// import { Logo } from "@/components/logo";
// import { NavMenu } from "@/components/nav-menu";

export const NavigationSheet = () => {
  return (
    <Sheet>
      <VisuallyHidden>
        <SheetTitle>Navigation Menu</SheetTitle>
      </VisuallyHidden>

      <SheetTrigger render={<Button size="icon" variant="outline" />}><Menu /></SheetTrigger>
      <SheetContent className="flex flex-col px-6 py-3">
        {/* <Logo /> */}
        {/* <NavMenu className="mt-6 [&>div]:h-full" orientation="vertical" /> */}

        <div className="flex flex-1 flex-col items-center justify-center gap-6">
          <div className="flex w-full flex-col gap-3">
            <Button
              className="w-full font-semibold bg-orange-600 text-white hover:bg-orange-600/90"
              nativeButton={false}
              render={<Link href="/auth/login" />}
            >
              Connexion
            </Button>
            <Button
              className="w-full font-semibold bg-gray-200 text-foreground hover:bg-gray-300"
              nativeButton={false}
              render={<Link href="/auth/sign-up" />}
            >
              Inscription
            </Button>
          </div>

          <div className="flex flex-col items-center gap-4 text-sm">
            <Link href="#" className="hover:underline">
              Donner des cours
            </Link>
            <Link href="#" className="hover:underline">
              Rechercher un professeur
            </Link>
            <Link href="#" className="hover:underline">
              Nous contacter
            </Link>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
