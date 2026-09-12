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
import { Logo } from "@/components/logo";
// import { NavMenu } from "@/components/nav-menu";

export const NavigationSheet = () => {
  return (
    <Sheet>
      <VisuallyHidden>
        <SheetTitle>Navigation Menu</SheetTitle>
      </VisuallyHidden>

      <SheetTrigger render={<Button size="icon" variant="outline" />}><Menu /></SheetTrigger>
      <SheetContent className="flex flex-col px-6 py-3">
        <Logo />
        {/* <NavMenu className="mt-6 [&>div]:h-full" orientation="vertical" /> */}

        <div className="flex flex-1 items-center justify-center gap-3">
          <Button
            variant="outline"
            nativeButton={false}
            render={<Link href="/auth/login" />}
          >
            Connexion
          </Button>
          <Button
            nativeButton={false}
            render={<Link href="/auth/sign-up" />}
          >
            Inscription
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};
