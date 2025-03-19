import { getPosts } from "@/server/actions/post"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Link from "next/link"
import Image from "next/image"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import postImagePlaceholder from "@/public/images/post-image-placeholder.jpg"

export const MainDashboardCard = async () => {
  const posts = await getPosts()

  return (
    <div className="bg-muted/50 @container min-h-[100vh] flex-1 rounded-xl p-2 md:min-h-min">
      <h1 className="mb-1 text-xl font-semibold">Annonces récentes</h1>
      <div className="grid grid-cols-1 gap-2 @[600px]:grid-cols-2 @[900px]:grid-cols-3">
        {posts.map(async (post) => {
          return (
            <Link key={post.id} href={`/dashboard/post-details/${post.id}`}>
              <Card className="hover:bg-muted/80 flex h-full max-w-full pl-2 transition">
                <div className="w-[100px] pt-3">
                  <AspectRatio ratio={1} className="bg-muted">
                    <Image
                      src={post.businessImageUrl || postImagePlaceholder}
                      alt="Business image"
                      quality={40}
                      className="rounded-md object-cover"
                      fill
                    />
                  </AspectRatio>
                </div>

                <div className="flex-1">
                  <CardHeader className="space-y-0 py-2">
                    <CardTitle className="text-xl">
                      {post.businessName}
                    </CardTitle>
                    <CardDescription>{post.category}</CardDescription>
                  </CardHeader>

                  <CardContent className="flex-grow pb-2">
                    <div className="line-clamp-2 text-sm">
                      {post.description ? (
                        <p>{post.description}</p>
                      ) : (
                        <p className="text-muted-foreground italic">
                          Aucune description
                        </p>
                      )}
                    </div>
                  </CardContent>

                  <CardFooter className="mt-auto pb-2">
                    <p className="font-semibold">
                      {post.city}, {post.province}
                    </p>
                  </CardFooter>
                </div>
              </Card>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
