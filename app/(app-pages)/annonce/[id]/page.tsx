"use client"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { api } from "@/convex/_generated/api"
import type { Id } from "@/convex/_generated/dataModel"
import { useQuery } from "convex/react"
import { AlertCircle, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { use } from "react"
import { PostDetailContent } from "./_components/post-detail-content"
import { PostDetailMap } from "./_components/post-detail-map"

const LoadingSkeleton = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb skeleton */}
      <div className="mb-6 flex items-center gap-2">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-1" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-1" />
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-1" />
        <Skeleton className="h-4 w-40" />
      </div>

      {/* Contenu principal */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Colonne gauche - Détails */}
        <div className="space-y-6">
          {/* Image */}
          <Skeleton className="aspect-video w-full rounded-lg" />

          {/* Titre et badge */}
          <div className="space-y-2">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-5 w-24" />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>

          {/* Informations de contact */}
          <div className="space-y-3">
            <Skeleton className="h-6 w-48" />
            <div className="space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="flex gap-3">
            <Skeleton className="h-10 flex-1" />
            <Skeleton className="h-10 flex-1" />
          </div>
        </div>

        {/* Colonne droite - Carte */}
        <div className="lg:sticky lg:top-20 lg:self-start">
          <Skeleton className="h-[400px] w-full rounded-lg" />
        </div>
      </div>
    </div>
  )
}

const AnnonceDetailsPage = ({
  params,
}: {
  params: Promise<{ id: string }>
}) => {
  const { id } = use(params)
  const postId = id as Id<"posts">
  const post = useQuery(api.posts.getPostById, { postId })

  // Loading state
  if (post === undefined) {
    return <LoadingSkeleton />
  }

  // Post not found
  if (post === null) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Alert variant="destructive" className="mx-auto max-w-2xl">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Annonce non trouvée</AlertTitle>
          <AlertDescription>
            Cette annonce n&apos;existe pas ou a été supprimée.
          </AlertDescription>
        </Alert>
        <div className="mt-6 text-center">
          <Button asChild variant="outline">
            <Link href="/recherche">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour à la recherche
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  // Post is not published
  if (post.status !== "PUBLISHED") {
    return (
      <div className="container mx-auto px-4 py-16">
        <Alert className="mx-auto max-w-2xl">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Annonce non disponible</AlertTitle>
          <AlertDescription>
            Cette annonce n&apos;est pas encore publiée ou a été désactivée.
          </AlertDescription>
        </Alert>
        <div className="mt-6 text-center">
          <Button asChild variant="outline">
            <Link href="/recherche">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour à la recherche
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">
          Accueil
        </Link>
        <span>/</span>
        <Link href="/recherche" className="hover:text-foreground">
          Recherche
        </Link>
        <span>/</span>
        <Link
          href={`/recherche?category=${encodeURIComponent(post.category)}`}
          className="hover:text-foreground"
        >
          {post.category}
        </Link>
        <span>/</span>
        <span className="font-medium text-foreground">{post.businessName}</span>
      </nav>

      {/* Contenu principal */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Colonne gauche - Détails */}
        <div>
          <PostDetailContent post={post} />
        </div>

        {/* Colonne droite - Carte */}
        <div className="lg:sticky lg:top-20 lg:self-start">
          <PostDetailMap
            longitude={post.geo?.longitude}
            latitude={post.geo?.latitude}
            businessName={post.businessName}
          />
        </div>
      </div>
    </div>
  )
}

export default AnnonceDetailsPage
