"use client"

import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { useQuery } from "convex/react"
import { LoaderCircle } from "lucide-react"
import dynamic from "next/dynamic"
import { notFound } from "next/navigation"
import { use } from "react"

const PostFormWithNoSSR = dynamic(() => import("@/components/post/post-form"), {
  ssr: false,
})

const EditPost = (props: { params: Promise<{ id: Id<"posts"> }> }) => {
  const params = use(props.params)
  const id = params.id as Id<"posts">

  const post = useQuery(api.posts.getPostById, { postId: id })

  if (post === undefined) {
    return (
      <div className="flex h-[calc(100vh-80px)] items-center justify-center">
        <LoaderCircle className="animate-spin" />
      </div>
    )
  }

  if (post === null) {
    notFound()
  }

  return (
    <div className="p-4 pt-0">
      <h1 className="text-4xl font-bold">Modifier une annonce</h1>
      <p className="mt-4 mb-10 max-w-2xl text-lg text-muted-foreground">
        Modifiez les informations de votre annonce pour la mettre à jour.
      </p>

      <PostFormWithNoSSR post={post} />
    </div>
  )
}

export default EditPost
