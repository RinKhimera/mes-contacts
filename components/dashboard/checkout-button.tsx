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
import { checkoutHandler } from "@/server/actions/checkout"
import { LoaderCircle, ShoppingCart } from "lucide-react"
import { useTransition } from "react"
import { toast } from "sonner"

export const CheckoutButton = ({ postId }: { postId: string }) => {
  const [isPending, startTransition] = useTransition()

  const onCheckout = async () => {
    startTransition(async () => {
      try {
        await checkoutHandler(postId)
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
    <Dialog>
      <DialogTrigger asChild>
        <Button
          size={"icon"}
          variant={"outline"}
          className="hover:bg-green-600"
        >
          <ShoppingCart size={20} />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Finalisez la mise en avant de votre post</DialogTitle>
          <DialogDescription>
            En cliquant sur{" "}
            <span className="font-semibold">&quot;Payer maintenant&quot;</span>,
            vous serez redirigé vers notre plateforme de paiement sécurisée pour
            finaliser la transaction.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Fermer
            </Button>
          </DialogClose>

          <Button onClick={onCheckout} disabled={isPending}>
            {isPending ? (
              <div className="flex items-center">
                <LoaderCircle className="mr-1 animate-spin" /> Redirection...
              </div>
            ) : (
              "Payer maintenant"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
