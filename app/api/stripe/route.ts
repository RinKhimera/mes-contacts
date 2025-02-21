import { prisma } from "@/lib/prisma"
import { stripe } from "@/lib/stripe"
import Stripe from "stripe"

export async function POST(request: Request) {
  let event: Stripe.Event

  try {
    const text = await request.text()
    const sig = request.headers.get("stripe-signature")!

    // Process the webhook payload
    event = stripe.webhooks.constructEvent(
      text,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!,
    )
  } catch (err) {
    const error = err as Error
    console.error(`Webhook signature verification failed. ${error.message}`)
    return new Response(`Webhook error: ${error.message}`, {
      status: 400,
    })
  }

  switch (event.type) {
    case "checkout.session.completed":
      const session = event.data.object as Stripe.Checkout.Session
      const postId = session.metadata?.postId

      await prisma.post.update({
        where: {
          id: postId,
        },
        data: {
          status: "PUBLISHED",
        },
      })

      break
    default:
      console.log(`Unhandled event type: ${event.type}`)
  }

  return new Response("Success!", {
    status: 200,
  })
}
