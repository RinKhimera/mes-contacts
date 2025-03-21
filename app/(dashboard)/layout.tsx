import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"
import { DynamicBreadcrumb } from "@/components/shared/dynamic-breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import TanstackClientProvider from "@/providers/tanstack-provider"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <section>
      <SidebarProvider>
        <DashboardSidebar />

        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <DynamicBreadcrumb />
          </header>
          <TanstackClientProvider>{children}</TanstackClientProvider>
        </SidebarInset>
      </SidebarProvider>
    </section>
  )
}
