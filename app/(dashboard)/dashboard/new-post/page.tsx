"use client"

import dynamic from "next/dynamic"

const PostFormWithNoSSR = dynamic(() => import("@/components/post/post-form"), {
  ssr: false,
})

const NewPost = () => {
  return (
    <div className="p-4 pt-0">
      <h1 className="text-4xl font-bold">Partager une nouvelle annonce</h1>
      <p className="mb-10 mt-4 max-w-2xl text-lg text-muted-foreground">
        Ajoutez une nouvelle publication pour faire découvrir votre activité,
        vos services ou vos offres spéciales. C&apos;est rapide et facile !
      </p>

      <PostFormWithNoSSR post={undefined} />
    </div>
  )
}

export default NewPost
