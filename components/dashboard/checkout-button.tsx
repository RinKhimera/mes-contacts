"use client"

import { Button } from "@/components/ui/button"
import { checkoutHandler } from "@/server/actions/checkout"
import { ShoppingCart } from "lucide-react"

export const CheckoutButton = ({ postId }: { postId: string }) => {
  return (
    <Button
      size={"icon"}
      variant={"outline"}
      className="hover:bg-green-600"
      onClick={async () => {
        await checkoutHandler(postId)
      }}
    >
      <ShoppingCart size={20} />
    </Button>
  )
}
