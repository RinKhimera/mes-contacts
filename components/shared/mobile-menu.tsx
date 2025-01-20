import { AvatarDropdown } from "@/components/shared/avatar-dropdown"
import { ModeToggle } from "@/components/shared/theme-toggle"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { navItems } from "@/constants"
import type { User } from "@clerk/backend"
import { Ellipsis, KeyRound, LogIn } from "lucide-react"
import Link from "next/link"

type MobileMenuProps = {
  userId: string | null
  user: User | null
}

const AuthLinks = () => (
  <>
    <DropdownMenuSeparator />

    <DropdownMenuGroup>
      <Link href={"/auth/sign-in"}>
        <DropdownMenuItem className="cursor-pointer">
          Se connecter
          <DropdownMenuShortcut>
            <LogIn size={20} />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
      </Link>

      <Link href={"/auth/sign-up"}>
        <DropdownMenuItem className="cursor-pointer">
          S&apos;inscrire
          <DropdownMenuShortcut>
            <KeyRound size={20} />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
      </Link>
    </DropdownMenuGroup>
  </>
)

const NavItems = () => (
  <DropdownMenuGroup>
    {navItems.map((item) => (
      <Link key={item.href} href={item.href}>
        <DropdownMenuItem className="cursor-pointer">
          {item.label}
        </DropdownMenuItem>
      </Link>
    ))}
  </DropdownMenuGroup>
)

export const MobileMenu = ({ user, userId }: MobileMenuProps) => {
  return (
    <nav className="flex items-center gap-2 lg:hidden">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size={"icon"} variant="ghost">
            <Ellipsis />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-52" align="end">
          <DropdownMenuGroup>
            {userId && (
              <Link href={"/dashboard"}>
                <DropdownMenuItem className="cursor-pointer">
                  Mon tableau de bord
                </DropdownMenuItem>
              </Link>
            )}
            <NavItems />
          </DropdownMenuGroup>
          {!userId && <AuthLinks />}
        </DropdownMenuContent>
      </DropdownMenu>

      <ModeToggle />

      {userId && <AvatarDropdown user={user} />}
    </nav>
  )
}
