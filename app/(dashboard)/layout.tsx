import { SiteHeader } from "@/components/shared/site-header"
import TanstackClientProvider from "@/providers/tanstack-provider"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <TanstackClientProvider>{children}</TanstackClientProvider>
      </main>
    </div>
  )
}
