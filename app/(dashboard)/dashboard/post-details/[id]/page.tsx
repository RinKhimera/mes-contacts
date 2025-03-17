import { PostLocation } from "@/components/post/post-location"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import postImagePlaceholder from "@/public/images/post-image-placeholder.jpg"
import { getPostById } from "@/server/actions/post"
// import { clerkClient } from "@clerk/nextjs/server"
import { Globe, Mail, Phone } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"

const DashboardPostDetails = async ({
  params,
}: {
  params: Promise<{ id: string }>
}) => {
  const post = await getPostById((await params).id)
  if (!post) notFound()

  // const client = await clerkClient()
  // const user = await client.users.getUser(post.authorId)
  // const authorName = user.fullName

  return (
    <div className="p-4 pt-0">
      <h1 className="text-4xl font-bold">Infos sur le post</h1>

      <div className="my-4 max-w-5xl">
        <div className="w-full max-w-2xl cursor-default border-l-8">
          <Card className="flex border-none p-0 transition-colors max-sm:flex-col sm:items-end">
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
                <p className="text-muted-foreground pb-2">
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

        <div className="mt-10 grid max-w-4xl grid-cols-1 gap-8 lg:grid-cols-2">
          <div>
            <h3 className="text-2xl font-semibold tracking-tight">Catégorie</h3>
            <p>{post.category}</p>
          </div>

          <div>
            <h3 className="text-2xl font-semibold tracking-tight">
              Détails et description
            </h3>
            {post.description ? (
              <p>{post.description}</p>
            ) : (
              <p className="text-muted-foreground italic">Aucune description</p>
            )}
          </div>

          <div>
            <h3 className="text-2xl font-semibold tracking-tight">
              Localisation
            </h3>

            <p>
              {post.address} <br />
              {post.city}, {post.province}
            </p>
          </div>

          <div>
            <h3 className="text-2xl font-semibold tracking-tight">Contacts</h3>
            <TooltipProvider>
              <div className="flex flex-col items-start">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button className="w-full text-left">Téléphone</button>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>{post.phone}</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <button className="w-full text-left">Courriel</button>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>{post.email}</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </TooltipProvider>
          </div>
          {post.longitude && post.latitude ? (
            <PostLocation longitude={post.longitude} latitude={post.latitude} />
          ) : (
            <div className="col-span-full lg:col-span-2">
              <h3 className="text-2xl font-semibold tracking-tight">Carte</h3>
              <div className="bg-muted/20 flex h-[400px] items-center justify-center rounded-md border border-dashed">
                <p className="text-muted-foreground">
                  Aucune localisation disponible
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default DashboardPostDetails
