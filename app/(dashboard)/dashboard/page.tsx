import { FirstDashboardCard } from "@/components/dashboard/first-dashboard-card"
import { MainDashboardCard } from "@/components/dashboard/main-dashboard-card"
import { SecondDashboardCard } from "@/components/dashboard/second-dashboard-card"
import { LoaderCircle } from "lucide-react"
import { Suspense } from "react"

export default function Dashboard() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <FirstDashboardCard />
        <SecondDashboardCard />
        <div className="aspect-video rounded-xl bg-muted/50" />
      </div>
      <Suspense fallback={<FallbackLoader />}>
        <MainDashboardCard />
      </Suspense>
    </div>
  )
}

const FallbackLoader = () => {
  return (
    <div className="@container min-h-[100vh] flex-1 rounded-xl bg-muted/50 p-2 md:min-h-min">
      <h1 className="mb-1 text-xl font-semibold">Annonces récentes</h1>
      <div className="flex h-[50vh] items-center justify-center">
        <LoaderCircle className="animate-spin" />
      </div>
    </div>
  )
}
