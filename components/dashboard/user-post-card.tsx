import type { Post } from "@prisma/client"

const UserPostCard = ({
  post,
  userFullName,
}: {
  post: Post
  userFullName: string | null | undefined
}) => {
  return (
    <div className="flex w-full gap-2.5 bg-muted">
      <div>{post.businessName || userFullName}</div>
      <div>
        {post.category} - {post.city}
      </div>
    </div>
  )
}

export default UserPostCard
