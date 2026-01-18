"use client"

import { useMutation } from "convex/react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PostForm } from "@/components/admin/post-form"

export default function NewAnnoncePage() {
  const router = useRouter()
  const createPost = useMutation(api.posts.create)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (values: {
    ownerType: "user" | "organization"
    userId?: string
    organizationId?: string
    businessName: string
    category: string
    description?: string
    phone: string
    email: string
    website?: string
    address: string
    city: string
    province: string
    postalCode: string
    longitude?: number
    latitude?: number
  }) => {
    setIsSubmitting(true)
    try {
      const postId = await createPost({
        userId: values.ownerType === "user" ? (values.userId as Id<"users">) : undefined,
        organizationId: values.ownerType === "organization" ? (values.organizationId as Id<"organizations">) : undefined,
        businessName: values.businessName,
        category: values.category,
        description: values.description || undefined,
        phone: values.phone,
        email: values.email,
        website: values.website || undefined,
        address: values.address,
        city: values.city,
        province: values.province,
        postalCode: values.postalCode,
        longitude: values.longitude,
        latitude: values.latitude,
      })
      toast.success("Annonce créée avec succès")
      router.push(`/admin/annonces/${postId}`)
    } catch (error) {
      toast.error("Erreur lors de la création")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/annonces">
            <ArrowLeft className="size-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Nouvelle annonce</h1>
          <p className="text-muted-foreground">
            Créez une nouvelle annonce de service
          </p>
        </div>
      </div>

      {/* Form Card */}
      <Card>
        <CardHeader>
          <CardTitle>Informations</CardTitle>
        </CardHeader>
        <CardContent>
          <PostForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
        </CardContent>
      </Card>
    </div>
  )
}
