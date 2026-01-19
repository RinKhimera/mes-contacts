"use client"

import { useQuery } from "convex/react"
import { ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

import { api } from "@/convex/_generated/api"
import { Doc } from "@/convex/_generated/dataModel"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DataTable,
  DataTableColumnHeader,
  StatusBadge,
  FilterOption,
} from "@/components/admin"
import { getInitials } from "@/lib/utils"

export default function UtilisateursPage() {
  const users = useQuery(api.users.list, {})

  const columns: ColumnDef<Doc<"users">>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Utilisateur" />
      ),
      cell: ({ row }) => {
        const user = row.original
        return (
          <div className="flex items-center gap-3">
            <Avatar className="size-9">
              <AvatarImage src={user.image} alt={user.name} />
              <AvatarFallback className="bg-primary/10 text-xs font-medium text-primary">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-medium">{user.name}</span>
              <span className="text-xs text-muted-foreground">{user.email}</span>
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: "email",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Email" />
      ),
      cell: ({ row }) => (
        <span className="text-muted-foreground">{row.getValue("email")}</span>
      ),
    },
    {
      accessorKey: "role",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Rôle" />
      ),
      cell: ({ row }) => {
        const role = row.getValue("role") as string
        return <StatusBadge status={role as "ADMIN" | "USER"} />
      },
      filterFn: (row, id, value) => value === row.getValue(id),
    },
    {
      accessorKey: "_creationTime",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Inscription" />
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
  ]

  const filters: FilterOption[] = [
    {
      columnId: "role",
      title: "Rôle",
      options: [
        { label: "Admin", value: "ADMIN" },
        { label: "Utilisateur", value: "USER" },
      ],
    },
  ]

  // Stats
  const adminCount = users?.filter((u) => u.role === "ADMIN").length || 0
  const userCount = users?.filter((u) => u.role === "USER").length || 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Utilisateurs</h1>
        <p className="text-muted-foreground">
          Liste des utilisateurs de la plateforme (lecture seule, géré via Clerk)
        </p>
      </div>

      {/* Stats */}
      <div className="flex flex-wrap gap-4">
        <div className="flex items-center gap-2 rounded-lg border bg-card px-4 py-2">
          <span className="text-2xl font-bold">{users?.length || 0}</span>
          <span className="text-muted-foreground">Total</span>
        </div>
        <div className="flex items-center gap-2 rounded-lg border bg-card px-4 py-2">
          <span className="text-2xl font-bold text-primary">{adminCount}</span>
          <span className="text-muted-foreground">Admins</span>
        </div>
        <div className="flex items-center gap-2 rounded-lg border bg-card px-4 py-2">
          <span className="text-2xl font-bold text-blue-600">{userCount}</span>
          <span className="text-muted-foreground">Utilisateurs</span>
        </div>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={users || []}
        searchKey="name"
        searchPlaceholder="Rechercher un utilisateur..."
        filters={filters}
        isLoading={!users}
        exportFilename="utilisateurs"
      />
    </div>
  )
}
