"use client"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { api } from "@/convex/_generated/api"
import type { Id } from "@/convex/_generated/dataModel"
import { useQuery } from "convex/react"
import { AlertCircle, ArrowLeft, FileEdit } from "lucide-react"
import dynamic from "next/dynamic"
import Link from "next/link"
import { use } from "react"

const PostFormWithNoSSR = dynamic(() => import("@/components/post/post-form"), {
  ssr: false,
})

const LoadingSkeleton = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header skeleton */}
      <div className="mb-8 flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-5 w-96" />
        </div>
        <Skeleton className="h-12 w-12 rounded-full" />
      </div>

      <Separator className="mb-8" />

      {/* Form skeleton */}
      <div className="mx-auto max-w-3xl space-y-6">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    </div>
  )
}

const EditPost = (props: { params: Promise<{ id: Id<"posts"> }> }) => {
  const params = use(props.params)
  const id = params.id as Id<"posts">

  const post = useQuery(api.posts.getPostById, { postId: id })

  if (post === undefined) {
    return <LoadingSkeleton />
  }

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
            <Link href="/dashboard/my-posts">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour à mes annonces
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight">
              Modifier une annonce
            </h1>
            <Badge
              variant="outline"
              className="flex h-10 w-10 items-center justify-center rounded-full border-primary/20 bg-primary/10 p-0"
            >
              <FileEdit className="h-5 w-5 text-primary" />
            </Badge>
          </div>
          <p className="text-muted-foreground">
            Modifiez les informations de votre annonce pour la mettre à jour
          </p>
        </div>
      </div>

      <Separator className="mb-8" />

      {/* Info card */}
      <Card className="mb-8 border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/30">
        <CardHeader className="pb-3">
          <h3 className="font-semibold text-blue-900 dark:text-blue-100">
            💡 Conseils pour modifier votre annonce
          </h3>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
            <li className="flex gap-2">
              <span className="font-medium">•</span>
              <span>
                Les modifications seront visibles immédiatement pour les
                annonces publiées
              </span>
            </li>
            <li className="flex gap-2">
              <span className="font-medium">•</span>
              <span>
                Assurez-vous que toutes les informations sont à jour et exactes
              </span>
            </li>
            <li className="flex gap-2">
              <span className="font-medium">•</span>
              <span>
                Vous pouvez modifier l&apos;image de votre annonce à tout moment
              </span>
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* Form */}
      <PostFormWithNoSSR post={post} />
    </div>
  )
}

export default EditPost
