import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import postImagePlaceholder from "@/public/images/post-image-placeholder.jpg"
import { auth } from "@clerk/nextjs/server"
import type { Post } from "@prisma/client"
import { Globe, Mail, Phone } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export const PostCard = async ({ post }: { post: Post }) => {
  const { userId } = await auth()

  return (
    <div className="w-full max-w-2xl cursor-default md:ml-5">
      <Card className="bg-muted hover:bg-muted/50 flex p-0 transition-colors max-sm:flex-col">
        <div className="flex w-[180px] items-center justify-center pl-6 max-sm:pt-4 sm:pl-4">
          <AspectRatio ratio={1} className="bg-muted">
            <Image
              src={post.businessImageUrl || postImagePlaceholder}
              alt="Business image"
              className="rounded-md object-cover"
              fill
            />
          </AspectRatio>
        </div>
        <div className="flex-1">
          <Link
            href={
              userId
                ? `/dashboard/post-details/${post.id}`
                : `/post-details/${post.id}`
            }
          >
            <CardContent className="flex flex-col space-y-0 pt-4 tracking-tight">
              <h1 className="text-2xl font-bold transition hover:underline">
                {post.businessName}
              </h1>
              <p className="text-muted-foreground pb-2">
                {`${post.address}, ${post.city} ${post.province} ${post.postalCode}`}
              </p>
              <p>{post.description}</p>
            </CardContent>
          </Link>
          <CardFooter className="flex flex-col space-y-2 pt-0 sm:flex-row sm:space-y-0 sm:space-x-2">
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
          </CardFooter>
        </div>
      </Card>
    </div>
  )
}
