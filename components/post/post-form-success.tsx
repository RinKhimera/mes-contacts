"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useRouter } from "next/navigation"

interface PostFormSuccessProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  isUpdate: boolean
}

export function PostFormSuccess({
  open,
  onOpenChange,
  isUpdate,
}: PostFormSuccessProps) {
  const router = useRouter()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Annonce enregistrée avec succès</DialogTitle>
          <DialogDescription>
            Votre annonce a été {isUpdate ? "mise à jour" : "créée"} avec succès.
            Pour la publier, veuillez contacter un administrateur afin de
            finaliser le paiement.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            onClick={(e) => {
              e.preventDefault()
              router.push("/admin/annonces")
            }}
          >
            Voir mes annonces
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
