"use client"

import { PostActions } from "@/components/dashboard/post-actions"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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
import { useConvexAuth, useQuery } from "convex/react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import Link from "next/link"

const MyPosts = () => {
  const { isAuthenticated } = useConvexAuth()
  const userPosts = useQuery(
    api.posts.getCurrentUserPosts,
    isAuthenticated ? undefined : "skip",
  )

  if (userPosts === undefined) {
    return (
      <div className="p-4 pt-0">
        <h1 className="text-4xl font-bold">Mes annonces</h1>

        <div className="@container my-4">
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
    <div className="p-4 pt-0">
      <h1 className="text-4xl font-bold">Mes annonces</h1>

      <div className="@container my-4">
        <Table className="table-fixed">
          <TableCaption>Liste de vos annonces</TableCaption>
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
                <TableCell colSpan={5} className="space-y-5 text-center">
                  <p className="text-muted-foreground italic">
                    Vous n&apos;avez pas encore publié d&apos;annonce !
                  </p>
                  <Button variant={"secondary"} asChild>
                    <Link href="/dashboard/new-post">Créer une annonce</Link>
                  </Button>
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
