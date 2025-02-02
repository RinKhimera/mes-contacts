import { PostForm } from "@/components/post/post-form"
import { getPostById } from "@/server/actions/post"
import { notFound } from "next/navigation"

const EditPost = async ({ params }: { params: Promise<{ id: string }> }) => {
  const post = await getPostById((await params).id)
  if (!post) notFound()

  return (
    <div className="p-4 pt-0">
      <h1 className="text-4xl font-bold">Modifier une annonce</h1>
      <p className="mb-10 mt-4 max-w-2xl text-lg text-muted-foreground">
        Modifiez les informations de votre annonce pour la mettre à jour.
      </p>

      <PostForm post={post} />
    </div>
  )
}

export default EditPost
