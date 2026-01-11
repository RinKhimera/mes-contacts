import { v } from "convex/values"
import { mutation, query } from "./_generated/server"
import { requireAdmin } from "./lib/auth"
import { mediaType } from "./schema"

// =============================================================================
// QUERIES
// =============================================================================

/**
 * Récupère tous les médias d'un post
 */
export const getByPost = query({
  args: { postId: v.id("posts") },
  handler: async (ctx, { postId }) => {
    return await ctx.db
      .query("media")
      .withIndex("by_postId_order", (q) => q.eq("postId", postId))
      .collect()
  },
})

/**
 * Récupère les médias d'un post par type
 */
export const getByPostAndType = query({
  args: {
    postId: v.id("posts"),
    type: mediaType,
  },
  handler: async (ctx, { postId, type }) => {
    return await ctx.db
      .query("media")
      .withIndex("by_postId_type", (q) =>
        q.eq("postId", postId).eq("type", type)
      )
      .collect()
  },
})

/**
 * Récupère un média par son ID
 */
export const getById = query({
  args: { id: v.id("media") },
  handler: async (ctx, { id }) => {
    return await ctx.db.get(id)
  },
})

/**
 * Récupère uniquement les images d'un post (pour la galerie)
 */
export const getImages = query({
  args: { postId: v.id("posts") },
  handler: async (ctx, { postId }) => {
    return await ctx.db
      .query("media")
      .withIndex("by_postId_type", (q) =>
        q.eq("postId", postId).eq("type", "IMAGE")
      )
      .collect()
  },
})

/**
 * Compte le nombre de médias par type pour un post
 */
export const countByType = query({
  args: { postId: v.id("posts") },
  handler: async (ctx, { postId }) => {
    const allMedia = await ctx.db
      .query("media")
      .withIndex("by_postId", (q) => q.eq("postId", postId))
      .collect()

    return {
      images: allMedia.filter((m) => m.type === "IMAGE").length,
      videos: allMedia.filter((m) => m.type === "VIDEO").length,
      documents: allMedia.filter((m) => m.type === "DOCUMENT").length,
      total: allMedia.length,
    }
  },
})

// =============================================================================
// MUTATIONS
// =============================================================================

/**
 * Ajoute un média à un post (Admin only)
 */
export const add = mutation({
  args: {
    postId: v.id("posts"),
    url: v.string(),
    type: mediaType,
    altText: v.optional(v.string()),
    order: v.optional(v.number()),
  },
  handler: async (ctx, { postId, url, type, altText, order }) => {
    await requireAdmin(ctx)

    // Vérifier que le post existe
    const post = await ctx.db.get(postId)
    if (!post) {
      throw new Error("Post non trouvé")
    }

    // Si pas d'ordre spécifié, ajouter à la fin
    let finalOrder = order
    if (finalOrder === undefined) {
      const existingMedia = await ctx.db
        .query("media")
        .withIndex("by_postId", (q) => q.eq("postId", postId))
        .collect()
      finalOrder = existingMedia.length
    }

    return await ctx.db.insert("media", {
      postId,
      url,
      type,
      altText,
      order: finalOrder,
    })
  },
})

/**
 * Ajoute plusieurs médias à un post (Admin only)
 */
export const addMultiple = mutation({
  args: {
    postId: v.id("posts"),
    mediaItems: v.array(
      v.object({
        url: v.string(),
        type: mediaType,
        altText: v.optional(v.string()),
      })
    ),
  },
  handler: async (ctx, { postId, mediaItems }) => {
    await requireAdmin(ctx)

    // Vérifier que le post existe
    const post = await ctx.db.get(postId)
    if (!post) {
      throw new Error("Post non trouvé")
    }

    // Récupérer l'ordre actuel
    const existingMedia = await ctx.db
      .query("media")
      .withIndex("by_postId", (q) => q.eq("postId", postId))
      .collect()
    let currentOrder = existingMedia.length

    const insertedIds = []
    for (const item of mediaItems) {
      const id = await ctx.db.insert("media", {
        postId,
        url: item.url,
        type: item.type,
        altText: item.altText,
        order: currentOrder++,
      })
      insertedIds.push(id)
    }

    return insertedIds
  },
})

/**
 * Met à jour un média (Admin only)
 */
export const update = mutation({
  args: {
    id: v.id("media"),
    url: v.optional(v.string()),
    type: v.optional(mediaType),
    altText: v.optional(v.string()),
    order: v.optional(v.number()),
  },
  handler: async (ctx, { id, ...updates }) => {
    await requireAdmin(ctx)

    const media = await ctx.db.get(id)
    if (!media) {
      throw new Error("Média non trouvé")
    }

    // Filtrer les champs undefined
    const filteredUpdates = Object.fromEntries(
      Object.entries(updates).filter(([_, value]) => value !== undefined)
    )

    if (Object.keys(filteredUpdates).length > 0) {
      await ctx.db.patch(id, filteredUpdates)
    }

    return id
  },
})

/**
 * Réorganise l'ordre des médias (Admin only)
 */
export const reorder = mutation({
  args: {
    postId: v.id("posts"),
    mediaIds: v.array(v.id("media")),
  },
  handler: async (ctx, { postId, mediaIds }) => {
    await requireAdmin(ctx)

    // Vérifier que le post existe
    const post = await ctx.db.get(postId)
    if (!post) {
      throw new Error("Post non trouvé")
    }

    // Mettre à jour l'ordre de chaque média
    for (let i = 0; i < mediaIds.length; i++) {
      const media = await ctx.db.get(mediaIds[i])
      if (media && media.postId === postId) {
        await ctx.db.patch(mediaIds[i], { order: i })
      }
    }

    return true
  },
})

/**
 * Supprime un média (Admin only)
 */
export const remove = mutation({
  args: { id: v.id("media") },
  handler: async (ctx, { id }) => {
    await requireAdmin(ctx)

    const media = await ctx.db.get(id)
    if (!media) {
      throw new Error("Média non trouvé")
    }

    await ctx.db.delete(id)

    // Réorganiser les ordres restants
    const remainingMedia = await ctx.db
      .query("media")
      .withIndex("by_postId_order", (q) => q.eq("postId", media.postId))
      .collect()

    for (let i = 0; i < remainingMedia.length; i++) {
      if (remainingMedia[i].order !== i) {
        await ctx.db.patch(remainingMedia[i]._id, { order: i })
      }
    }

    return id
  },
})

/**
 * Supprime tous les médias d'un post (Admin only)
 */
export const removeAllForPost = mutation({
  args: { postId: v.id("posts") },
  handler: async (ctx, { postId }) => {
    await requireAdmin(ctx)

    const allMedia = await ctx.db
      .query("media")
      .withIndex("by_postId", (q) => q.eq("postId", postId))
      .collect()

    for (const media of allMedia) {
      await ctx.db.delete(media._id)
    }

    return allMedia.length
  },
})
