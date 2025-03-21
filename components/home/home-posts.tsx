import { getPosts } from "@/server/actions/post"
import { PostCard } from "../post/post-card"
import { Card, CardContent } from "../ui/card"

export const HomePosts = async () => {
  const posts = await getPosts()

  return (
    <div>
      <h1 className="text-2xl font-semibold lg:text-3xl">Annonces récentes</h1>

      <Card className="my-4">
        <CardContent className="py-4">
          <div className="grid w-full grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
            {posts.map(async (post) => {
              return <PostCard key={post.id} post={post} />
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
