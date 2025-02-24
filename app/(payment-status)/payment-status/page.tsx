import { AvatarDropdown } from "@/components/shared/avatar-dropdown"
import { buttonVariants } from "@/components/ui/button"
import { stripe } from "@/lib/stripe"
import { auth, currentUser } from "@clerk/nextjs/server"
import { CircleCheck, CircleX } from "lucide-react"
import Link from "next/link"
import { notFound, redirect } from "next/navigation"

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

const PaymentStatus = async (props: { searchParams: SearchParams }) => {
  const searchParams = await props.searchParams

  const sessionId = searchParams.session_id as string | undefined
  const isCanceled = searchParams.canceled === "true"

  if (!sessionId && !isCanceled) notFound()

  const { userId } = await auth()
  const user = await currentUser()

  let isSuccess = false

  if (sessionId) {
    try {
      const session = await stripe.checkout.sessions.retrieve(sessionId)

      if (!session) notFound()

      isSuccess = session.payment_status === "paid"

      if (!isSuccess && session.payment_status === "unpaid") {
        redirect("/payment-status?canceled=true")
      }
    } catch (error) {
      console.error("Erreur lors de la vérification du paiement:", error)
      notFound()
    }
  }

  return (
    <div className="mx-auto h-screen w-full max-w-6xl px-4 md:px-10 lg:px-20 xl:px-0">
      <div className="flex justify-between pt-4">
        <Link
          href="/"
          className="-mt-1 text-3xl font-bold text-accent-foreground"
        >
          mc.ca
        </Link>

        {userId && <AvatarDropdown user={user} />}
      </div>
      {isSuccess && (
        <div className="flex h-[calc(100vh-80px)] flex-col items-center justify-center p-8">
          <div className="flex flex-col items-center gap-4 text-center">
            <CircleCheck size={100} />
            <h1 className="text-4xl font-semibold md:text-6xl">Merci !</h1>
            <p className="max-w-md text-muted-foreground">
              Votre paiement a été effectué avec succès. Vous recevrez un
              courriel de confirmation sous peu.
            </p>
            <Link
              className={buttonVariants({ variant: "secondary" })}
              href={"/dashboard"}
            >
              Retourner au tableau de bord
            </Link>
          </div>
        </div>
      )}

      {isCanceled && (
        <div className="flex h-[calc(100vh-80px)] flex-col items-center justify-center p-8">
          <div className="flex flex-col items-center gap-4 text-center">
            <CircleX size={100} className="text-red-500" />
            <h1 className="text-4xl font-semibold md:text-6xl">
              Paiement annulé
            </h1>
            <p className="max-w-md text-muted-foreground">
              Votre paiement a été annulé. Vous pouvez réessayer à tout moment.
            </p>
            <Link
              className={buttonVariants({ variant: "secondary" })}
              href={"/dashboard"}
            >
              Retourner au tableau de bord
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

export default PaymentStatus
