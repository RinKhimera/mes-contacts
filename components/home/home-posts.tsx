import { getPosts } from "@/server/actions/post"
import { clerkClient } from "@clerk/nextjs/server"
import { PostCard } from "./post-card"

export const HomePosts = async () => {
  const posts = await getPosts()
  const client = await clerkClient()

  return (
    <div>
      <h1 className="text-2xl font-semibold lg:text-3xl">Annonces récentes</h1>

      <div className="my-4 grid w-full grid-cols-1 gap-3">
        {posts.map(async (post) => {
          const user = await client.users.getUser(post.authorId)
          const authorName = user.fullName

          return (
            <PostCard
              key={post.id}
              id={post.id}
              businessName={post.businessName || authorName}
              businessImageUrl={post.businessImageUrl}
              category={post.category}
              description={post?.description}
              services={post?.services}
              phone={post.phone}
              email={post.email}
              website={post.website}
              address={post.address}
              province={post.province}
              city={post.city}
              postalCode={post.postalCode}
            />
          )
        })}
      </div>
    </div>
  )
}
