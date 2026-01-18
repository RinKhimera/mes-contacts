import { UserJSON } from "@clerk/backend"
import { Validator, v } from "convex/values"
import {
  QueryCtx,
  internalMutation,
  internalQuery,
  query,
} from "./_generated/server"

const userByExternalId = async (ctx: QueryCtx, externalId: string) => {
  return await ctx.db
    .query("users")
    .withIndex("byExternalId", (q) => q.eq("externalId", externalId))
    .unique()
}

export const upsertFromClerk = internalMutation({
  args: { data: v.any() as Validator<UserJSON> }, // Vient de Clerk
  async handler(ctx, { data }) {
    const baseAttributes = {
      externalId: data.id,
      tokenIdentifier: `${process.env.NEXT_PUBLIC_CLERK_FRONTEND_API_URL}|${data.id}`,
      name: `${data.first_name} ${data.last_name}`,
      email: data.email_addresses[0]?.email_address,
      image: data.image_url,
    }

    const user = await userByExternalId(ctx, data.id)
    if (user === null) {
      // Nouveau utilisateur : ajouter le rôle par défaut
      await ctx.db.insert("users", {
        ...baseAttributes,
        role: "USER" as const,
      })
    } else {
      // Utilisateur existant : mettre à jour sans changer le rôle
      await ctx.db.patch(user._id, baseAttributes)
    }
  },
})

export const createUser = internalMutation({
  args: {
    name: v.string(),
    email: v.string(),
    image: v.string(),
    externalId: v.string(),
    tokenIdentifier: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("users", {
      externalId: args.externalId,
      tokenIdentifier: args.tokenIdentifier,
      name: args.name,
      email: args.email,
      image: args.image,
      role: "USER",
    })
  },
})

export const deleteFromClerk = internalMutation({
  args: { clerkUserId: v.string() },
  async handler(ctx, { clerkUserId }) {
    const user = await userByExternalId(ctx, clerkUserId)

    if (user !== null) {
      await ctx.db.delete(user._id)
    } else {
      console.warn(
        `Can't delete user, there is none for Clerk user ID: ${clerkUserId}`,
      )
    }
  },
})

export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) return null

    return await ctx.db
      .query("users")
      .withIndex("by_tokenIdentifier", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier),
      )
      .unique()
  },
})

/**
 * Liste tous les utilisateurs (admin)
 */
export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("users").order("desc").collect()
  },
})

/**
 * Recherche utilisateurs par nom ou email
 */
export const search = query({
  args: { query: v.string() },
  handler: async (ctx, { query }) => {
    const allUsers = await ctx.db.query("users").collect()
    const searchLower = query.toLowerCase()
    return allUsers.filter(
      (user) =>
        user.name.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower)
    )
  },
})

/**
 * Récupère un utilisateur par son ID
 */
export const getById = query({
  args: { id: v.id("users") },
  handler: async (ctx, { id }) => {
    return await ctx.db.get(id)
  },
})

// =============================================================================
// INTERNAL QUERIES/MUTATIONS FOR HTTP ACTIONS
// =============================================================================

/**
 * Get user by token identifier (for HTTP actions)
 */
export const getUserByTokenIdentifier = internalQuery({
  args: { tokenIdentifier: v.string() },
  handler: async (ctx, { tokenIdentifier }) => {
    return await ctx.db
      .query("users")
      .withIndex("by_tokenIdentifier", (q) =>
        q.eq("tokenIdentifier", tokenIdentifier)
      )
      .unique()
  },
})

/**
 * Update user avatar (for HTTP actions)
 */
export const updateUserAvatar = internalMutation({
  args: {
    userId: v.id("users"),
    avatarUrl: v.string(),
    avatarStoragePath: v.string(),
  },
  handler: async (ctx, { userId, avatarUrl, avatarStoragePath }) => {
    const user = await ctx.db.get(userId)
    if (!user) {
      throw new Error("User not found")
    }

    // Return old storage path for cleanup
    const oldStoragePath = user.avatarStoragePath

    await ctx.db.patch(userId, {
      image: avatarUrl,
      avatarStoragePath,
    })

    return { oldStoragePath }
  },
})
