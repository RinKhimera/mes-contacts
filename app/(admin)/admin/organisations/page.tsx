"use client"

import { useQuery, useMutation } from "convex/react"
import { ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Plus } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { toast } from "sonner"

import { api } from "@/convex/_generated/api"
import { Doc, Id } from "@/convex/_generated/dataModel"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DataTable,
  DataTableColumnHeader,
  DataTableRowActions,
  ConfirmDialog,
  FilterOption,
} from "@/components/admin"
import { getInitials } from "@/lib/utils"
import { provinces } from "@/constants"

export default function OrganisationsPage() {
  const organizations = useQuery(api.organizations.list)
  const removeOrg = useMutation(api.organizations.remove)

  const [deleteId, setDeleteId] = useState<Id<"organizations"> | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!deleteId) return
    setIsDeleting(true)
    try {
      await removeOrg({ id: deleteId })
      toast.success("Organisation supprimée")
      setDeleteId(null)
    } catch (error) {
      toast.error("Erreur lors de la suppression")
      console.error(error)
    } finally {
      setIsDeleting(false)
    }
  }

  const columns: ColumnDef<Doc<"organizations">>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Nom" />
      ),
      cell: ({ row }) => {
        const org = row.original
        return (
          <div className="flex items-center gap-3">
            <Avatar className="size-9 rounded-lg">
              <AvatarImage src={org.logo || ""} alt={org.name} />
              <AvatarFallback className="rounded-lg bg-primary/10 text-xs font-medium text-primary">
                {getInitials(org.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <Link
                href={`/admin/organisations/${org._id}`}
                className="font-medium hover:underline"
              >
                {org.name}
              </Link>
              {org.sector && (
                <span className="text-xs text-muted-foreground">
                  {org.sector}
                </span>
              )}
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: "city",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Ville" />
      ),
      cell: ({ row }) => {
        const org = row.original
        if (!org.city) return <span className="text-muted-foreground">-</span>
        return (
          <span>
            {org.city}
            {org.province && (
              <span className="ml-1 text-muted-foreground">({org.province})</span>
            )}
          </span>
        )
      },
    },
    {
      accessorKey: "province",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Province" />
      ),
      cell: ({ row }) => {
        const province = row.getValue("province") as string
        if (!province) return <span className="text-muted-foreground">-</span>
        const prov = provinces.find((p) => p.value === province)
        return <span>{prov?.label || province}</span>
      },
      filterFn: (row, id, value) => {
        return value === row.getValue(id)
      },
    },
    {
      accessorKey: "email",
      header: "Contact",
      cell: ({ row }) => {
        const org = row.original
        return (
          <div className="flex flex-col text-sm">
            {org.email && <span>{org.email}</span>}
            {org.phone && (
              <span className="text-muted-foreground">{org.phone}</span>
            )}
            {!org.email && !org.phone && (
              <span className="text-muted-foreground">-</span>
            )}
          </div>
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
        const org = row.original
        return (
          <DataTableRowActions
            viewHref={`/admin/organisations/${org._id}`}
            editHref={`/admin/organisations/${org._id}/edit`}
            onDelete={() => setDeleteId(org._id)}
          />
        )
      },
    },
  ]

  const filters: FilterOption[] = [
    {
      columnId: "province",
      title: "Province",
      options: provinces.map((p) => ({ label: p.label, value: p.value })),
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Organisations</h1>
          <p className="text-muted-foreground">
            Gérez les entreprises et organisations de la plateforme
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/organisations/new">
            <Plus className="mr-2 size-4" />
            Nouvelle organisation
          </Link>
        </Button>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={organizations || []}
        searchKey="name"
        searchPlaceholder="Rechercher une organisation..."
        filters={filters}
        isLoading={!organizations}
        exportFilename="organisations"
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Supprimer l'organisation"
        description="Cette action est irréversible. L'organisation et tous ses membres seront supprimés."
        confirmText="Supprimer"
        variant="destructive"
        onConfirm={handleDelete}
        isLoading={isDeleting}
      />
    </div>
  )
}
