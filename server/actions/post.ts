"use server"

import { prisma } from "@/lib/prisma"
import { postSchema } from "@/schemas/post"
import { z } from "zod"

export const createPost = async ({
  data,
  userId,
}: {
  data: z.infer<typeof postSchema>
  userId: string
}) => {
  if (!userId) {
    throw new Error("You must be logged in to create a post")
  }

  const post = await prisma.post.create({
    data: {
      authorId: userId,
      businessName: data.businessName,
      businessImageUrl: data.businessImageUrl,
      category: data.category,
      description: data.description,
      services: data.services,
      phone: data.phone,
      email: data.email,
      website: data.website,
      address: data.address,
      province: data.province,
      city: data.city,
      postalCode: data.postalCode,
    },
  })

  return post
}

export const getPostById = async (id: string) => {
  const post = await prisma.post.findUnique({
    where: {
      id,
    },
  })

  return post
}

export const getPostsByUserId = async (userId: string) => {
  const posts = await prisma.post.findMany({
    where: {
      authorId: userId,
    },
  })

  return posts
}

export const getPosts = async () => {
  const posts = await prisma.post.findMany({
    orderBy: {
      createdAt: "desc",
    },
  })

  return posts
}
