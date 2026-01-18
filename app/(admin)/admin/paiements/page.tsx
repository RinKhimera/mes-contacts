"use client"

import { useQuery, useMutation } from "convex/react"
import { ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Check, CreditCard, Plus, RefreshCw, X } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { toast } from "sonner"

import { api } from "@/convex/_generated/api"
import { Doc, Id } from "@/convex/_generated/dataModel"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DataTable,
  DataTableColumnHeader,
  StatusBadge,
  ConfirmDialog,
  FilterOption,
} from "@/components/admin"
import { toDollars } from "@/convex/lib/validation"

type PaymentWithPost = Doc<"payments"> & {
  post?: Doc<"posts"> | null
}

export default function PaiementsPage() {
  const payments = useQuery(api.payments.list, { limit: 1000 })
  const posts = useQuery(api.posts.list, { limit: 1000 })
  const paymentStats = useQuery(api.payments.getStats)
  const confirmPayment = useMutation(api.payments.confirmPending)
  const refundPayment = useMutation(api.payments.refund)

  const [confirmId, setConfirmId] = useState<Id<"payments"> | null>(null)
  const [refundId, setRefundId] = useState<Id<"payments"> | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  // Enrich payments with post data
  const paymentsWithPosts: PaymentWithPost[] =
    payments?.map((payment) => ({
      ...payment,
      post: posts?.find((p) => p._id === payment.postId),
    })) || []

  const handleConfirm = async () => {
    if (!confirmId) return
    setIsProcessing(true)
    try {
      await confirmPayment({ paymentId: confirmId })
      toast.success("Paiement confirmé et annonce publiée")
      setConfirmId(null)
    } catch (error) {
      toast.error("Erreur lors de la confirmation")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleRefund = async () => {
    if (!refundId) return
    setIsProcessing(true)
    try {
      await refundPayment({ paymentId: refundId })
      toast.success("Paiement remboursé")
      setRefundId(null)
    } catch (error) {
      toast.error("Erreur lors du remboursement")
    } finally {
      setIsProcessing(false)
    }
  }

  const columns: ColumnDef<PaymentWithPost>[] = [
    {
      accessorKey: "post",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Annonce" />
      ),
      cell: ({ row }) => {
        const payment = row.original
        return payment.post ? (
          <Link
            href={`/admin/annonces/${payment.postId}`}
            className="font-medium hover:underline"
          >
            {payment.post.businessName}
          </Link>
        ) : (
          <span className="text-muted-foreground">Annonce supprimée</span>
        )
      },
    },
    {
      accessorKey: "amount",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Montant" />
      ),
      cell: ({ row }) => {
        const amount = row.getValue("amount") as number
        return (
          <span className="font-medium tabular-nums">
            {toDollars(amount).toFixed(2)} $
          </span>
        )
      },
    },
    {
      accessorKey: "method",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Méthode" />
      ),
      cell: ({ row }) => {
        const method = row.getValue("method") as string
        const labels: Record<string, string> = {
          CASH: "Comptant",
          E_TRANSFER: "Interac",
          VIREMENT: "Virement",
          CARD: "Carte",
          OTHER: "Autre",
        }
        return <Badge variant="outline">{labels[method] || method}</Badge>
      },
      filterFn: (row, id, value) => value === row.getValue(id),
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Statut" />
      ),
      cell: ({ row }) => {
        const status = row.getValue("status") as string
        return <StatusBadge status={status as any} />
      },
      filterFn: (row, id, value) => value === row.getValue(id),
    },
    {
      accessorKey: "durationDays",
      header: "Durée",
      cell: ({ row }) => {
        const days = row.getValue("durationDays") as number
        return <span className="text-muted-foreground">{days} jours</span>
      },
    },
    {
      accessorKey: "paymentDate",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Date" />
      ),
      cell: ({ row }) => {
        const date = row.getValue("paymentDate") as number | undefined
        if (!date) return <span className="text-muted-foreground">-</span>
        return (
          <span className="text-sm text-muted-foreground">
            {format(new Date(date), "d MMM yyyy", { locale: fr })}
          </span>
        )
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const payment = row.original
        return (
          <div className="flex gap-1">
            {payment.status === "PENDING" && (
              <Button
                variant="ghost"
                size="icon"
                className="size-8 text-emerald-600 hover:bg-emerald-100 hover:text-emerald-700"
                onClick={() => setConfirmId(payment._id)}
              >
                <Check className="size-4" />
              </Button>
            )}
            {payment.status === "COMPLETED" && (
              <Button
                variant="ghost"
                size="icon"
                className="size-8 text-red-600 hover:bg-red-100 hover:text-red-700"
                onClick={() => setRefundId(payment._id)}
              >
                <RefreshCw className="size-4" />
              </Button>
            )}
          </div>
        )
      },
    },
  ]

  const filters: FilterOption[] = [
    {
      columnId: "status",
      title: "Statut",
      options: [
        { label: "Complété", value: "COMPLETED" },
        { label: "En attente", value: "PENDING" },
        { label: "Remboursé", value: "REFUNDED" },
      ],
    },
    {
      columnId: "method",
      title: "Méthode",
      options: [
        { label: "Interac", value: "E_TRANSFER" },
        { label: "Comptant", value: "CASH" },
        { label: "Virement", value: "VIREMENT" },
        { label: "Carte", value: "CARD" },
        { label: "Autre", value: "OTHER" },
      ],
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Paiements</h1>
          <p className="text-muted-foreground">
            Gérez les paiements manuels de la plateforme
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/paiements/new">
            <Plus className="mr-2 size-4" />
            Nouveau paiement
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Revenus totaux
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-emerald-600">
              {paymentStats
                ? `${toDollars(paymentStats.totalRevenue).toFixed(2)} $`
                : "-"}
            </p>
            <p className="text-xs text-muted-foreground">
              {paymentStats?.completedCount || 0} paiements complétés
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              En attente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-amber-600">
              {paymentStats
                ? `${toDollars(paymentStats.pendingAmount).toFixed(2)} $`
                : "-"}
            </p>
            <p className="text-xs text-muted-foreground">
              {paymentStats?.pendingCount || 0} paiements
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Remboursés
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-red-600">
              {paymentStats
                ? `${toDollars(paymentStats.refundedAmount).toFixed(2)} $`
                : "-"}
            </p>
            <p className="text-xs text-muted-foreground">
              {paymentStats?.refundedCount || 0} remboursements
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Par méthode
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-1">
              {paymentStats?.byMethod &&
                Object.entries(paymentStats.byMethod).map(([method, amount]) => (
                  <Badge key={method} variant="secondary" className="text-[10px]">
                    {method}: {toDollars(amount as number).toFixed(0)}$
                  </Badge>
                ))}
              {!paymentStats?.byMethod ||
                (Object.keys(paymentStats.byMethod).length === 0 && (
                  <span className="text-xs text-muted-foreground">-</span>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={paymentsWithPosts}
        searchKey="post"
        searchPlaceholder="Rechercher par annonce..."
        filters={filters}
        isLoading={!payments}
        exportFilename="paiements"
      />

      {/* Confirm Dialog */}
      <ConfirmDialog
        open={!!confirmId}
        onOpenChange={(open) => !open && setConfirmId(null)}
        title="Confirmer le paiement"
        description="Cette action confirmera le paiement et publiera automatiquement l'annonce associée."
        confirmText="Confirmer"
        onConfirm={handleConfirm}
        isLoading={isProcessing}
      />

      {/* Refund Dialog */}
      <ConfirmDialog
        open={!!refundId}
        onOpenChange={(open) => !open && setRefundId(null)}
        title="Rembourser le paiement"
        description="Cette action marquera le paiement comme remboursé et désactivera l'annonce associée."
        confirmText="Rembourser"
        variant="destructive"
        onConfirm={handleRefund}
        isLoading={isProcessing}
      />
    </div>
  )
}
