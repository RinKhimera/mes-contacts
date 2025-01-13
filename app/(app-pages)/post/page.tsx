import { PostForm } from "@/components/post/post-form"
import { auth } from "@clerk/nextjs/server"

const Post = async () => {
  const { userId } = await auth()

  return (
    <div className="mx-auto max-w-6xl px-4 md:px-10 lg:px-20 xl:px-0">
      <div className="mt-10">
        <h1 className="text-4xl font-bold">
          Partagez votre expertise avec notre communauté !
        </h1>
        <p className="mb-10 mt-4 max-w-2xl text-lg text-muted-foreground">
          Ajoutez une nouvelle publication pour faire découvrir votre activité,
          vos services ou vos offres spéciales. C’est rapide et facile !
        </p>
      </div>

      <PostForm userId={userId} />
    </div>
  )
}

export default Post
