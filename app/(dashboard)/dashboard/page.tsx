import { FirstDashboardCard } from "@/components/dashboard/first-dashboard-card"
import { SecondDashboardCard } from "@/components/dashboard/second-dashboard-card"

export default function Dashboard() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <FirstDashboardCard />
        <SecondDashboardCard />
        <div className="bg-muted/50 aspect-video rounded-xl" />
      </div>
      <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min" />
    </div>
  )
}
