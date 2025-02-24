"use client"

import { getPostById } from "@/server/actions/post"
import { useQuery } from "@tanstack/react-query"
import { LoaderCircle } from "lucide-react"
import dynamic from "next/dynamic"
import { notFound } from "next/navigation"
import { use } from "react"

const PostFormWithNoSSR = dynamic(() => import("@/components/post/post-form"), {
  ssr: false,
})

const EditPost = (props: { params: Promise<{ id: string }> }) => {
  const params = use(props.params)
  const id = params.id

  const {
    data: post,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["post", id],
    queryFn: () => getPostById(id),
  })

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-80px)] items-center justify-center">
        <LoaderCircle className="animate-spin" />
      </div>
    )
  }

  if (error || !post) {
    notFound()
  }

  return (
    <div className="p-4 pt-0">
      <h1 className="text-4xl font-bold">Modifier une annonce</h1>
      <p className="mb-10 mt-4 max-w-2xl text-lg text-muted-foreground">
        Modifiez les informations de votre annonce pour la mettre à jour.
      </p>

      <PostFormWithNoSSR post={post} />
    </div>
  )
}

export default EditPost
