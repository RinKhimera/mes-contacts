"use client"

import { useQuery } from "convex/react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import {
  ArrowLeft,
  Calendar,
  FileText,
  Globe,
  Mail,
  MapPin,
  Pencil,
  Phone,
} from "lucide-react"

import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { MemberManager } from "@/components/admin/member-manager"
import { getInitials } from "@/lib/utils"
import { provinces } from "@/constants"

export default function OrganizationDetailsPage() {
  const params = useParams()
  const id = params.id as Id<"organizations">

  const organization = useQuery(api.organizations.getById, { id })
  const posts = useQuery(api.posts.list, { limit: 100 })
  const owner = useQuery(
    api.users.getById,
    organization ? { id: organization.ownerId } : "skip"
  )

  const orgPosts = posts?.filter((p) => p.organizationId === id) || []

  if (!organization) {
    return <OrganizationDetailsSkeleton />
  }

  const provinceName = provinces.find(
    (p) => p.value === organization.province
  )?.label

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/admin/organisations">
              <ArrowLeft className="size-4" />
            </Link>
          </Button>
          <Avatar className="size-16 rounded-xl">
            <AvatarImage src={organization.logo || ""} alt={organization.name} />
            <AvatarFallback className="rounded-xl bg-primary/10 text-xl font-semibold text-primary">
              {getInitials(organization.name)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              {organization.name}
            </h1>
            <div className="flex items-center gap-2 text-muted-foreground">
              {organization.sector && (
                <Badge variant="secondary">{organization.sector}</Badge>
              )}
              <span className="text-sm">
                Créée le{" "}
                {format(new Date(organization._creationTime), "d MMMM yyyy", {
                  locale: fr,
                })}
              </span>
            </div>
          </div>
        </div>
        <Button asChild>
          <Link href={`/admin/organisations/${id}/edit`}>
            <Pencil className="mr-2 size-4" />
            Modifier
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Info */}
        <div className="space-y-6 lg:col-span-2">
          {/* Description */}
          {organization.description && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {organization.description}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Contact Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Coordonnées</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                {organization.phone && (
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
                      <Phone className="size-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Téléphone</p>
                      <p className="font-medium">{organization.phone}</p>
                    </div>
                  </div>
                )}
                {organization.email && (
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
                      <Mail className="size-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium">{organization.email}</p>
                    </div>
                  </div>
                )}
                {organization.website && (
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
                      <Globe className="size-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Site web</p>
                      <a
                        href={organization.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-primary hover:underline"
                      >
                        {organization.website}
                      </a>
                    </div>
                  </div>
                )}
                {(organization.address || organization.city) && (
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
                      <MapPin className="size-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Adresse</p>
                      <p className="font-medium">
                        {organization.address && `${organization.address}, `}
                        {organization.city}
                        {organization.province && `, ${provinceName}`}
                        {organization.postalCode &&
                          ` ${organization.postalCode}`}
                      </p>
                    </div>
                  </div>
                )}
              </div>
              {!organization.phone &&
                !organization.email &&
                !organization.website &&
                !organization.address && (
                  <p className="text-sm text-muted-foreground">
                    Aucune coordonnée renseignée
                  </p>
                )}
            </CardContent>
          </Card>

          {/* Members */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Membres</CardTitle>
            </CardHeader>
            <CardContent>
              <MemberManager organizationId={id} />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Owner */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Propriétaire</CardTitle>
            </CardHeader>
            <CardContent>
              {owner ? (
                <div className="flex items-center gap-3">
                  <Avatar className="size-10">
                    <AvatarImage src={owner.image} />
                    <AvatarFallback>{getInitials(owner.name)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{owner.name}</p>
                    <p className="text-sm text-muted-foreground">{owner.email}</p>
                  </div>
                </div>
              ) : (
                <Skeleton className="h-10 w-full" />
              )}
            </CardContent>
          </Card>

          {/* Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Statistiques</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="size-4 text-muted-foreground" />
                  <span className="text-sm">Annonces</span>
                </div>
                <span className="font-medium">{orgPosts.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="size-4 text-muted-foreground" />
                  <span className="text-sm">Dernière mise à jour</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {format(new Date(organization.updatedAt), "d MMM yyyy", {
                    locale: fr,
                  })}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Organization Posts */}
          {orgPosts.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Annonces récentes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {orgPosts.slice(0, 5).map((post) => (
                    <Link
                      key={post._id}
                      href={`/admin/annonces/${post._id}`}
                      className="block rounded-lg border p-3 transition-colors hover:bg-muted"
                    >
                      <p className="font-medium">{post.businessName}</p>
                      <p className="text-sm text-muted-foreground">
                        {post.category}
                      </p>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

function OrganizationDetailsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Skeleton className="size-10" />
        <Skeleton className="size-16 rounded-xl" />
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
        </div>
        <div className="space-y-6">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
      </div>
    </div>
  )
}
