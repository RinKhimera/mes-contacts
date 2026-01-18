"use client"

import { MoreHorizontal, Eye, Pencil, Trash2 } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface DataTableRowActionsProps {
  viewHref?: string
  editHref?: string
  onDelete?: () => void
  extraActions?: {
    label: string
    icon?: React.ReactNode
    onClick: () => void
    variant?: "default" | "destructive"
  }[]
}

export function DataTableRowActions({
  viewHref,
  editHref,
  onDelete,
  extraActions,
}: DataTableRowActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex size-8 p-0 data-[state=open]:bg-muted"
        >
          <MoreHorizontal className="size-4" />
          <span className="sr-only">Menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        {viewHref && (
          <DropdownMenuItem asChild>
            <Link href={viewHref} className="cursor-pointer">
              <Eye className="mr-2 size-4" />
              Voir
            </Link>
          </DropdownMenuItem>
        )}
        {editHref && (
          <DropdownMenuItem asChild>
            <Link href={editHref} className="cursor-pointer">
              <Pencil className="mr-2 size-4" />
              Modifier
            </Link>
          </DropdownMenuItem>
        )}
        {extraActions?.map((action, index) => (
          <DropdownMenuItem
            key={index}
            onClick={action.onClick}
            className={
              action.variant === "destructive"
                ? "text-destructive focus:text-destructive"
                : ""
            }
          >
            {action.icon && <span className="mr-2">{action.icon}</span>}
            {action.label}
          </DropdownMenuItem>
        ))}
        {onDelete && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={onDelete}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="mr-2 size-4" />
              Supprimer
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
