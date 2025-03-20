import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import postImagePlaceholder from "@/public/images/post-image-placeholder.jpg"
import type { Post } from "@prisma/client"
import { MapPin, Phone, Star } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export const PostCard = ({ post }: { post: Post }) => {
  return (
    <Link key={post.id} href={`/dashboard/post-details/${post.id}`}>
      <Card className="flex h-[140px] flex-row overflow-hidden transition hover:bg-muted/80">
        <div className="h-full w-[140px] shrink-0 bg-muted">
          <Image
            src={post.businessImageUrl || postImagePlaceholder}
            alt={post.businessName || "Entreprise"}
            width={140}
            height={140}
            className="h-full w-full object-cover"
          />
        </div>

        <CardContent className="flex-1 overflow-hidden p-4 pt-1">
          <div className="flex h-full flex-col justify-between">
            <div>
              <div className="mb-1 flex items-center justify-between">
                <h3 className="line-clamp-1 font-semibold">
                  {post.businessName}
                </h3>

                <div className="flex items-center">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <span className="ml-1 text-xs font-medium">5</span>
                </div>
              </div>

              <Badge className="mb-2 inline-flex w-fit max-w-[95%]">
                <span className="truncate">
                  {post.category || "Non catégorisé"}
                </span>
              </Badge>

              {post.description ? (
                <p className="line-clamp-2 text-sm text-muted-foreground">
                  {post.description}
                </p>
              ) : (
                <p className="line-clamp-2 text-sm text-muted-foreground italic">
                  Aucune description
                </p>
              )}
            </div>

            <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
              {(post.city || post.province) && (
                <div className="flex max-w-[60%] items-center gap-1">
                  <MapPin className="h-3 w-3 flex-shrink-0" />
                  <span className="truncate">
                    {post.city}
                    {post.city && post.province ? ", " : ""}
                    {post.province}
                  </span>
                </div>
              )}
              {post.phone && (
                <div className="ml-auto flex max-w-[40%] items-center gap-1">
                  <Phone className="h-3 w-3 flex-shrink-0" />
                  <span className="truncate">{post.phone}</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
