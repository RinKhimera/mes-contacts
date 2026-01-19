"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Building2,
  CreditCard,
  FileText,
  LayoutDashboard,
  LogOut,
  Settings,
  Users,
} from "lucide-react"
import { useClerk } from "@clerk/nextjs"
import { useQuery } from "convex/react"

import { api } from "@/convex/_generated/api"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useCurrentUser } from "@/hooks/use-current-user"
import { getInitials } from "@/lib/utils"

const navigationItems = [
  {
    title: "Tableau de bord",
    url: "/admin",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    title: "Organisations",
    url: "/admin/organisations",
    icon: Building2,
  },
  {
    title: "Annonces",
    url: "/admin/annonces",
    icon: FileText,
  },
  {
    title: "Paiements",
    url: "/admin/paiements",
    icon: CreditCard,
  },
  {
    title: "Utilisateurs",
    url: "/admin/utilisateurs",
    icon: Users,
  },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const { currentUser } = useCurrentUser()
  const { signOut, openUserProfile } = useClerk()

  // Fetch counts for quick stats
  const posts = useQuery(api.posts.list, {})
  const organizations = useQuery(api.organizations.list, {})

  const isActive = (item: (typeof navigationItems)[0]) => {
    if (item.exact) {
      return pathname === item.url
    }
    return pathname.startsWith(item.url)
  }

  return (
    <Sidebar collapsible="icon" className="border-r-0">
      {/* Header with Logo */}
      <SidebarHeader className="border-b border-sidebar-border bg-gradient-to-b from-primary/5 to-transparent">
        <div className="flex items-center gap-3 px-2 py-3">
          <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-md shadow-primary/25">
            <Building2 className="size-5" />
          </div>
          <div className="flex flex-col gap-0.5 group-data-[collapsible=icon]:hidden">
            <span className="text-sm font-bold tracking-tight">
              MesContacts
            </span>
            <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
              Administration
            </span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="bg-gradient-to-b from-sidebar to-sidebar/95">
        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/70">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => {
                const active = isActive(item)
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={active}
                      tooltip={item.title}
                      className={
                        active
                          ? "bg-primary/10 text-primary hover:bg-primary/15 hover:text-primary"
                          : ""
                      }
                    >
                      <Link href={item.url}>
                        <item.icon
                          className={active ? "text-primary" : ""}
                        />
                        <span className="font-medium">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator className="mx-4" />

        {/* Quick Stats Preview */}
        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
          <SidebarGroupLabel className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/70">
            Aperçu rapide
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="grid grid-cols-2 gap-2 px-2">
              <QuickStatCard
                label="Annonces"
                value={posts?.length?.toString() ?? "—"}
                color="amber"
              />
              <QuickStatCard
                label="Orgs"
                value={organizations?.length?.toString() ?? "—"}
                color="green"
              />
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer with User */}
      <SidebarFooter className="border-t border-sidebar-border bg-gradient-to-t from-primary/5 to-transparent">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="cursor-pointer data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="size-8 rounded-lg ring-2 ring-primary/20">
                    <AvatarImage
                      src={currentUser?.image || ""}
                      alt={currentUser?.name || "Admin"}
                    />
                    <AvatarFallback className="rounded-lg bg-primary/10 text-xs font-semibold text-primary">
                      {getInitials(currentUser?.name || "A")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                      {currentUser?.name || "Admin"}
                    </span>
                    <span className="truncate text-xs text-muted-foreground">
                      {currentUser?.email || "admin@mescontacts.ca"}
                    </span>
                  </div>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-56 rounded-xl"
                side="top"
                align="start"
                sideOffset={8}
              >
                <DropdownMenuItem
                  onClick={() => openUserProfile()}
                  className="cursor-pointer"
                >
                  <Settings className="mr-2 size-4" />
                  Paramètres
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => signOut({ redirectUrl: "/" })}
                  className="cursor-pointer text-destructive focus:text-destructive"
                >
                  <LogOut className="mr-2 size-4" />
                  Déconnexion
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}

function QuickStatCard({
  label,
  value,
  color,
}: {
  label: string
  value: string
  color: "amber" | "green"
}) {
  const colorClasses = {
    amber: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    green: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  }

  return (
    <div
      className={`rounded-lg p-2.5 ${colorClasses[color]} transition-colors hover:bg-opacity-20`}
    >
      <p className="text-[10px] font-medium uppercase tracking-wide opacity-70">
        {label}
      </p>
      <p className="text-lg font-bold tabular-nums">{value}</p>
    </div>
  )
}
