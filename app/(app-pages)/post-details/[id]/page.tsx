import { getPostById } from "@/server/actions/post"

const PostDetails = async ({ params }: { params: Promise<{ id: string }> }) => {
  const post = await getPostById((await params).id)

  return (
    <div className="mx-auto w-full max-w-6xl px-4 md:px-10 lg:px-20 xl:px-0">
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
