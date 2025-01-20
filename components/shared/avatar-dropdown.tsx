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
import type { User } from "@clerk/backend"
import { SignOutButton } from "@clerk/nextjs"
import { LogOut, Settings, UserRound } from "lucide-react"
import Link from "next/link"

export const AvatarDropdown = ({ user }: { user: User | null }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="cursor-pointer">
          <AvatarImage src={user?.imageUrl} />
          <AvatarFallback>XO</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-52" align="end" alignOffset={-1}>
        <DropdownMenuLabel>
          {user?.firstName} {user?.lastName}
        </DropdownMenuLabel>
        <DropdownMenuLabel className="text-muted-foreground">
          {user?.emailAddresses[0].emailAddress}
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
