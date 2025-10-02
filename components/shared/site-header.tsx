import { AvatarDropdown } from "@/components/shared/avatar-dropdown"
import { ModeToggle } from "@/components/shared/theme-toggle"
import { Button } from "@/components/ui/button"
import { auth, currentUser } from "@clerk/nextjs/server"
import { Building2, LayoutDashboard, PlusCircle, Search } from "lucide-react"
import Link from "next/link"
import { MobileMenu } from "./mobile-menu"

export const SiteHeader = async () => {
  const { userId } = await auth()
  const user = await currentUser()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Building2 className="h-6 w-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl leading-none font-bold">Mescontacts</span>
            <span className="text-xs text-muted-foreground">.ca</span>
          </div>
        </Link>

        {/* Navigation Desktop */}
        <nav className="hidden items-center gap-1 md:flex">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/recherche" className="gap-2">
              <Search className="h-4 w-4" />
              Rechercher
            </Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/new-post" className="gap-2">
              <PlusCircle className="h-4 w-4" />
              Nouvelle annonce
            </Link>
          </Button>

          {userId ? (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard" className="gap-2">
                  <LayoutDashboard className="h-4 w-4" />
                  Tableau de bord
                </Link>
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/auth/sign-in">Connexion</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/auth/sign-up">Inscription</Link>
              </Button>
            </>
          )}
        </nav>

        {/* Actions Right */}
        <div className="flex items-center gap-2">
          <ModeToggle />
          {userId && (
            <div className="hidden md:block">
              <AvatarDropdown user={user} />
            </div>
          )}
          <div className="md:hidden">
            <MobileMenu userId={userId} user={user} />
          </div>
        </div>
      </div>
    </header>
  )
}
