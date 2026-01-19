"use client"

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface PostsStatusChartProps {
  data: {
    published: number
    draft: number
    expired: number
    disabled: number
  }
}

const STATUS_COLORS = {
  published: "#10b981", // emerald
  draft: "#94a3b8", // slate
  expired: "#f59e0b", // amber
  disabled: "#ef4444", // red
}

const STATUS_LABELS = {
  published: "Publiées",
  draft: "Brouillons",
  expired: "Expirées",
  disabled: "Désactivées",
}

export function PostsStatusChart({ data }: PostsStatusChartProps) {
  const chartData = Object.entries(data).map(([key, value]) => ({
    name: STATUS_LABELS[key as keyof typeof STATUS_LABELS],
    value,
    color: STATUS_COLORS[key as keyof typeof STATUS_COLORS],
  }))

  const total = Object.values(data).reduce((sum, val) => sum + val, 0)

  if (total === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Répartition des annonces</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-[200px] items-center justify-center text-muted-foreground">
            Aucune donnée
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Répartition des annonces</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          <div className="h-[180px] w-[180px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-col gap-2">
            {chartData.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div
                  className="size-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-muted-foreground">
                  {item.name}
                </span>
                <span className="ml-auto font-medium tabular-nums">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface PaymentMethodChartProps {
  data: Record<string, number>
}

const METHOD_COLORS: Record<string, string> = {
  E_TRANSFER: "#8b5cf6", // violet
  CASH: "#10b981", // emerald
  VIREMENT: "#3b82f6", // blue
  CARD: "#f59e0b", // amber
  OTHER: "#94a3b8", // slate
}

const METHOD_LABELS: Record<string, string> = {
  E_TRANSFER: "Interac",
  CASH: "Comptant",
  VIREMENT: "Virement",
  CARD: "Carte",
  OTHER: "Autre",
}

export function PaymentMethodChart({ data }: PaymentMethodChartProps) {
  const chartData = Object.entries(data).map(([key, value]) => ({
    name: METHOD_LABELS[key] || key,
    value: value / 100, // Convert cents to dollars
    color: METHOD_COLORS[key] || "#94a3b8",
  }))

  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Revenus par méthode</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-[200px] items-center justify-center text-muted-foreground">
            Aucune donnée
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Revenus par méthode</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical">
              <XAxis type="number" tickFormatter={(v) => `${v}$`} />
              <YAxis
                type="category"
                dataKey="name"
                width={80}
                tick={{ fontSize: 12 }}
              />
              <Tooltip
                formatter={(value) => [`${(value as number).toFixed(2)} $`, "Revenus"]}
                contentStyle={{
                  borderRadius: "8px",
                  border: "1px solid hsl(var(--border))",
                  backgroundColor: "hsl(var(--card))",
                }}
              />
              <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
