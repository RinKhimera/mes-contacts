import { AvatarDropdown } from "@/components/shared/avatar-dropdown"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import type { User } from "@clerk/backend"
import {
  LayoutDashboard,
  Menu,
  PlusCircle,
  Search,
  UserCircle,
} from "lucide-react"
import Link from "next/link"
import { Separator } from "../ui/separator"

type MobileMenuProps = {
  userId: string | null
  user: User | null
}

export const MobileMenu = ({ user, userId }: MobileMenuProps) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="icon" variant="ghost" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-80">
        <SheetHeader>
          <SheetTitle className="text-left">Menu</SheetTitle>
        </SheetHeader>

        <div className="mt-6 flex flex-col gap-4">
          {/* User Info */}
          {userId && user && (
            <>
              <div className="flex items-center gap-3 rounded-lg bg-muted p-3">
                <AvatarDropdown user={user} />
                <div className="flex-1 overflow-hidden">
                  <p className="truncate font-medium">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="truncate text-sm text-muted-foreground">
                    {user.emailAddresses[0].emailAddress}
                  </p>
                </div>
              </div>
              <Separator />
            </>
          )}

          {/* Navigation Links */}
          <nav className="flex flex-col gap-2">
            <Button variant="ghost" className="justify-start gap-3" asChild>
              <Link href="/recherche">
                <Search className="h-5 w-5" />
                Rechercher
              </Link>
            </Button>

            <Button variant="ghost" className="justify-start gap-3" asChild>
              <Link href="/dashboard/new-post">
                <PlusCircle className="h-5 w-5" />
                Nouvelle annonce
              </Link>
            </Button>

            {userId && (
              <Button variant="ghost" className="justify-start gap-3" asChild>
                <Link href="/dashboard">
                  <LayoutDashboard className="h-5 w-5" />
                  Tableau de bord
                </Link>
              </Button>
            )}

            {!userId && (
              <>
                <Separator className="my-2" />
                <Button variant="ghost" className="justify-start gap-3" asChild>
                  <Link href="/auth/sign-in">
                    <UserCircle className="h-5 w-5" />
                    Connexion
                  </Link>
                </Button>
                <Button className="justify-start gap-3" asChild>
                  <Link href="/auth/sign-up">
                    <UserCircle className="h-5 w-5" />
                    Inscription
                  </Link>
                </Button>
              </>
            )}
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  )
}
