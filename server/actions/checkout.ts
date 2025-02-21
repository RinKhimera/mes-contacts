"use server"

import { stripe } from "@/lib/stripe"
import { auth, currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

const baseUrl =
  process.env.NODE_ENV === "production"
    ? "https://mes-contacts.vercel.app"
    : "http://localhost:3000"

export const checkoutHandler = async (postId: string) => {
  const { userId } = await auth()
  const user = await currentUser()

  if (!userId || !user) {
    throw new Error("Unauthorized. You need to be logged in to checkout.")
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    client_reference_id: userId,
    customer_email: user.emailAddresses[0].emailAddress,
    line_items: [
      {
        price: process.env.STRIPE_PRICE_ID,
        quantity: 1,
      },
    ],
    mode: "payment",
    metadata: {
      userId,
      postId,
    },
    success_url: `${baseUrl}/payment-status?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/payment-status?canceled=true`,
  })

  if (session.url) {
    redirect(session.url)
  }
}
