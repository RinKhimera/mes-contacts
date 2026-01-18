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
import { OrganizationForm } from "@/components/admin/organization-form"

export default function EditOrganizationPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as Id<"organizations">

  const organization = useQuery(api.organizations.getById, { id })
  const updateOrg = useMutation(api.organizations.update)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (values: {
    name: string
    ownerId: string
    description?: string
    sector?: string
    phone?: string
    email?: string
    website?: string
    address?: string
    city?: string
    province?: string
    postalCode?: string
  }) => {
    setIsSubmitting(true)
    try {
      await updateOrg({
        id,
        name: values.name,
        description: values.description || undefined,
        sector: values.sector || undefined,
        phone: values.phone || undefined,
        email: values.email || undefined,
        website: values.website || undefined,
        address: values.address || undefined,
        city: values.city || undefined,
        province: values.province || undefined,
        postalCode: values.postalCode || undefined,
      })
      toast.success("Organisation mise à jour")
      router.push(`/admin/organisations/${id}`)
    } catch (error) {
      toast.error("Erreur lors de la mise à jour")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!organization) {
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
          <Link href={`/admin/organisations/${id}`}>
            <ArrowLeft className="size-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Modifier {organization.name}
          </h1>
          <p className="text-muted-foreground">
            Modifiez les informations de l&apos;organisation
          </p>
        </div>
      </div>

      {/* Form Card */}
      <Card>
        <CardHeader>
          <CardTitle>Informations</CardTitle>
        </CardHeader>
        <CardContent>
          <OrganizationForm
            organization={organization}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        </CardContent>
      </Card>
    </div>
  )
}
