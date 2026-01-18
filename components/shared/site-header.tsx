"use client"

import { AvatarDropdown } from "@/components/shared/avatar-dropdown"
import { ThemeToggle } from "@/components/shared/theme-toggle"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useCurrentUser } from "@/hooks/use-current-user"
import { Building2, LayoutDashboard, Search } from "lucide-react"
import Link from "next/link"
import { MobileMenu } from "./mobile-menu"

export const SiteHeader = () => {
  const { currentUser, isLoading } = useCurrentUser()

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

          {isLoading ? (
            <Skeleton className="h-9 w-32" />
          ) : currentUser ? (
            <>
              {currentUser.role === "ADMIN" && (
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/admin" className="gap-2">
                    <LayoutDashboard className="h-4 w-4" />
                    Administration
                  </Link>
                </Button>
              )}
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
          <ThemeToggle />
          {isLoading ? (
            <Skeleton className="h-9 w-9 rounded-full" />
          ) : (
            currentUser && (
              <div className="hidden md:block">
                <AvatarDropdown user={currentUser} />
              </div>
            )
          )}
          <div className="md:hidden">
            <MobileMenu currentUser={currentUser} isLoading={isLoading} />
          </div>
        </div>
      </div>
    </header>
  )
}
