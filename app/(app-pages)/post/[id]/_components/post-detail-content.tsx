"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import type { Doc } from "@/convex/_generated/dataModel"
import { Building2, Globe, Mail, MapPin, Phone, Share2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { toast } from "sonner"

type PostDetailContentProps = {
  post: Doc<"posts">
}

export function PostDetailContent({ post }: PostDetailContentProps) {
  const handleShare = async () => {
    const url = window.location.href
    const title = post.businessName

    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: `Découvrez ${post.businessName} sur Mescontacts.ca`,
          url,
        })
      } catch (error) {
        console.log("Error sharing:", error)
      }
    } else {
      await navigator.clipboard.writeText(url)
      toast.success("Lien copié dans le presse-papier")
    }
  }

  return (
    <div className="space-y-6">
      {/* Image principale */}
      <div className="relative aspect-video overflow-hidden rounded-lg border bg-muted">
        {post.businessImageUrl ? (
          <Image
            src={post.businessImageUrl}
            alt={post.businessName}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Building2 className="h-24 w-24 text-muted-foreground/40 md:h-32 md:w-32" />
          </div>
        )}
      </div>

      {/* En-tête avec titre et badge */}
      <div>
        <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
          <div className="flex-1">
            <h1 className="mb-2 text-3xl font-bold tracking-tight md:text-4xl">
              {post.businessName}
            </h1>
            <Badge variant="secondary" className="text-sm">
              <Building2 className="mr-1 h-3 w-3" />
              {post.category}
            </Badge>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleShare}
            className="gap-2"
          >
            <Share2 className="h-4 w-4" />
            Partager
          </Button>
        </div>

        {post.description && (
          <p className="text-lg text-muted-foreground">{post.description}</p>
        )}
      </div>

      <Separator />

      {/* Informations de contact */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5 text-primary" />
            Coordonnées
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Téléphone */}
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-primary/10 p-2">
                <Phone className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Téléphone
                </p>
                <a
                  href={`tel:${post.phone}`}
                  className="font-medium hover:text-primary hover:underline"
                >
                  {post.phone}
                </a>
              </div>
            </div>

            {/* Email */}
            {post.email && (
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-primary/10 p-2">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    Email
                  </p>
                  <a
                    href={`mailto:${post.email}`}
                    className="font-medium break-all hover:text-primary hover:underline"
                  >
                    {post.email}
                  </a>
                </div>
              </div>
            )}

            {/* Site web */}
            {post.website && (
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-primary/10 p-2">
                  <Globe className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    Site web
                  </p>
                  <a
                    href={post.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium break-all hover:text-primary hover:underline"
                  >
                    {post.website}
                  </a>
                </div>
              </div>
            )}

            {/* Adresse */}
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-primary/10 p-2">
                <MapPin className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Adresse
                </p>
                <p className="font-medium">
                  {post.address}
                  <br />
                  {post.city}, {post.province} {post.postalCode}
                </p>
              </div>
            </div>
          </div>

          {/* Bouton de contact principal */}
          <div className="pt-4">
            <Button asChild size="lg" className="w-full gap-2">
              <a href={`tel:${post.phone}`}>
                <Phone className="h-5 w-5" />
                Appeler maintenant
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        <Button asChild variant="outline" className="flex-1">
          <Link href="/recherche">← Retour à la recherche</Link>
        </Button>
        <Button asChild variant="outline" className="flex-1">
          <Link
            href={`/recherche?category=${encodeURIComponent(post.category)}`}
          >
            Voir plus de {post.category}
          </Link>
        </Button>
      </div>
    </div>
  )
}
