import { SiteHeader } from "@/components/shared/site-header"
import { getPostById } from "@/server/actions/post"
import { auth, currentUser } from "@clerk/nextjs/server"

const PostDetails = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { userId } = await auth()
  const user = await currentUser()

  const post = await getPostById((await params).id)

  return (
    <div className="mx-auto max-w-6xl px-4 md:px-10 lg:px-20 xl:px-0">
      <SiteHeader user={user} userId={userId} />

      <h1 className="mt-10 text-2xl font-semibold lg:text-3xl">
        Infos sur le post
      </h1>

      <div>Post id: {post?.id}</div>
      <div>{post?.name}</div>
      <div>{post?.address}</div>
      <div>{post?.city}</div>
      <div>{post?.province}</div>
      <div>{post?.postalCode}</div>
      <div>{post?.description}</div>
      <div>{post?.services}</div>
      <div>{post?.phone}</div>
      <div>{post?.email}</div>
    </div>
  )
}

export default PostDetails
