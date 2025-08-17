import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { stripe } from "@/lib/stripe"
import { ConvexHttpClient } from "convex/browser"
import Stripe from "stripe"

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!)

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
      const postId = session.metadata?.postId as Id<"posts">

      if (postId) {
        try {
          await convex.mutation(api.posts.changePostStatus, { postId })
        } catch (error) {
          console.error("Erreur lors de la mise à jour du post:", error)
        }
      }

      break
    default:
      console.log(`Unhandled event type: ${event.type}`)
  }

  return new Response("Success!", {
    status: 200,
  })
}
