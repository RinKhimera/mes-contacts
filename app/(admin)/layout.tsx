"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AdminHeader } from "@/components/admin/admin-header"
import { useCurrentUser } from "@/hooks/use-current-user"
import { Skeleton } from "@/components/ui/skeleton"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const { currentUser, isLoading, isAuthenticated } = useCurrentUser()

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.replace("/auth/sign-in")
      } else if (currentUser && currentUser.role !== "ADMIN") {
        router.replace("/")
      }
    }
  }, [isLoading, isAuthenticated, currentUser, router])

  // Loading state
  if (isLoading) {
    return <AdminLayoutSkeleton />
  }

  // Not authenticated or not admin
  if (!isAuthenticated || !currentUser || currentUser.role !== "ADMIN") {
    return <AdminLayoutSkeleton />
  }

  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <AdminHeader />
        <main className="flex-1 overflow-auto">
          <div className="container max-w-7xl p-4 md:p-6">{children}</div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}

function AdminLayoutSkeleton() {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar skeleton */}
      <div className="hidden w-64 border-r bg-sidebar md:block">
        <div className="flex flex-col gap-4 p-4">
          <Skeleton className="h-12 w-full rounded-lg" />
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full rounded-lg" />
            ))}
          </div>
        </div>
      </div>
      {/* Main content skeleton */}
      <div className="flex-1">
        <div className="h-14 border-b">
          <Skeleton className="m-4 h-6 w-48" />
        </div>
        <div className="p-6">
          <div className="grid gap-4 md:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-28 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
