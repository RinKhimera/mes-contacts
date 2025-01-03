import { ModeToggle } from "@/components/theme-toggle"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { listComponents } from "@/constants"
import { cn } from "@/lib/utils"
import { SignOutButton } from "@clerk/nextjs"
import { auth, currentUser } from "@clerk/nextjs/server"
import { LogOut, Settings, UserRound } from "lucide-react"
import Link from "next/link"
import React from "react"
// import { MobileMenu } from "./mobile-menu"

export const SiteHeader = async () => {
  // const pathname = usePathname()
  const { userId } = await auth()
  const user = await currentUser()

  return (
    <header className="sticky top-0 z-20 mx-auto flex max-w-6xl justify-between p-4 backdrop-blur">
      {/* Desktop Navigation */}
      <Link
        href={"/"}
        className="-mt-1 text-3xl font-bold text-accent-foreground"
      >
        mc.ca
      </Link>

      <NavigationMenu
      // className="max-lg:hidden"
      >
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger className="text-base">
              Ma liste de contacts
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[400px] gap-2 p-4 md:w-[500px] md:grid-cols-2 lg:w-[620px]">
                {listComponents.map((component) => (
                  <ListItem
                    key={component.title}
                    title={component.title}
                    href={component.href}
                  >
                    {component.description}
                  </ListItem>
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <Link href={"/post"} legacyBehavior passHref>
              <NavigationMenuLink
                className={cn(
                  navigationMenuTriggerStyle(),
                  "bg-transparent text-base",
                )}
              >
                Annoncez avec nous
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <Link href={"/contact-us"} legacyBehavior passHref>
              <NavigationMenuLink
                className={cn(
                  navigationMenuTriggerStyle(),
                  "bg-transparent text-base",
                )}
              >
                Nous joindre
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>

          <>
            {!userId && (
              <NavigationMenuItem>
                <Link href={"/auth/sign-in"} legacyBehavior passHref>
                  <NavigationMenuLink
                    className={cn(
                      navigationMenuTriggerStyle(),
                      "bg-transparent text-base",
                    )}
                  >
                    Connexion
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            )}
          </>
        </NavigationMenuList>

        <>
          {userId && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="mx-2 cursor-pointer">
                  <AvatarImage src={user?.imageUrl} />
                  <AvatarFallback>XO</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-52"
                align="end"
                alignOffset={-4}
              >
                <DropdownMenuLabel>
                  {user?.firstName} {user?.lastName}
                </DropdownMenuLabel>
                <DropdownMenuLabel className="text-muted-foreground">
                  {user?.emailAddresses[0].emailAddress}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <Link href={"/my-profile"}>
                    <DropdownMenuItem className="cursor-pointer">
                      Mon profil
                      <DropdownMenuShortcut>
                        <UserRound size={20} />
                      </DropdownMenuShortcut>
                    </DropdownMenuItem>
                  </Link>

                  <Link href={"/my-profile/security"}>
                    <DropdownMenuItem className="cursor-pointer">
                      Paramètres
                      <DropdownMenuShortcut>
                        <Settings size={20} />
                      </DropdownMenuShortcut>
                    </DropdownMenuItem>
                  </Link>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />

                <SignOutButton>
                  <DropdownMenuItem className="cursor-pointer">
                    Se déconnecter
                    <DropdownMenuShortcut>
                      <LogOut size={20} />
                    </DropdownMenuShortcut>
                  </DropdownMenuItem>
                </SignOutButton>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </>

        <ModeToggle />
      </NavigationMenu>

      {/* Mobile Navigation */}
      {/* <MobileMenu /> */}

      {/* <div className="flex">
        {socialLinks.map(({ href, ariaLabel, icon }) => (
          <Link
            key={href}
            className={buttonVariants({ variant: "ghost", size: "icon" })}
            target="_blank"
            rel="noopener noreferrer"
            href={href}
            aria-label={ariaLabel}
          >
            {icon}
          </Link>
        ))}

        </div> */}
    </header>
  )
}

const ListItem = React.forwardRef<
  React.ComponentRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, href, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          ref={ref}
          href={href as string}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className,
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = "ListItem"
