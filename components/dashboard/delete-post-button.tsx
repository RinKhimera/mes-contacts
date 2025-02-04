"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { deletePost } from "@/server/actions/post"
import { LoaderCircle, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"
import { toast } from "sonner"

export const DeletePostButton = ({ postId }: { postId: string }) => {
  const [isPending, startTransition] = useTransition()
  const [open, setOpen] = useState(false)

  const router = useRouter()

  const handleDeletePost = () => {
    startTransition(async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 3000)) // 3 second delay
        await deletePost(postId)
        setOpen(false)
        router.refresh()
        toast.info("La publication a été supprimée")
      } catch (error) {
        console.error(error)
        toast.error("Une erreur s'est produite !", {
          description:
            "Veuillez vérifier votre connexion internet et réessayer. Si le problème persiste, veuillez contacter le support.",
        })
      }
    })
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button size={"icon"} variant={"outline"} className="hover:bg-red-600">
          <Trash2 size={20} />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Vous êtes sur le point de supprimer votre annonce
          </AlertDialogTitle>
          <AlertDialogDescription>
            Cette action est irréversible et toute souscription liée à cette
            annonce sera annulée. Êtes-vous sûr de vouloir continuer ?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Annuler</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault()
              handleDeletePost()
            }}
            disabled={isPending}
          >
            {isPending ? (
              <LoaderCircle className="animate-spin" />
            ) : (
              "Supprimer"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
