import { getPosts } from "@/server/actions/post"
import { PostCard } from "./post-card"

export const HomePosts = async () => {
  const posts = await getPosts()

  return (
    <div>
      <h1 className="text-2xl font-semibold lg:text-3xl">Annonces récentes</h1>

      <div className="my-4 grid w-full grid-cols-1 gap-3">
        {posts.map((post) => (
          <PostCard
            key={post.id}
            name={post.name}
            address={post.address}
            description={post.description}
            services={post.services}
            phone={post.phone}
            email={post.email}
            website={post.address}
            city={post.city}
            province={post.province}
            postalCode={post.postalCode}
          />
        ))}
      </div>
    </div>
  )
}
