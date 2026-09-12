import Link from "next/link";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Menu } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "cn";
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

        <div className="mt-16 flex flex-col items-center gap-6">
          <div className="flex w-full flex-col gap-3">
            <SheetClose
              nativeButton={false}
              render={<Link href="/auth/login" />}
              className={cn(
                buttonVariants(),
                "h-12 w-full font-semibold bg-orange-600 text-white hover:bg-orange-600/90",
              )}
            >
              Connexion
            </SheetClose>
            <SheetClose
              nativeButton={false}
              render={<Link href="/auth/sign-up" />}
              className={cn(
                buttonVariants(),
                "h-12 w-full font-semibold bg-gray-200 text-foreground hover:bg-gray-300",
              )}
            >
              Inscription
            </SheetClose>
          </div>

          <div className="mt-5 flex flex-col items-center gap-4 text-sm">
            <SheetClose nativeButton={false} render={<Link href="#" />} className="hover:underline">
              Donner des cours
            </SheetClose>
            <SheetClose nativeButton={false} render={<Link href="#" />} className="hover:underline">
              Rechercher un professeur
            </SheetClose>
            <SheetClose nativeButton={false} render={<Link href="#" />} className="hover:underline">
              Nous contacter
            </SheetClose>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
