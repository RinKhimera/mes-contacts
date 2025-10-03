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
import type { Doc } from "@/convex/_generated/dataModel"
import { SignOutButton } from "@clerk/nextjs"
import { LogOut, Settings, UserRound } from "lucide-react"
import Link from "next/link"

export const AvatarDropdown = ({ user }: { user: Doc<"users"> | null }) => {
  const getInitials = (name: string) => {
    const names = name.split(" ")
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase()
    }
    return name.substring(0, 2).toUpperCase()
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="cursor-pointer">
          <AvatarImage src={user?.image} />
          <AvatarFallback>
            {user?.name ? getInitials(user.name) : "XO"}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-52" align="end" alignOffset={-1}>
        <DropdownMenuLabel>{user?.name}</DropdownMenuLabel>
        <DropdownMenuLabel className="text-muted-foreground">
          {user?.email}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <Link href={"/account"}>
            <DropdownMenuItem className="cursor-pointer">
              Compte
              <DropdownMenuShortcut>
                <UserRound size={20} />
              </DropdownMenuShortcut>
            </DropdownMenuItem>
          </Link>

          <Link href={"/account/security"}>
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
  )
}
