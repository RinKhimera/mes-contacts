import { AvatarDropdown } from "@/components/shared/avatar-dropdown"
import { ModeToggle } from "@/components/shared/theme-toggle"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { navItems } from "@/constants"
import { cn } from "@/lib/utils"
import { auth, currentUser } from "@clerk/nextjs/server"
import Link from "next/link"
import React from "react"
import { MobileMenu } from "./mobile-menu"

const UserMenuItem = ({ userId }: { userId: string | null }) => (
  <NavigationMenuItem>
    <Link
      href={userId ? "/dashboard" : "/auth/sign-in"}
      legacyBehavior
      passHref
    >
      <NavigationMenuLink
        className={cn(navigationMenuTriggerStyle(), "bg-transparent text-base")}
      >
        {userId ? "Mon tableau de bord" : "Connexion"}
      </NavigationMenuLink>
    </Link>
  </NavigationMenuItem>
)

const NavigationItems = ({ userId }: { userId: string | null }) => (
  <NavigationMenuList>
    {navItems.map((item) => (
      <NavigationMenuItem key={item.href}>
        <Link href={item.href} legacyBehavior passHref>
          <NavigationMenuLink
            className={cn(
              navigationMenuTriggerStyle(),
              "bg-transparent text-base",
            )}
          >
            {item.label}
          </NavigationMenuLink>
        </Link>
      </NavigationMenuItem>
    ))}
    <UserMenuItem userId={userId} />
  </NavigationMenuList>
)

export const SiteHeader = async () => {
  const { userId } = await auth()
  const user = await currentUser()

  return (
    <header className="sticky top-0 z-20 mx-auto flex max-w-6xl justify-between bg-background px-4 pt-4 md:px-10 lg:px-20 xl:px-0">
      <Link
        href="/"
        className="-mt-1 text-3xl font-bold text-accent-foreground"
      >
        mc.ca
      </Link>

      <NavigationMenu className="space-x-2 max-lg:hidden">
        <NavigationItems userId={userId} />
        {userId && <AvatarDropdown user={user} />}
        <ModeToggle />
      </NavigationMenu>

      <MobileMenu userId={userId} user={user} />
    </header>
  )
}
