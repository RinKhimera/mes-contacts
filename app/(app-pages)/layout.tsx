import { SiteHeader } from "@/components/shared/site-header"

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <section>
      <SiteHeader />
      {children}
    </section>
  )
}
