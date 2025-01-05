import { PostForm } from "@/components/post/post-form"
import { SiteHeader } from "@/components/shared/site-header"

const Post = () => {
  return (
    <div className="mx-auto max-w-6xl px-4">
      <SiteHeader />

      <div className="mt-10">
        <h1 className="text-4xl font-bold">
          Partagez votre expertise avec notre communauté !
        </h1>
        <p className="mb-10 mt-4 max-w-2xl text-lg text-muted-foreground">
          Ajoutez une nouvelle publication pour faire découvrir votre activité,
          vos services ou vos offres spéciales. C’est rapide et facile !
        </p>
      </div>

      <PostForm />
    </div>
  )
}

export default Post
