import { v } from "convex/values"
import { query } from "./_generated/server"
import { postStatus } from "./schema"

// =============================================================================
// QUERIES
// Note: Les mutations d'insertion sont faites dans posts.ts et payments.ts
// pour garantir la cohérence des données
// =============================================================================

/**
 * Récupère l'historique complet d'un post
 */
export const getByPost = query({
  args: { postId: v.id("posts") },
  handler: async (ctx, { postId }) => {
    const history = await ctx.db
      .query("statusHistory")
      .withIndex("by_postId", (q) => q.eq("postId", postId))
      .order("desc")
      .collect()

    // Enrichir avec les données utilisateur
    const enrichedHistory = await Promise.all(
      history.map(async (entry) => {
        const user = await ctx.db.get(entry.changedBy)
        return {
          ...entry,
          changedByUser: user,
        }
      })
    )

    return enrichedHistory
  },
})

/**
 * Récupère l'historique des actions d'un admin
 */
export const getByAdmin = query({
  args: {
    adminId: v.id("users"),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, { adminId, limit }) => {
    const history = await ctx.db
      .query("statusHistory")
      .withIndex("by_changedBy", (q) => q.eq("changedBy", adminId))
      .order("desc")
      .collect()

    const enrichedHistory = await Promise.all(
      history.map(async (entry) => {
        const post = await ctx.db.get(entry.postId)
        return {
          ...entry,
          post,
        }
      })
    )

    if (limit) {
      return enrichedHistory.slice(0, limit)
    }

    return enrichedHistory
  },
})

/**
 * Récupère tous les changements vers un statut spécifique
 */
export const getByNewStatus = query({
  args: {
    status: postStatus,
    limit: v.optional(v.number()),
  },
  handler: async (ctx, { status, limit }) => {
    const history = await ctx.db
      .query("statusHistory")
      .withIndex("by_newStatus", (q) => q.eq("newStatus", status))
      .order("desc")
      .collect()

    const enrichedHistory = await Promise.all(
      history.map(async (entry) => {
        const [post, user] = await Promise.all([
          ctx.db.get(entry.postId),
          ctx.db.get(entry.changedBy),
        ])
        return {
          ...entry,
          post,
          changedByUser: user,
        }
      })
    )

    if (limit) {
      return enrichedHistory.slice(0, limit)
    }

    return enrichedHistory
  },
})

/**
 * Récupère les derniers changements (timeline globale)
 */
export const getRecent = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, { limit = 50 }) => {
    const history = await ctx.db
      .query("statusHistory")
      .order("desc")
      .take(limit)

    const enrichedHistory = await Promise.all(
      history.map(async (entry) => {
        const [post, user] = await Promise.all([
          ctx.db.get(entry.postId),
          ctx.db.get(entry.changedBy),
        ])
        return {
          ...entry,
          post,
          changedByUser: user,
        }
      })
    )

    return enrichedHistory
  },
})

/**
 * Récupère le dernier statut changé pour un post
 */
export const getLatestForPost = query({
  args: { postId: v.id("posts") },
  handler: async (ctx, { postId }) => {
    const latest = await ctx.db
      .query("statusHistory")
      .withIndex("by_postId", (q) => q.eq("postId", postId))
      .order("desc")
      .first()

    if (!latest) return null

    const user = await ctx.db.get(latest.changedBy)
    return {
      ...latest,
      changedByUser: user,
    }
  },
})

/**
 * Compte les changements de statut par période
 */
export const getStatsByPeriod = query({
  args: {
    startDate: v.number(),
    endDate: v.number(),
  },
  handler: async (ctx, { startDate, endDate }) => {
    const allHistory = await ctx.db.query("statusHistory").order("desc").collect()

    const filtered = allHistory.filter((entry) => {
      const createdAt = entry._creationTime
      return createdAt >= startDate && createdAt <= endDate
    })

    const stats = {
      total: filtered.length,
      byStatus: {} as Record<string, number>,
      byAdmin: {} as Record<string, number>,
    }

    for (const entry of filtered) {
      // Par statut
      stats.byStatus[entry.newStatus] =
        (stats.byStatus[entry.newStatus] || 0) + 1

      // Par admin
      const adminId = entry.changedBy
      stats.byAdmin[adminId] = (stats.byAdmin[adminId] || 0) + 1
    }

    return stats
  },
})

/**
 * Vérifie si un post a déjà été publié
 */
export const hasBeenPublished = query({
  args: { postId: v.id("posts") },
  handler: async (ctx, { postId }) => {
    const publishedEntry = await ctx.db
      .query("statusHistory")
      .withIndex("by_postId", (q) => q.eq("postId", postId))
      .filter((q) => q.eq(q.field("newStatus"), "PUBLISHED"))
      .first()

    return publishedEntry !== null
  },
})
