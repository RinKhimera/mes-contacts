"use client"

import { useMutation, useQuery } from "convex/react"
import { useParams, useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { PostForm } from "@/components/admin/post-form"

export default function EditAnnoncePage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as Id<"posts">

  const post = useQuery(api.posts.getById, { id })
  const updatePost = useMutation(api.posts.update)
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
      await updatePost({
        id,
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
      toast.success("Annonce mise à jour")
      router.push(`/admin/annonces/${id}`)
    } catch (error) {
      toast.error("Erreur lors de la mise à jour")
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!post) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="size-10" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <Skeleton className="h-96" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/admin/annonces/${id}`}>
            <ArrowLeft className="size-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Modifier {post.businessName}
          </h1>
          <p className="text-muted-foreground">
            Modifiez les informations de l&apos;annonce
          </p>
        </div>
      </div>

      {/* Form Card */}
      <Card>
        <CardHeader>
          <CardTitle>Informations</CardTitle>
        </CardHeader>
        <CardContent>
          <PostForm
            post={post}
            postId={id}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        </CardContent>
      </Card>
    </div>
  )
}
