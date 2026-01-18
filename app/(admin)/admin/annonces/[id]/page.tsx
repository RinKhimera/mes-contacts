"use client"

import { useQuery, useMutation } from "convex/react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import {
  ArrowLeft,
  Building2,
  Calendar,
  Clock,
  CreditCard,
  FileText,
  Globe,
  Mail,
  MapPin,
  Pencil,
  Phone,
  User,
  Image as ImageIcon,
} from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { StatusBadge } from "@/components/admin"
import { getInitials } from "@/lib/utils"
import { provinces } from "@/constants"

export default function AnnonceDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as Id<"posts">

  const post = useQuery(api.posts.getByIdWithDetails, { id })
  const payments = useQuery(api.payments.getByPost, { postId: id })
  const statusHistory = useQuery(api.statusHistory.getByPost, { postId: id })
  const changeStatus = useMutation(api.posts.changeStatus)

  const [isChangingStatus, setIsChangingStatus] = useState(false)

  const handleStatusChange = async (newStatus: string) => {
    setIsChangingStatus(true)
    try {
      await changeStatus({
        id,
        status: newStatus as "DRAFT" | "PUBLISHED" | "EXPIRED" | "DISABLED",
      })
      toast.success("Statut mis à jour")
    } catch (error) {
      toast.error("Erreur lors de la mise à jour")
    } finally {
      setIsChangingStatus(false)
    }
  }

  if (!post) {
    return <AnnonceDetailsSkeleton />
  }

  const provinceName = provinces.find((p) => p.value === post.province)?.label

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/admin/annonces">
              <ArrowLeft className="size-4" />
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight">
                {post.businessName}
              </h1>
              <StatusBadge status={post.status} />
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Badge variant="secondary">{post.category}</Badge>
              <span className="text-sm">
                Créée le{" "}
                {format(new Date(post._creationTime), "d MMMM yyyy", {
                  locale: fr,
                })}
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={`/admin/paiements/new?postId=${id}`}>
              <CreditCard className="mr-2 size-4" />
              Enregistrer paiement
            </Link>
          </Button>
          <Button asChild>
            <Link href={`/admin/annonces/${id}/edit`}>
              <Pencil className="mr-2 size-4" />
              Modifier
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Info */}
        <div className="space-y-6 lg:col-span-2">
          {/* Description */}
          {post.description && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {post.description}
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
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
                    <Phone className="size-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Téléphone</p>
                    <p className="font-medium">{post.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
                    <Mail className="size-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{post.email}</p>
                  </div>
                </div>
                {post.website && (
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
                      <Globe className="size-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Site web</p>
                      <a
                        href={post.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-primary hover:underline"
                      >
                        {post.website}
                      </a>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
                    <MapPin className="size-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Adresse</p>
                    <p className="font-medium">
                      {post.address}, {post.city}, {provinceName} {post.postalCode}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Media Gallery */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Médias</CardTitle>
            </CardHeader>
            <CardContent>
              {post.media && post.media.length > 0 ? (
                <div className="grid grid-cols-3 gap-4">
                  {post.media.map((m) => (
                    <div
                      key={m._id}
                      className="aspect-square overflow-hidden rounded-lg bg-muted"
                    >
                      <img
                        src={m.url}
                        alt={m.altText || ""}
                        className="size-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 py-8 text-muted-foreground">
                  <ImageIcon className="size-8" />
                  <p className="text-sm">Aucun média</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Status History */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Historique des statuts</CardTitle>
            </CardHeader>
            <CardContent>
              {statusHistory && statusHistory.length > 0 ? (
                <div className="space-y-4">
                  {statusHistory.map((entry) => (
                    <div
                      key={entry._id}
                      className="flex items-start gap-4 border-l-2 border-muted pl-4"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          {entry.previousStatus && (
                            <>
                              <StatusBadge status={entry.previousStatus as any} />
                              <span className="text-muted-foreground">→</span>
                            </>
                          )}
                          <StatusBadge status={entry.newStatus as any} />
                        </div>
                        {entry.reason && (
                          <p className="mt-1 text-sm text-muted-foreground">
                            {entry.reason}
                          </p>
                        )}
                        <p className="mt-1 text-xs text-muted-foreground">
                          {format(new Date(entry._creationTime), "d MMM yyyy à HH:mm", {
                            locale: fr,
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="py-4 text-center text-sm text-muted-foreground">
                  Aucun historique
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status Control */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Gestion du statut</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="mb-2 text-sm font-medium">Statut actuel</p>
                <StatusBadge status={post.status} />
              </div>
              <div>
                <p className="mb-2 text-sm font-medium">Changer le statut</p>
                <Select
                  value={post.status}
                  onValueChange={handleStatusChange}
                  disabled={isChangingStatus}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DRAFT">Brouillon</SelectItem>
                    <SelectItem value="PUBLISHED">Publiée</SelectItem>
                    <SelectItem value="EXPIRED">Expirée</SelectItem>
                    <SelectItem value="DISABLED">Désactivée</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {post.expiresAt && (
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="size-4 text-muted-foreground" />
                  <span>
                    Expire le{" "}
                    {format(new Date(post.expiresAt), "d MMM yyyy", { locale: fr })}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Owner */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Propriétaire</CardTitle>
            </CardHeader>
            <CardContent>
              {post.owner ? (
                <div className="flex items-center gap-3">
                  <Avatar className="size-10">
                    <AvatarImage
                      src={
                        post.ownerType === "organization"
                          ? (post.owner as any).logo
                          : (post.owner as any).image
                      }
                    />
                    <AvatarFallback>
                      {getInitials((post.owner as any).name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{(post.owner as any).name}</p>
                      {post.ownerType === "organization" ? (
                        <Building2 className="size-4 text-muted-foreground" />
                      ) : (
                        <User className="size-4 text-muted-foreground" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {(post.owner as any).email}
                    </p>
                  </div>
                </div>
              ) : (
                <Skeleton className="h-10 w-full" />
              )}
            </CardContent>
          </Card>

          {/* Payments */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Paiements</CardTitle>
              <Button size="sm" variant="outline" asChild>
                <Link href={`/admin/paiements/new?postId=${id}`}>
                  <CreditCard className="mr-2 size-3" />
                  Ajouter
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              {payments && payments.length > 0 ? (
                <div className="space-y-3">
                  {payments.map((payment) => (
                    <div
                      key={payment._id}
                      className="flex items-center justify-between rounded-lg border p-3"
                    >
                      <div>
                        <p className="font-medium">
                          {(payment.amount / 100).toFixed(2)} $
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {payment.method} - {payment.durationDays} jours
                        </p>
                      </div>
                      <StatusBadge status={payment.status as any} />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="py-4 text-center text-sm text-muted-foreground">
                  Aucun paiement
                </p>
              )}
            </CardContent>
          </Card>

          {/* Created By */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Créée par</CardTitle>
            </CardHeader>
            <CardContent>
              {post.createdByUser ? (
                <div className="flex items-center gap-3">
                  <Avatar className="size-8">
                    <AvatarImage src={post.createdByUser.image} />
                    <AvatarFallback className="text-xs">
                      {getInitials(post.createdByUser.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{post.createdByUser.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(post._creationTime), "d MMM yyyy", {
                        locale: fr,
                      })}
                    </p>
                  </div>
                </div>
              ) : (
                <Skeleton className="h-8 w-full" />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function AnnonceDetailsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Skeleton className="size-10" />
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
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
