"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Id } from "@/convex/_generated/dataModel"
import { Eye, MoreHorizontal, Pencil } from "lucide-react"
import Link from "next/link"
import { useRef, useState } from "react"
import { CheckoutButton } from "./checkout-button"
import { DeletePostButton } from "./delete-post-button"
import { SwitchStatusButton } from "./switch-status-button"

interface PostActionsProps {
  postId: Id<"posts">
  postStatus: string
}

export function PostActions({ postId, postStatus }: PostActionsProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [key, setKey] = useState(0)
  const actionCompletedRef = useRef(false)

  // Empêcher la fermeture du dropdown lors du clic
  const handleItemClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  // Gérer la fin d'une action
  const handleActionComplete = () => {
    actionCompletedRef.current = true
    setIsOpen(false)
    // Incrémenter la clé pour forcer le remontage
    setKey((prev) => prev + 1)
  }

  // Gérer le changement d'état du dropdown
  const handleOpenChange = (open: boolean) => {
    // Si on ferme le dropdown après une action
    if (!open && actionCompletedRef.current) {
      actionCompletedRef.current = false
    }
    setIsOpen(open)
  }

  return (
    <>
      {/* Version mobile avec dropdown */}
      <div className="lg:hidden">
        <DropdownMenu open={isOpen} onOpenChange={handleOpenChange}>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-32">
            <DropdownMenuItem asChild>
              <Link
                href={`/dashboard/post-details/${postId}`}
                className="flex w-full cursor-pointer items-center gap-3"
              >
                <Eye className="h-4 w-4 flex-shrink-0" />
                <span>Voir</span>
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem asChild>
              <Link
                href={`/dashboard/edit-post/${postId}`}
                className="flex w-full cursor-pointer items-center gap-3"
              >
                <Pencil className="h-4 w-4 flex-shrink-0" />
                <span>Modifier</span>
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem onSelect={(e) => e.preventDefault()} asChild>
              <div
                className="flex w-full cursor-pointer items-center gap-3"
                onClick={handleItemClick}
              >
                {postStatus === "DRAFT" ? (
                  <CheckoutButton
                    key={`checkout-${key}`}
                    postId={postId}
                    variant="menu"
                    onActionComplete={handleActionComplete}
                  />
                ) : (
                  <SwitchStatusButton
                    key={`status-${key}`}
                    postId={postId}
                    postStatus={postStatus}
                    variant="menu"
                    onActionComplete={handleActionComplete}
                  />
                )}
              </div>
            </DropdownMenuItem>

            <DropdownMenuItem onSelect={(e) => e.preventDefault()} asChild>
              <div
                className="flex w-full cursor-pointer items-center gap-3 focus:bg-primary focus:text-primary-foreground"
                onClick={handleItemClick}
              >
                <DeletePostButton
                  key={`delete-${key}`}
                  postId={postId}
                  variant="menu"
                  onActionComplete={handleActionComplete}
                />
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Version desktop avec boutons */}
      <div className="hidden space-x-2 lg:flex">
        <Button size="icon" variant="outline" asChild>
          <Link href={`/dashboard/post-details/${postId}`}>
            <Eye size={20} />
          </Link>
        </Button>

        <Button
          size="icon"
          variant="outline"
          className="hover:bg-blue-600"
          asChild
        >
          <Link href={`/dashboard/edit-post/${postId}`}>
            <Pencil size={20} />
          </Link>
        </Button>

        {postStatus === "DRAFT" ? (
          <CheckoutButton postId={postId} />
        ) : (
          <SwitchStatusButton postId={postId} postStatus={postStatus} />
        )}

        <DeletePostButton postId={postId} />
      </div>
    </>
  )
}
