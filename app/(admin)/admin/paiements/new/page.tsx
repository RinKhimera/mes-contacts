"use client"

import { useMutation } from "convex/react"
import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PaymentForm } from "@/components/admin/payment-form"

export default function NewPaiementPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const defaultPostId = searchParams.get("postId") as Id<"posts"> | null

  const recordPayment = useMutation(api.payments.record)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (values: {
    postId: string
    amount: number
    method: "CASH" | "E_TRANSFER" | "VIREMENT" | "CARD" | "OTHER"
    durationDays: number
    notes?: string
    externalReference?: string
    autoPublish: boolean
  }) => {
    setIsSubmitting(true)
    try {
      await recordPayment({
        postId: values.postId as Id<"posts">,
        amount: Math.round(values.amount * 100), // Convert to cents
        method: values.method,
        durationDays: values.durationDays,
        notes: values.notes || undefined,
        externalReference: values.externalReference || undefined,
        autoPublish: values.autoPublish,
      })
      toast.success("Paiement enregistré avec succès")
      if (defaultPostId) {
        router.push(`/admin/annonces/${defaultPostId}`)
      } else {
        router.push("/admin/paiements")
      }
    } catch (error) {
      toast.error("Erreur lors de l'enregistrement")
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={defaultPostId ? `/admin/annonces/${defaultPostId}` : "/admin/paiements"}>
            <ArrowLeft className="size-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Nouveau paiement
          </h1>
          <p className="text-muted-foreground">
            Enregistrez un paiement manuel pour une annonce
          </p>
        </div>
      </div>

      {/* Form Card */}
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Détails du paiement</CardTitle>
        </CardHeader>
        <CardContent>
          <PaymentForm
            defaultPostId={defaultPostId || undefined}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        </CardContent>
      </Card>
    </div>
  )
}
