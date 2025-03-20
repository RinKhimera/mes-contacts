"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { changePostStatus } from "@/server/actions/post"
import { LoaderCircle, ToggleLeft, ToggleRight } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"
import { toast } from "sonner"

type CheckoutButtonProps = {
  postId: string
  postStatus: string
  variant?: "button" | "menu"
  onActionComplete?: () => void
}

export const SwitchStatusButton = ({
  postId,
  postStatus,
  variant = "button",
  onActionComplete,
}: CheckoutButtonProps) => {
  const [isPending, startTransition] = useTransition()
  const [open, setOpen] = useState(false)
  const router = useRouter()

  const handleStatusChange = () => {
    startTransition(async () => {
      try {
        const updatedPost = await changePostStatus(postId)
        setOpen(false)
        router.refresh()

        if (updatedPost.status === "PUBLISHED") {
          toast.success("L'annonce a été activée")
        } else {
          toast.info("L'annonce a été désactivée")
        }
      } catch (error) {
        console.error(error)
        toast.error("Une erreur s'est produite !", {
          description:
            "Veuillez vérifier votre connexion internet et réessayer.",
        })
      }
    })
    if (onActionComplete) onActionComplete()
  }

  if (variant === "menu") {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          {postStatus === "PUBLISHED" ? (
            <div className="flex items-center gap-2">
              <ToggleRight size={20} />
              <span>Désactiver</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <ToggleLeft size={20} />
              <span>Activer</span>
            </div>
          )}
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {postStatus === "PUBLISHED"
                ? "Désactiver cette annonce ?"
                : "Activer cette annonce ?"}
            </DialogTitle>
            <DialogDescription>
              {postStatus === "PUBLISHED"
                ? "L'annonce ne sera plus visible pour les utilisateurs mais vous pourrez la réactiver plus tard."
                : "L'annonce sera à nouveau visible pour tous les utilisateurs."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Fermer
              </Button>
            </DialogClose>
            <Button
              onClick={(e) => {
                e.preventDefault()
                handleStatusChange()
              }}
              disabled={isPending}
              className="bg-secondary-foreground text-black hover:bg-secondary-foreground/90"
            >
              {isPending ? (
                <LoaderCircle className="animate-spin" />
              ) : postStatus === "PUBLISHED" ? (
                "Désactiver"
              ) : (
                "Activer"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {postStatus === "PUBLISHED" ? (
          <Button
            size={"icon"}
            variant={"outline"}
            className="hover:bg-slate-600 hover:text-white"
          >
            <ToggleRight size={20} />
          </Button>
        ) : (
          <Button
            size={"icon"}
            variant={"outline"}
            className="hover:bg-green-600 hover:text-white"
          >
            <ToggleLeft size={20} />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {postStatus === "PUBLISHED"
              ? "Désactiver cette annonce ?"
              : "Activer cette annonce ?"}
          </DialogTitle>
          <DialogDescription>
            {postStatus === "PUBLISHED"
              ? "L'annonce ne sera plus visible pour les utilisateurs mais vous pourrez la réactiver plus tard."
              : "L'annonce sera à nouveau visible pour tous les utilisateurs."}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Fermer
            </Button>
          </DialogClose>
          <Button
            onClick={(e) => {
              e.preventDefault()
              handleStatusChange()
            }}
            disabled={isPending}
            className="bg-secondary-foreground text-black hover:bg-secondary-foreground/90"
          >
            {isPending ? (
              <LoaderCircle className="animate-spin" />
            ) : postStatus === "PUBLISHED" ? (
              "Désactiver"
            ) : (
              "Activer"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
