// import UserPostCard from "@/components/dashboard/user-post-card"
import { PostCard } from "@/components/home/post-card"
import { getPostsByUserId } from "@/server/actions/post"
import { auth, currentUser } from "@clerk/nextjs/server"

const MyPosts = async () => {
  const { userId } = await auth()
  const user = await currentUser()

  const userPosts = await getPostsByUserId(userId!)
  return (
    <div className="p-4 pt-0">
      <h1 className="text-4xl font-bold">Mes annonces</h1>
      {/* 
      {userPosts.length === 0 ? (
        <div className="my-4 text-center">
          <p>Vous n&apos;avez pas encore publié d&apos;annonce</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {userPosts.map(async (post) => {
            return (
              <UserPostCard
                key={post.id}
                post={post}
                userFullName={user?.fullName}
              />
            )
          })}
        </div>
      )} */}

      <div className="my-4 grid w-full grid-cols-1 gap-3">
        {userPosts.map(async (post) => {
          return (
            <PostCard
              key={post.id}
              id={post.id}
              businessName={post.businessName || user?.fullName}
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

export default MyPosts
