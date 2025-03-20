import { getPosts } from "@/server/actions/post"
import { PostCard } from "../post/post-card"

// const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const MainDashboardCard = async () => {
  // await delay(5000)
  const posts = await getPosts()

  return (
    <div className="@container min-h-[100vh] flex-1 rounded-xl bg-muted/50 p-2 md:min-h-min">
      <h1 className="mb-1 text-xl font-semibold">Annonces récentes</h1>
      <div className="grid grid-cols-1 gap-2 @[600px]:grid-cols-2 @[900px]:grid-cols-3">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  )
}
