"use client"

import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

type PostStatus = "DRAFT" | "PUBLISHED" | "EXPIRED" | "DISABLED"
type PaymentStatus = "PENDING" | "COMPLETED" | "REFUNDED"
type OrgMemberRole = "OWNER" | "MEMBER"
type UserRole = "ADMIN" | "USER"

type StatusType = PostStatus | PaymentStatus | OrgMemberRole | UserRole

const statusConfig: Record<StatusType, { label: string; className: string }> = {
  // Post status
  DRAFT: {
    label: "Brouillon",
    className: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  },
  PUBLISHED: {
    label: "Publiée",
    className: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300",
  },
  EXPIRED: {
    label: "Expirée",
    className: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
  },
  DISABLED: {
    label: "Désactivée",
    className: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
  },
  // Payment status
  PENDING: {
    label: "En attente",
    className: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
  },
  COMPLETED: {
    label: "Complété",
    className: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300",
  },
  REFUNDED: {
    label: "Remboursé",
    className: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
  },
  // Member roles
  OWNER: {
    label: "Propriétaire",
    className: "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
  },
  MEMBER: {
    label: "Membre",
    className: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  },
  // User roles
  ADMIN: {
    label: "Admin",
    className: "bg-primary/10 text-primary",
  },
  USER: {
    label: "Utilisateur",
    className: "bg-muted text-muted-foreground",
  },
}

interface StatusBadgeProps {
  status: StatusType
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status]

  if (!config) {
    return (
      <Badge variant="outline" className={className}>
        {status}
      </Badge>
    )
  }

  return (
    <Badge
      className={cn(
        "border-transparent font-medium text-[11px] px-2 py-0.5",
        config.className,
        className
      )}
    >
      {config.label}
    </Badge>
  )
}
