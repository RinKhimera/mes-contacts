import { ModeToggle } from "@/components/theme-toggle"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { listComponents, menuItems } from "@/constants"
import { cn } from "@/lib/utils"
import Link from "next/link"
// import { usePathname } from "next/navigation"
import React from "react"
// import { MobileMenu } from "./mobile-menu"

export const SiteHeader = () => {
  // const pathname = usePathname()

  return (
    <header className="sticky top-0 z-20 mx-auto flex max-w-6xl justify-between p-4 backdrop-blur">
      {/* Desktop Navigation */}
      <Link
        href={"/"}
        className="text-accent-foreground -mt-1 text-3xl font-bold"
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
          {/* <NavigationMenuIndicator  /> */}

          {menuItems.map((item) => {
            // const isActive = pathname === item.href

            return (
              <NavigationMenuItem key={item.href}>
                <Link href={item.href} legacyBehavior passHref>
                  <NavigationMenuLink
                    className={cn(
                      navigationMenuTriggerStyle(),
                      "bg-transparent text-base",
                      // { "text-accent-foreground": isActive },
                    )}
                  >
                    {item.label}
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            )
          })}
        </NavigationMenuList>
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
            "hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors",
            className,
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = "ListItem"
