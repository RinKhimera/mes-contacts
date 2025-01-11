import { AvatarDropdown } from "@/components/shared/avatar-dropdown"
import { ModeToggle } from "@/components/shared/theme-toggle"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { listComponents } from "@/constants"
import type { User } from "@clerk/backend"
import { Ellipsis, Info, KeyRound, LogIn, Rss } from "lucide-react"
import Link from "next/link"

type MobileMenuProps = {
  userId: string | null
  user: User | null
}

export const MobileMenu = ({ user, userId }: MobileMenuProps) => {
  return (
    <nav className="flex items-center gap-2 lg:hidden">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size={"icon"} variant="outline">
            <Ellipsis />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-52" align="end">
          <DropdownMenuGroup>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                Ma liste de contacts
              </DropdownMenuSubTrigger>

              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  {listComponents.slice(0, -1).map((component) => (
                    <Link key={component.title} href={component.href}>
                      <DropdownMenuItem>{component.title}</DropdownMenuItem>
                    </Link>
                  ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Voir la liste complète</DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>

            <Link href={"/post"}>
              <DropdownMenuItem className="cursor-pointer">
                Annoncez avec nous
                <DropdownMenuShortcut>
                  <Rss size={20} />
                </DropdownMenuShortcut>
              </DropdownMenuItem>
            </Link>

            <Link href={"/"}>
              <DropdownMenuItem className="cursor-pointer">
                Nous joindre
                <DropdownMenuShortcut>
                  <Info size={20} />
                </DropdownMenuShortcut>
              </DropdownMenuItem>
            </Link>
          </DropdownMenuGroup>

          {!userId && (
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
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <ModeToggle />

      {/* User Avatar */}
      {userId && <AvatarDropdown user={user} />}
    </nav>
  )
}
