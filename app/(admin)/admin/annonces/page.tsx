"use client"

import { useQuery, useMutation } from "convex/react"
import { ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { CreditCard, FileText, Plus } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { toast } from "sonner"

import { api } from "@/convex/_generated/api"
import { Doc, Id } from "@/convex/_generated/dataModel"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DataTable,
  DataTableColumnHeader,
  DataTableRowActions,
  StatusBadge,
  ConfirmDialog,
  FilterOption,
} from "@/components/admin"
import { categoriesServices, provinces } from "@/constants"

export default function AnnoncesPage() {
  const posts = useQuery(api.posts.list, { limit: 1000 })
  const removePost = useMutation(api.posts.remove)
  const changeStatus = useMutation(api.posts.changeStatus)

  const [deleteId, setDeleteId] = useState<Id<"posts"> | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!deleteId) return
    setIsDeleting(true)
    try {
      await removePost({ id: deleteId })
      toast.success("Annonce supprimée")
      setDeleteId(null)
    } catch (error) {
      toast.error("Erreur lors de la suppression")
    } finally {
      setIsDeleting(false)
    }
  }

  const handleStatusChange = async (
    postId: Id<"posts">,
    newStatus: "DRAFT" | "PUBLISHED" | "EXPIRED" | "DISABLED"
  ) => {
    try {
      await changeStatus({ id: postId, status: newStatus })
      toast.success("Statut mis à jour")
    } catch (error) {
      toast.error("Erreur lors de la mise à jour")
    }
  }

  const columns: ColumnDef<Doc<"posts">>[] = [
    {
      accessorKey: "businessName",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Annonce" />
      ),
      cell: ({ row }) => {
        const post = row.original
        return (
          <div className="flex flex-col">
            <Link
              href={`/admin/annonces/${post._id}`}
              className="font-medium hover:underline"
            >
              {post.businessName}
            </Link>
            <span className="text-xs text-muted-foreground">{post.category}</span>
          </div>
        )
      },
    },
    {
      accessorKey: "category",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Catégorie" />
      ),
      cell: ({ row }) => (
        <Badge variant="outline" className="text-xs">
          {row.getValue("category")}
        </Badge>
      ),
      filterFn: (row, id, value) => value === row.getValue(id),
    },
    {
      accessorKey: "city",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Localisation" />
      ),
      cell: ({ row }) => {
        const post = row.original
        return (
          <span>
            {post.city}
            <span className="ml-1 text-muted-foreground">({post.province})</span>
          </span>
        )
      },
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
      accessorKey: "expiresAt",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Expire le" />
      ),
      cell: ({ row }) => {
        const expiresAt = row.getValue("expiresAt") as number | undefined
        if (!expiresAt) return <span className="text-muted-foreground">-</span>
        const date = new Date(expiresAt)
        const isExpired = date < new Date()
        return (
          <span className={isExpired ? "text-red-500" : "text-muted-foreground"}>
            {format(date, "d MMM yyyy", { locale: fr })}
          </span>
        )
      },
    },
    {
      accessorKey: "_creationTime",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Créée le" />
      ),
      cell: ({ row }) => {
        const date = new Date(row.getValue("_creationTime"))
        return (
          <span className="text-sm text-muted-foreground">
            {format(date, "d MMM yyyy", { locale: fr })}
          </span>
        )
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const post = row.original
        return (
          <DataTableRowActions
            viewHref={`/admin/annonces/${post._id}`}
            editHref={`/admin/annonces/${post._id}/edit`}
            onDelete={() => setDeleteId(post._id)}
            extraActions={[
              {
                label: "Enregistrer paiement",
                icon: <CreditCard className="size-4" />,
                onClick: () => {
                  // Navigate to payment page
                  window.location.href = `/admin/paiements/new?postId=${post._id}`
                },
              },
              ...(post.status === "DRAFT"
                ? [
                    {
                      label: "Publier",
                      onClick: () => handleStatusChange(post._id, "PUBLISHED"),
                    },
                  ]
                : []),
              ...(post.status === "PUBLISHED"
                ? [
                    {
                      label: "Désactiver",
                      onClick: () => handleStatusChange(post._id, "DISABLED"),
                      variant: "destructive" as const,
                    },
                  ]
                : []),
              ...(post.status === "DISABLED" || post.status === "EXPIRED"
                ? [
                    {
                      label: "Réactiver",
                      onClick: () => handleStatusChange(post._id, "PUBLISHED"),
                    },
                  ]
                : []),
            ]}
          />
        )
      },
    },
  ]

  const filters: FilterOption[] = [
    {
      columnId: "status",
      title: "Statut",
      options: [
        { label: "Brouillon", value: "DRAFT" },
        { label: "Publiée", value: "PUBLISHED" },
        { label: "Expirée", value: "EXPIRED" },
        { label: "Désactivée", value: "DISABLED" },
      ],
    },
    {
      columnId: "category",
      title: "Catégorie",
      options: categoriesServices.map((cat) => ({ label: cat, value: cat })),
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Annonces</h1>
          <p className="text-muted-foreground">
            Gérez les annonces de services de la plateforme
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/annonces/new">
            <Plus className="mr-2 size-4" />
            Nouvelle annonce
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="flex flex-wrap gap-2">
        <Badge variant="outline" className="gap-1">
          <span className="size-2 rounded-full bg-emerald-500" />
          {posts?.filter((p) => p.status === "PUBLISHED").length || 0} publiées
        </Badge>
        <Badge variant="outline" className="gap-1">
          <span className="size-2 rounded-full bg-slate-400" />
          {posts?.filter((p) => p.status === "DRAFT").length || 0} brouillons
        </Badge>
        <Badge variant="outline" className="gap-1">
          <span className="size-2 rounded-full bg-amber-500" />
          {posts?.filter((p) => p.status === "EXPIRED").length || 0} expirées
        </Badge>
        <Badge variant="outline" className="gap-1">
          <span className="size-2 rounded-full bg-red-500" />
          {posts?.filter((p) => p.status === "DISABLED").length || 0} désactivées
        </Badge>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={posts || []}
        searchKey="businessName"
        searchPlaceholder="Rechercher une annonce..."
        filters={filters}
        isLoading={!posts}
        exportFilename="annonces"
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Supprimer l'annonce"
        description="Cette action est irréversible. L'annonce, ses médias et paiements associés seront supprimés."
        confirmText="Supprimer"
        variant="destructive"
        onConfirm={handleDelete}
        isLoading={isDeleting}
      />
    </div>
  )
}
