import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { stripe } from "@/lib/stripe"
import { CheckCircle2, XCircle } from "lucide-react"
import { redirect } from "next/navigation"

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

const PaymentStatus = async (props: { searchParams: SearchParams }) => {
  const searchParams = await props.searchParams

  const sessionId = searchParams.session_id as string | undefined
  const isCanceled = searchParams.canceled === "true"

  let isSuccess = false

  if (sessionId) {
    try {
      const session = await stripe.checkout.sessions.retrieve(sessionId)
      isSuccess = session.payment_status === "paid"

      if (!isSuccess && session.payment_status === "unpaid") {
        redirect("/payment-status?canceled=true")
      }
    } catch (error) {
      console.error("Erreur lors de la vérification du paiement:", error)
      redirect("/payment-status?canceled=true")
    }
  }

  if (!isSuccess && !isCanceled) {
    return null
  }

  return (
    <div className="container max-w-lg py-8">
      {isSuccess && (
        <Alert className="border-green-500">
          <CheckCircle2 className="h-5 w-5 text-green-500" />
          <AlertTitle>Paiement réussi</AlertTitle>
          <AlertDescription>
            Merci pour votre paiement. Votre transaction a été traitée avec
            succès.
          </AlertDescription>
        </Alert>
      )}

      {isCanceled && (
        <Alert className="border-red-500">
          <XCircle className="h-5 w-5 text-red-500" />
          <AlertTitle>Paiement annulé</AlertTitle>
          <AlertDescription>
            Votre paiement a été annulé. Aucun montant n&apos;a été débité.
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}

export default PaymentStatus
