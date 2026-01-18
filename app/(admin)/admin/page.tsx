"use client"

import { useQuery } from "convex/react"
import { formatDistanceToNow } from "date-fns"
import { fr } from "date-fns/locale"
import {
  AlertTriangle,
  ArrowDownRight,
  Building2,
  CreditCard,
  DollarSign,
  FileText,
  TrendingUp,
} from "lucide-react"

import { api } from "@/convex/_generated/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { toDollars } from "@/convex/lib/validation"
import { PostsStatusChart, PaymentMethodChart } from "@/components/admin/stats-charts"

export default function AdminDashboardPage() {
  const organizations = useQuery(api.organizations.list)
  const posts = useQuery(api.posts.list, { limit: 1000 })
  const paymentStats = useQuery(api.payments.getStats)
  const recentActivity = useQuery(api.statusHistory.getRecent, { limit: 10 })

  const publishedPosts = posts?.filter((p) => p.status === "PUBLISHED") || []
  const expiredPosts = posts?.filter((p) => p.status === "EXPIRED") || []
  const draftPosts = posts?.filter((p) => p.status === "DRAFT") || []

  const isLoading = !organizations || !posts || !paymentStats

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Tableau de bord</h1>
        <p className="text-muted-foreground">
          Vue d&apos;ensemble de votre plateforme mescontacts.ca
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Organisations"
          value={organizations?.length}
          icon={Building2}
          description="Total enregistrées"
          color="blue"
          isLoading={isLoading}
        />
        <StatsCard
          title="Annonces actives"
          value={publishedPosts.length}
          icon={FileText}
          description={`${draftPosts.length} brouillons`}
          color="green"
          isLoading={isLoading}
        />
        <StatsCard
          title="Revenus (total)"
          value={paymentStats ? `${toDollars(paymentStats.totalRevenue).toFixed(0)} $` : undefined}
          icon={DollarSign}
          description="Paiements complétés"
          color="amber"
          isLoading={isLoading}
        />
        <StatsCard
          title="Expirées"
          value={expiredPosts.length}
          icon={AlertTriangle}
          description="À renouveler"
          color="red"
          isLoading={isLoading}
        />
      </div>

      {/* Two Column Layout */}
      <div className="grid gap-6 lg:grid-cols-7">
        {/* Payment Stats */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <CreditCard className="size-4 text-muted-foreground" />
              Statistiques paiements
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                <PaymentStatRow
                  label="Complétés"
                  value={`${toDollars(paymentStats?.totalRevenue || 0).toFixed(2)} $`}
                  count={paymentStats?.completedCount || 0}
                  color="green"
                />
                <PaymentStatRow
                  label="En attente"
                  value={`${toDollars(paymentStats?.pendingAmount || 0).toFixed(2)} $`}
                  count={paymentStats?.pendingCount || 0}
                  color="amber"
                />
                <PaymentStatRow
                  label="Remboursés"
                  value={`${toDollars(paymentStats?.refundedAmount || 0).toFixed(2)} $`}
                  count={paymentStats?.refundedCount || 0}
                  color="red"
                />
                <div className="border-t pt-3">
                  <div className="flex items-center justify-between text-sm font-medium">
                    <span>Par méthode</span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {paymentStats?.byMethod && Object.entries(paymentStats.byMethod).map(([method, amount]) => (
                      <Badge key={method} variant="secondary" className="text-xs">
                        {method}: {toDollars(amount as number).toFixed(0)} $
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="size-4 text-muted-foreground" />
              Activité récente
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!recentActivity ? (
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : recentActivity.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                Aucune activité récente
              </p>
            ) : (
              <div className="space-y-3">
                {recentActivity.slice(0, 6).map((activity) => (
                  <ActivityRow key={activity._id} activity={activity} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Posts Status Pie Chart */}
        {isLoading ? (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Répartition des annonces</CardTitle>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[200px] w-full" />
            </CardContent>
          </Card>
        ) : (
          <PostsStatusChart
            data={{
              published: publishedPosts.length,
              draft: draftPosts.length,
              expired: expiredPosts.length,
              disabled: posts?.filter((p) => p.status === "DISABLED").length || 0,
            }}
          />
        )}

        {/* Payment Method Bar Chart */}
        {isLoading ? (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Revenus par méthode</CardTitle>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[200px] w-full" />
            </CardContent>
          </Card>
        ) : (
          <PaymentMethodChart data={paymentStats?.byMethod || {}} />
        )}
      </div>
    </div>
  )
}

function StatsCard({
  title,
  value,
  icon: Icon,
  description,
  color,
  isLoading,
}: {
  title: string
  value?: number | string
  icon: React.ElementType
  description: string
  color: "blue" | "green" | "amber" | "red"
  isLoading: boolean
}) {
  const colorClasses = {
    blue: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    green: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    amber: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    red: "bg-red-500/10 text-red-600 dark:text-red-400",
  }

  const iconColorClasses = {
    blue: "text-blue-600 dark:text-blue-400",
    green: "text-emerald-600 dark:text-emerald-400",
    amber: "text-amber-600 dark:text-amber-400",
    red: "text-red-600 dark:text-red-400",
  }

  return (
    <Card className={`relative overflow-hidden`}>
      <div className={`absolute inset-0 ${colorClasses[color]} opacity-50`} />
      <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={`size-4 ${iconColorClasses[color]}`} />
      </CardHeader>
      <CardContent className="relative">
        {isLoading ? (
          <Skeleton className="h-8 w-24" />
        ) : (
          <div className="text-2xl font-bold">{value}</div>
        )}
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}

function PaymentStatRow({
  label,
  value,
  count,
  color,
}: {
  label: string
  value: string
  count: number
  color: "green" | "amber" | "red"
}) {
  const dotColors = {
    green: "bg-emerald-500",
    amber: "bg-amber-500",
    red: "bg-red-500",
  }

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className={`size-2 rounded-full ${dotColors[color]}`} />
        <span className="text-sm">{label}</span>
        <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
          {count}
        </Badge>
      </div>
      <span className="font-medium tabular-nums">{value}</span>
    </div>
  )
}

function ActivityRow({
  activity,
}: {
  activity: {
    _id: string
    previousStatus?: string | null
    newStatus: string
    reason?: string | null
    _creationTime: number
  }
}) {
  const statusColors: Record<string, string> = {
    DRAFT: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
    PUBLISHED: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300",
    EXPIRED: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
    DISABLED: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
  }

  const timeAgo = formatDistanceToNow(new Date(activity._creationTime), {
    addSuffix: true,
    locale: fr,
  })

  return (
    <div className="flex items-center gap-3 rounded-lg border p-3 text-sm">
      <div className="flex items-center gap-2">
        {activity.previousStatus && (
          <>
            <Badge className={`text-[10px] ${statusColors[activity.previousStatus]}`}>
              {activity.previousStatus}
            </Badge>
            <ArrowDownRight className="size-3 text-muted-foreground" />
          </>
        )}
        <Badge className={`text-[10px] ${statusColors[activity.newStatus]}`}>
          {activity.newStatus}
        </Badge>
      </div>
      <span className="flex-1 truncate text-muted-foreground">
        {activity.reason || "Changement de statut"}
      </span>
      <span className="text-xs text-muted-foreground">{timeAgo}</span>
    </div>
  )
}
