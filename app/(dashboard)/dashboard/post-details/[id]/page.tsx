"use client"

import { PostLocation } from "@/components/post/post-location"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import postImagePlaceholder from "@/public/images/post-image-placeholder.jpg"
import { useQuery } from "convex/react"
import {
  Contact as ContactIcon,
  FileText as FileTextIcon,
  Globe,
  Mail,
  Map,
  MapPin as MapPinIcon,
  Phone,
  Tag as TagIcon,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { use } from "react"

const DashboardPostDetails = ({
  params,
}: {
  params: Promise<{ id: Id<"posts"> }>
}) => {
  const resolvedParams = use(params)
  const postId = resolvedParams.id as Id<"posts">

  const post = useQuery(api.posts.getPostById, { postId })

  if (post === undefined) {
    return (
      <div className="p-4 pt-0">
        <h1 className="text-4xl font-bold">Infos sur le post</h1>

        <div className="my-4 max-w-5xl">
          <div className="w-full max-w-2xl cursor-default border-l-8">
            <Card className="flex border-none p-0 shadow-none transition-colors max-sm:flex-col sm:items-end">
              <div className="flex w-[180px] items-center justify-center pl-4 max-sm:pt-4">
                <AspectRatio ratio={1} className="bg-muted">
                  <Skeleton className="h-full w-full" />
                </AspectRatio>
              </div>

              <div className="flex-1 pl-4">
                <div className="flex flex-col space-y-2 pt-4 tracking-tight">
                  <Skeleton className="h-8 w-3/4" />
                  <Skeleton className="mb-2 h-4 w-full" />
                  <div className="flex flex-col space-y-2 pt-2 sm:flex-row sm:space-y-0 sm:space-x-2">
                    <Skeleton className="h-10 w-full sm:w-32" />
                    <Skeleton className="h-10 w-full sm:w-32" />
                    <Skeleton className="h-10 w-full sm:w-32" />
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <div className="mt-10 grid max-w-4xl grid-cols-1 gap-6 lg:grid-cols-2">
            <Card className="p-5 shadow-sm transition-all hover:shadow-md">
              <div className="mb-3 flex items-center gap-2">
                <TagIcon className="h-5 w-5 text-primary" />
                <h3 className="text-xl font-semibold tracking-tight">
                  Catégorie
                </h3>
              </div>
              <Skeleton className="h-5 w-1/2" />
            </Card>

            <Card className="p-5 shadow-sm transition-all hover:shadow-md">
              <div className="mb-3 flex items-center gap-2">
                <FileTextIcon className="h-5 w-5 text-primary" />
                <h3 className="text-xl font-semibold tracking-tight">
                  Détails et description
                </h3>
              </div>
              <div className="space-y-2">
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-2/3" />
              </div>
            </Card>

            <Card className="p-5 shadow-sm transition-all hover:shadow-md">
              <div className="mb-3 flex items-center gap-2">
                <MapPinIcon className="h-5 w-5 text-primary" />
                <h3 className="text-xl font-semibold tracking-tight">
                  Localisation
                </h3>
              </div>
              <div className="space-y-2">
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-3/4" />
              </div>
            </Card>

            <Card className="p-5 shadow-sm transition-all hover:shadow-md">
              <div className="mb-3 flex items-center gap-2">
                <ContactIcon className="h-5 w-5 text-primary" />
                <h3 className="text-xl font-semibold tracking-tight">
                  Contacts
                </h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4 rounded-full" />
                  <Skeleton className="h-5 w-1/2" />
                </div>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4 rounded-full" />
                  <Skeleton className="h-5 w-2/3" />
                </div>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4 rounded-full" />
                  <Skeleton className="h-5 w-1/2" />
                </div>
              </div>
            </Card>

            {/* Section de la carte qui occupe toute la largeur */}
            <Card className="col-span-1 p-5 shadow-sm transition-all hover:shadow-md lg:col-span-2">
              <div className="mb-3 flex items-center gap-2">
                <Map className="h-5 w-5 text-primary" />
                <h3 className="text-xl font-semibold tracking-tight">Carte</h3>
              </div>
              <Skeleton className="h-[400px] w-full" />
            </Card>
          </div>
        </div>
      </div>
    )
  }

  if (post === null) {
    notFound()
  }

  return (
    <div className="p-4 pt-0">
      <h1 className="text-4xl font-bold">Infos sur le post</h1>

      <div className="my-4 max-w-5xl">
        <div className="w-full max-w-2xl cursor-default border-l-8">
          <Card className="flex border-none p-0 shadow-none transition-colors max-sm:flex-col sm:items-end">
            <div className="flex w-[180px] items-center justify-center pl-4 max-sm:pt-4">
              <AspectRatio ratio={1} className="bg-muted">
                <Image
                  src={post.businessImageUrl || postImagePlaceholder}
                  alt="Business image"
                  className="rounded-md object-cover"
                  priority
                  // placeholder="blur"
                  fill
                />
              </AspectRatio>
            </div>

            <div className="flex-1 pl-4">
              <div className="flex flex-col space-y-0 pt-4 tracking-tight">
                <h1 className="text-3xl font-bold">{post.businessName}</h1>
                <p className="pb-2 text-muted-foreground">
                  {`${post.address}, ${post.city} ${post.province} ${post.postalCode}`}
                </p>
                <div className="flex flex-col space-y-2 pt-0 sm:flex-row sm:space-y-0 sm:space-x-2">
                  <Button className="w-full sm:w-auto" asChild>
                    <Link href={`tel:${post.phone}`} target="_blank">
                      <Phone className="mr-2 h-4 w-4" />
                      Téléphone
                    </Link>
                  </Button>
                  <Button className="w-full sm:w-auto" asChild>
                    <Link href={`mailto:${post.email}`} target="_blank">
                      <Mail className="mr-2 h-4 w-4" />
                      Courriel
                    </Link>
                  </Button>
                  {post.website && (
                    <Button className="w-full sm:w-auto" asChild>
                      <Link href={post.website} target="_blank">
                        <Globe className="mr-2 h-4 w-4" />
                        Site web
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="mt-10 grid max-w-4xl grid-cols-1 gap-6 lg:grid-cols-2">
          <Card className="p-5 shadow-sm transition-all hover:shadow-md">
            <div className="mb-3 flex items-center gap-2">
              <TagIcon className="h-5 w-5 text-primary" />
              <h3 className="text-xl font-semibold tracking-tight">
                Catégorie
              </h3>
            </div>
            <p className="text-muted-foreground">{post.category}</p>
          </Card>

          <Card className="p-5 shadow-sm transition-all hover:shadow-md">
            <div className="mb-3 flex items-center gap-2">
              <FileTextIcon className="h-5 w-5 text-primary" />
              <h3 className="text-xl font-semibold tracking-tight">
                Détails et description
              </h3>
            </div>
            {post.description ? (
              <p className="text-muted-foreground">{post.description}</p>
            ) : (
              <p className="text-muted-foreground italic">Aucune description</p>
            )}
          </Card>

          <Card className="p-5 shadow-sm transition-all hover:shadow-md">
            <div className="mb-3 flex items-center gap-2">
              <MapPinIcon className="h-5 w-5 text-primary" />
              <h3 className="text-xl font-semibold tracking-tight">
                Localisation
              </h3>
            </div>
            <div className="text-muted-foreground">
              <p>{post.address}</p>
              <p>
                {post.city}, {post.province}
              </p>
            </div>
          </Card>

          <Card className="p-5 shadow-sm transition-all hover:shadow-md">
            <div className="mb-3 flex items-center gap-2">
              <ContactIcon className="h-5 w-5 text-primary" />
              <h3 className="text-xl font-semibold tracking-tight">Contacts</h3>
            </div>
            <div className="space-y-2 text-muted-foreground">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <p>{post.phone}</p>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <p>{post.email}</p>
              </div>
              {post.website && (
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <Link
                    href={post.website}
                    target="_blank"
                    className="text-primary hover:underline"
                  >
                    {post.website}
                  </Link>
                </div>
              )}
            </div>
          </Card>

          {/* Section de la carte qui occupe toute la largeur */}
          <Card className="col-span-1 p-5 shadow-sm transition-all hover:shadow-md lg:col-span-2">
            <div className="mb-3 flex items-center gap-2">
              <Map className="h-5 w-5 text-primary" />
              <h3 className="text-xl font-semibold tracking-tight">Carte</h3>
            </div>
            {post.geo?.longitude && post.geo?.latitude ? (
              <div className="h-[400px] w-full">
                <PostLocation
                  longitude={post.geo.longitude}
                  latitude={post.geo.latitude}
                />
              </div>
            ) : (
              <div className="flex h-[400px] items-center justify-center rounded-md border border-dashed bg-muted/20">
                <p className="text-muted-foreground">
                  Aucune localisation disponible
                </p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}

export default DashboardPostDetails
