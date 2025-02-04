"use server"

import { prisma } from "@/lib/prisma"
import { postSchema } from "@/schemas/post"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { z } from "zod"

export const createPost = async (data: z.infer<typeof postSchema>) => {
  try {
    const { userId } = await auth()

    if (!userId) {
      throw new Error(
        "Unauthorized. You need to be logged in to create a post.",
      )
    }

    const post = await prisma.post.create({
      data: {
        authorId: userId,
        businessName: data.businessName,
        businessImageUrl: data.businessImageUrl,
        category: data.category,
        description: data.description,
        phone: data.phone,
        email: data.email,
        website: data.website,
        address: data.address,
        province: data.province,
        city: data.city,
        postalCode: data.postalCode,
        status: "DRAFT",
      },
    })

    return post
  } catch (error) {
    console.error(error)
  }
}

export const getPostById = async (postId: string) => {
  try {
    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
    })

    return post
  } catch (error) {
    console.error(error)
  }
}

export const getUserPosts = async () => {
  try {
    const { userId } = await auth()

    if (userId === null) {
      redirect("/auth/sign-in")
    }

    const userPosts = await prisma.post.findMany({
      where: {
        authorId: userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return userPosts
  } catch (error) {
    console.error(error)
    return []
  }
}

export const getPosts = async () => {
  try {
    const posts = await prisma.post.findMany({
      orderBy: {
        createdAt: "desc",
      },
    })

    return posts
  } catch (error) {
    console.error(error)
    return []
  }
}

export const updatePost = async ({
  postId,
  data,
}: {
  postId: string
  data: z.infer<typeof postSchema>
}) => {
  try {
    const updatedPost = await prisma.post.update({
      where: {
        id: postId,
      },
      data: {
        businessName: data.businessName,
        businessImageUrl: data.businessImageUrl,
        category: data.category,
        description: data.description,
        phone: data.phone,
        email: data.email,
        website: data.website,
        address: data.address,
        province: data.province,
        city: data.city,
        postalCode: data.postalCode,
      },
    })

    return updatedPost
  } catch (error) {
    console.error(error)
  }
}

export const deletePost = async (postId: string) => {
  try {
    const deletedPost = await prisma.post.delete({
      where: {
        id: postId,
      },
    })

    return deletedPost
  } catch (error) {
    console.error(error)
  }
}
