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
        latitude: data.latitude,
        longitude: data.longitude,
        status: "DRAFT",
      },
    })

    return post
  } catch (error) {
    console.error("Error creating post:", error)
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
        latitude: data.latitude,
        longitude: data.longitude,
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

export const changePostStatus = async (postId: string) => {
  try {
    const { userId } = await auth()

    if (!userId) {
      throw new Error(
        "Unauthorized. You need to be logged in to change the status of a post.",
      )
    }

    const currentPost = await prisma.post.findUnique({
      where: { id: postId },
      select: { status: true },
    })

    if (!currentPost) {
      throw new Error("Post not found")
    }

    const newStatus =
      currentPost.status === "DISABLED" ? "PUBLISHED" : "DISABLED"

    const post = await prisma.post.update({
      where: {
        id: postId,
      },
      data: {
        status: newStatus,
      },
    })

    return post
  } catch (error) {
    console.error(error)
    throw error
  }
}

export const searchPostsByCategories = async (categories: string[]) => {
  try {
    if (!categories.length) {
      return getPosts()
    }

    const posts = await prisma.post.findMany({
      where: {
        category: {
          in: categories,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return posts
  } catch (error) {
    console.error("Error searching posts by categories:", error)
    return []
  }
}

export const searchPosts = async (searchTerm: string) => {
  try {
    if (!searchTerm || searchTerm.trim() === "") {
      return getPosts()
    }

    const normalizedSearchTerm = searchTerm.trim().toLowerCase()

    const posts = await prisma.post.findMany({
      where: {
        OR: [
          {
            businessName: {
              contains: normalizedSearchTerm,
              mode: "insensitive",
            },
          },
          {
            city: {
              contains: normalizedSearchTerm,
              mode: "insensitive",
            },
          },
          {
            province: {
              contains: normalizedSearchTerm,
              mode: "insensitive",
            },
          },
        ],
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return posts
  } catch (error) {
    console.error("Error searching posts:", error)
    return []
  }
}

export const searchPostsCombined = async (
  searchTerm: string,
  categories: string[],
) => {
  try {
    // Si aucun filtre, retourner tous les posts
    if (
      (!searchTerm || searchTerm.trim() === "") &&
      (!categories || categories.length === 0)
    ) {
      return getPosts()
    }

    // Construction de la condition WHERE correcte pour Prisma
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let whereCondition: any = {}

    // 1. Cas où on a SEULEMENT un terme de recherche
    if (
      searchTerm &&
      searchTerm.trim() !== "" &&
      (!categories || categories.length === 0)
    ) {
      const term = searchTerm.trim().toLowerCase()
      whereCondition = {
        OR: [
          { businessName: { contains: term, mode: "insensitive" } },
          { city: { contains: term, mode: "insensitive" } },
          { province: { contains: term, mode: "insensitive" } },
        ],
      }
    }
    // 2. Cas où on a SEULEMENT des catégories
    else if (
      (!searchTerm || searchTerm.trim() === "") &&
      categories &&
      categories.length > 0
    ) {
      whereCondition = {
        category: { in: categories },
      }
    }
    // 3. Cas où on a LES DEUX (terme + catégories)
    else {
      const term = searchTerm.trim().toLowerCase()
      whereCondition = {
        AND: [
          {
            OR: [
              { businessName: { contains: term, mode: "insensitive" } },
              { city: { contains: term, mode: "insensitive" } },
              { province: { contains: term, mode: "insensitive" } },
            ],
          },
          { category: { in: categories } },
        ],
      }
    }

    // Exécuter la requête
    const posts = await prisma.post.findMany({
      where: whereCondition,
      orderBy: { createdAt: "desc" },
    })

    return posts
  } catch (error) {
    console.error("Error searching posts combined:", error)
    return []
  }
}
