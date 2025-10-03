"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { api } from "@/convex/_generated/api"
import type { Doc } from "@/convex/_generated/dataModel"
import { useQuery } from "convex/react"
import {
  Building2,
  Globe,
  Mail,
  MapPin,
  Phone,
  Search,
  TrendingUp,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

const PostCard = ({ post }: { post: Doc<"posts"> }) => {
  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-lg">
      <CardHeader className="p-0">
        {post.businessImageUrl ? (
          <div className="relative aspect-video overflow-hidden bg-muted">
            <Image
              src={post.businessImageUrl}
              alt={post.businessName}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        ) : (
          <div className="relative flex aspect-video items-center justify-center bg-muted">
            <Building2 className="h-16 w-16 text-muted-foreground/40" />
          </div>
        )}
      </CardHeader>

      <CardContent className="p-4">
        {/* En-tête */}
        <div className="mb-3">
          <div className="mb-2 flex items-start justify-between gap-2">
            <h3 className="line-clamp-2 text-lg leading-tight font-semibold group-hover:text-primary">
              {post.businessName}
            </h3>
            <Badge variant="secondary" className="shrink-0">
              {post.category}
            </Badge>
          </div>

          {post.description && (
            <p className="line-clamp-2 text-sm text-muted-foreground">
              {post.description}
            </p>
          )}
        </div>

        {/* Informations */}
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4 shrink-0" />
            <span className="truncate">
              {post.city}, {post.province}
            </span>
          </div>

          <div className="flex items-center gap-2 text-muted-foreground">
            <Phone className="h-4 w-4 shrink-0" />
            <span className="truncate">{post.phone}</span>
          </div>

          {post.email && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Mail className="h-4 w-4 shrink-0" />
              <span className="truncate">{post.email}</span>
            </div>
          )}

          {post.website && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Globe className="h-4 w-4 shrink-0" />
              <a
                href={post.website}
                target="_blank"
                rel="noopener noreferrer"
                className="truncate hover:text-primary hover:underline"
              >
                {post.website}
              </a>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="mt-4 flex gap-2">
          <Button asChild variant="default" size="sm" className="flex-1">
            <Link href={`/annonce/${post._id}`}>
              <TrendingUp className="mr-2 h-4 w-4" />
              Voir les détails
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

const LoadingSkeleton = () => {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {[...Array(6)].map((_, i) => (
        <Card key={i} className="overflow-hidden">
          <Skeleton className="aspect-video w-full" />
          <CardContent className="space-y-3 p-4">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export const SearchResults = () => {
  const searchParams = useSearchParams()

  const searchTerm = searchParams.get("q") || undefined
  const category =
    searchParams.get("category") === "all"
      ? undefined
      : searchParams.get("category") || undefined
  const province =
    searchParams.get("province") === "all"
      ? undefined
      : searchParams.get("province") || undefined
  const city = searchParams.get("city") || undefined

  const posts = useQuery(api.posts.searchPostsAdvanced, {
    searchTerm,
    category,
    province,
    city,
  })

  if (posts === undefined) {
    return <LoadingSkeleton />
  }

  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16 text-center">
        <div className="mb-4 rounded-full bg-muted p-4">
          <Search className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="mb-2 text-lg font-semibold">Aucun résultat trouvé</h3>
        <p className="mb-4 max-w-md text-sm text-muted-foreground">
          Essayez de modifier vos critères de recherche ou explorez
          d&apos;autres catégories.
        </p>
        <Button asChild variant="outline">
          <Link href="/recherche">Réinitialiser la recherche</Link>
        </Button>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">{posts.length}</span>{" "}
          résultat{posts.length > 1 ? "s" : ""} trouvé
          {posts.length > 1 ? "s" : ""}
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <PostCard key={post._id} post={post} />
        ))}
      </div>
    </div>
  )
}
