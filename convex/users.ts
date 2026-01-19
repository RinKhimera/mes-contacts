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
 * Optimisé: ajout d'une limite par défaut
 */
export const list = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, { limit }) => {
    const effectiveLimit = limit ?? 100 // Default limit
    return await ctx.db.query("users").order("desc").take(effectiveLimit)
  },
})

/**
 * Recherche utilisateurs par nom ou email
 * Optimisé: limite les résultats et requiert minimum 2 caractères
 */
export const search = query({
  args: {
    query: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, { query, limit }) => {
    const effectiveLimit = limit ?? 20

    // Require minimum 2 characters for search
    if (query.length < 2) return []

    // Cap the number of users to scan
    const users = await ctx.db.query("users").take(500)
    const searchLower = query.toLowerCase()

    return users
      .filter(
        (user) =>
          user.name.toLowerCase().includes(searchLower) ||
          user.email.toLowerCase().includes(searchLower)
      )
      .slice(0, effectiveLimit)
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
