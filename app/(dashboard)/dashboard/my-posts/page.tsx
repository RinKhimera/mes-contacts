"use client"

import { PostActions } from "@/components/dashboard/post-actions"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { api } from "@/convex/_generated/api"
import { useCurrentUser } from "@/hooks/useCurrentUser"
import { useQuery } from "convex/react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { FileText, Plus, TrendingUp } from "lucide-react"
import Link from "next/link"

const MyPosts = () => {
  const { currentUser, isLoading: isUserLoading } = useCurrentUser()
  const userPosts = useQuery(
    api.posts.getCurrentUserPosts,
    currentUser ? {} : "skip",
  )

  // Calculer les statistiques rapides
  const publishedCount =
    userPosts?.filter((p) => p.status === "PUBLISHED").length || 0
  const draftCount = userPosts?.filter((p) => p.status === "DRAFT").length || 0

  if (isUserLoading || userPosts === undefined) {
    return (
      <div className="container mx-auto px-4 py-8">
        {/* En-tête skeleton */}
        <div className="mb-8 space-y-3">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-6 w-96" />
        </div>

        {/* Stats skeleton */}
        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardContent className="pt-6">
                <Skeleton className="mb-2 h-4 w-20" />
                <Skeleton className="h-8 w-12" />
              </CardContent>
            </Card>
          ))}
        </div>

        <Separator className="mb-8" />

        {/* Table skeleton */}
        <div className="@container">
          <Table className="table-fixed">
            <TableCaption>Chargement de vos annonces...</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="hidden @md:table-cell @md:w-1/5 @lg:w-1/5">
                  Catégorie
                </TableHead>
                <TableHead className="w-2/5 @md:w-1/4 @lg:w-1/4">
                  Nom de l&apos;annonce
                </TableHead>
                <TableHead className="hidden w-1/6 @lg:table-cell">
                  Date de création
                </TableHead>
                <TableHead className="w-2/5 whitespace-nowrap @md:w-1/6">
                  Statut
                </TableHead>
                <TableHead className="w-1/5 @md:w-1/6 @xl:w-1/5">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array(5)
                .fill(0)
                .map((_, index) => (
                  <TableRow key={index}>
                    <TableCell className="hidden font-medium @md:table-cell">
                      <Skeleton className="h-5 w-full" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-full" />
                    </TableCell>
                    <TableCell className="hidden @lg:table-cell">
                      <Skeleton className="h-5 w-24" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-20" />
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <Skeleton className="h-8 w-8 rounded-full" />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* En-tête */}
      <div className="mb-8">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
              Mes annonces
            </h1>
          </div>
          <Button asChild>
            <Link href="/dashboard/new-post">
              <Plus className="mr-2 h-4 w-4" />
              Nouvelle annonce
            </Link>
          </Button>
        </div>
        <p className="text-lg text-muted-foreground">
          Gérez toutes vos annonces et suivez leurs performances.
        </p>
      </div>

      {/* Statistiques rapides */}
      {userPosts.length > 0 && (
        <>
          <div className="mb-6 grid gap-4 sm:grid-cols-3">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Total
                    </p>
                    <p className="text-2xl font-bold">{userPosts.length}</p>
                  </div>
                  <FileText className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Publiées
                    </p>
                    <p className="text-2xl font-bold">{publishedCount}</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Brouillons
                    </p>
                    <p className="text-2xl font-bold">{draftCount}</p>
                  </div>
                  <FileText className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Separator className="mb-8" />
        </>
      )}

      {/* Table des annonces */}
      <div className="@container">
        <Table className="table-fixed">
          <TableCaption>
            {userPosts.length > 0
              ? "Liste complète de vos annonces"
              : "Aucune annonce pour le moment"}
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="hidden @md:table-cell @md:w-1/5 @lg:w-1/5">
                Catégorie
              </TableHead>
              <TableHead className="w-2/5 @md:w-1/4 @lg:w-1/4">
                Nom de l&apos;annonce
              </TableHead>
              <TableHead className="hidden w-1/6 @lg:table-cell">
                Date de création
              </TableHead>
              <TableHead className="w-2/5 whitespace-nowrap @md:w-1/6">
                Statut
              </TableHead>
              <TableHead className="w-1/5 @md:w-1/6 @xl:w-1/5">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {userPosts.length !== 0 ? (
              userPosts.map((post) => (
                <TableRow key={post._id}>
                  <TableCell className="hidden font-medium @md:table-cell">
                    <div className="line-clamp-2" title={post.category}>
                      {post.category}
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="line-clamp-2" title={post.businessName}>
                      {post.businessName}
                    </div>
                  </TableCell>

                  <TableCell className="hidden @lg:table-cell">
                    {format(post._creationTime, "P", { locale: fr })}
                  </TableCell>

                  <TableCell className="min-w-[100px] whitespace-nowrap">
                    {post.status === "PUBLISHED" && (
                      <Badge
                        variant={"published"}
                        className="whitespace-nowrap"
                      >
                        En ligne
                      </Badge>
                    )}
                    {post.status === "DRAFT" && (
                      <Badge variant={"draft"} className="whitespace-nowrap">
                        En attente
                      </Badge>
                    )}
                    {post.status === "DISABLED" && (
                      <Badge variant={"disabled"} className="whitespace-nowrap">
                        Désactivé
                      </Badge>
                    )}
                  </TableCell>

                  <TableCell>
                    <PostActions postId={post._id} postStatus={post.status} />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-64">
                  <div className="flex flex-col items-center justify-center space-y-4 text-center">
                    <div className="rounded-full bg-muted p-6">
                      <FileText className="h-12 w-12 text-muted-foreground" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold">
                        Aucune annonce pour le moment
                      </h3>
                      <p className="max-w-sm text-sm text-muted-foreground">
                        Commencez à partager vos services et activités en créant
                        votre première annonce.
                      </p>
                    </div>
                    <Button asChild size="lg">
                      <Link href="/dashboard/new-post">
                        <Plus className="mr-2 h-4 w-4" />
                        Créer ma première annonce
                      </Link>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export default MyPosts
