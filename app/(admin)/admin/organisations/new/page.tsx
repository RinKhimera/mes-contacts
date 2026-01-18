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
import { OrganizationForm } from "@/components/admin/organization-form"

export default function NewOrganizationPage() {
  const router = useRouter()
  const createOrg = useMutation(api.organizations.create)
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
      const orgId = await createOrg({
        name: values.name,
        ownerId: values.ownerId as Id<"users">,
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
      toast.success("Organisation créée avec succès")
      router.push(`/admin/organisations/${orgId}`)
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
          <Link href="/admin/organisations">
            <ArrowLeft className="size-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Nouvelle organisation
          </h1>
          <p className="text-muted-foreground">
            Créez une nouvelle entreprise ou organisation
          </p>
        </div>
      </div>

      {/* Form Card */}
      <Card>
        <CardHeader>
          <CardTitle>Informations</CardTitle>
        </CardHeader>
        <CardContent>
          <OrganizationForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
        </CardContent>
      </Card>
    </div>
  )
}
