import PostForm from "@/components/post/post-form"

const NewPost = () => {
  return (
    <div className="p-4 pt-0">
      <h1 className="text-4xl font-bold">Partager une nouvelle annonce</h1>
      <p className="mt-4 mb-10 max-w-2xl text-lg text-muted-foreground">
        Ajoutez une nouvelle publication pour faire découvrir votre activité,
        vos services ou vos offres spéciales. C&apos;est rapide et facile !
      </p>

      <PostForm />
    </div>
  )
}

export default NewPost
