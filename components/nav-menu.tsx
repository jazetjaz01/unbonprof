"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { cn } from "cn";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

const linkStyle = cn(
  navigationMenuTriggerStyle(),
  "hover:bg-red-500 hover:text-white focus:bg-red-500 focus:text-white",
);

export const NavMenu = (props: ComponentProps<typeof NavigationMenu>) => (
  <NavigationMenu {...props}>
    <NavigationMenuList className="data-[orientation=vertical]:-ms-2 data-[orientation=vertical]:flex-col data-[orientation=vertical]:items-start data-[orientation=vertical]:justify-start">
      <NavigationMenuItem>
        <NavigationMenuLink className={linkStyle} render={<Link href="#" />}>Aide</NavigationMenuLink>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <NavigationMenuLink className={linkStyle} render={<Link href="#" />}>Actualité</NavigationMenuLink>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <NavigationMenuLink className={linkStyle} render={<Link href="#" />}>Donner des cours</NavigationMenuLink>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <NavigationMenuLink className={linkStyle} render={<Link href="#" />}>Contact</NavigationMenuLink>
      </NavigationMenuItem>
    </NavigationMenuList>
  </NavigationMenu>
);
