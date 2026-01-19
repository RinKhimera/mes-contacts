import { v } from "convex/values"
import { mutation, query, internalMutation } from "./_generated/server"
import { requireAdmin, getCurrentUser } from "./lib/auth"
import { validatePostOwnership } from "./lib/validation"
import { postStatus } from "./schema"

// =============================================================================
// QUERIES
// =============================================================================

/**
 * Récupère un post par son ID
 */
export const getById = query({
  args: { id: v.id("posts") },
  handler: async (ctx, { id }) => {
    return await ctx.db.get(id)
  },
})

/**
 * Récupère un post avec ses médias et infos propriétaire
 */
export const getByIdWithDetails = query({
  args: { id: v.id("posts") },
  handler: async (ctx, { id }) => {
    const post = await ctx.db.get(id)
    if (!post) return null

    // Récupérer les médias
    const media = await ctx.db
      .query("media")
      .withIndex("by_postId_order", (q) => q.eq("postId", id))
      .collect()

    // Récupérer le propriétaire (user ou organization)
    let owner = null
    if (post.userId) {
      owner = await ctx.db.get(post.userId)
    } else if (post.organizationId) {
      owner = await ctx.db.get(post.organizationId)
    }

    // Récupérer l'admin qui a créé le post
    const createdByUser = await ctx.db.get(post.createdBy)

    return {
      ...post,
      media,
      owner,
      ownerType: post.userId ? "user" : "organization",
      createdByUser,
    }
  },
})

/**
 * Liste tous les posts (Admin)
 */
export const list = query({
  args: {
    status: v.optional(postStatus),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, { status, limit }) => {
    let posts

    if (status) {
      posts = await ctx.db
        .query("posts")
        .withIndex("by_status", (q) => q.eq("status", status))
        .order("desc")
        .collect()
    } else {
      posts = await ctx.db.query("posts").order("desc").collect()
    }

    if (limit) {
      return posts.slice(0, limit)
    }

    return posts
  },
})

/**
 * Liste les posts publiés (public)
 */
export const getPublished = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, { limit }) => {
    const posts = await ctx.db
      .query("posts")
      .withIndex("by_status", (q) => q.eq("status", "PUBLISHED"))
      .order("desc")
      .collect()

    if (limit) {
      return posts.slice(0, limit)
    }

    return posts
  },
})

/**
 * Liste les posts d'un utilisateur (travailleur indépendant)
 */
export const getByUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    return await ctx.db
      .query("posts")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .order("desc")
      .collect()
  },
})

/**
 * Liste les posts d'une organisation
 */
export const getByOrganization = query({
  args: { organizationId: v.id("organizations") },
  handler: async (ctx, { organizationId }) => {
    return await ctx.db
      .query("posts")
      .withIndex("by_organizationId", (q) => q.eq("organizationId", organizationId))
      .order("desc")
      .collect()
  },
})

/**
 * Liste les posts créés par un admin
 */
export const getByCreatedBy = query({
  args: { adminId: v.id("users") },
  handler: async (ctx, { adminId }) => {
    return await ctx.db
      .query("posts")
      .withIndex("by_createdBy", (q) => q.eq("createdBy", adminId))
      .order("desc")
      .collect()
  },
})

/**
 * Recherche avancée de posts (public - uniquement PUBLISHED)
 */
export const search = query({
  args: {
    searchTerm: v.optional(v.string()),
    category: v.optional(v.string()),
    province: v.optional(v.string()),
    city: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let posts

    // Utiliser les index composites pour optimiser
    if (args.category && args.province && args.city) {
      posts = await ctx.db
        .query("posts")
        .withIndex("by_status_province_city", (q) =>
          q
            .eq("status", "PUBLISHED")
            .eq("province", args.province!)
            .eq("city", args.city!)
        )
        .collect()
      posts = posts.filter((p) => p.category === args.category)
    } else if (args.category && args.province) {
      posts = await ctx.db
        .query("posts")
        .withIndex("by_status_province", (q) =>
          q.eq("status", "PUBLISHED").eq("province", args.province!)
        )
        .collect()
      posts = posts.filter((p) => p.category === args.category)
    } else if (args.category) {
      posts = await ctx.db
        .query("posts")
        .withIndex("by_status_category", (q) =>
          q.eq("status", "PUBLISHED").eq("category", args.category!)
        )
        .collect()
    } else if (args.province) {
      posts = await ctx.db
        .query("posts")
        .withIndex("by_status_province", (q) =>
          q.eq("status", "PUBLISHED").eq("province", args.province!)
        )
        .collect()
    } else {
      posts = await ctx.db
        .query("posts")
        .withIndex("by_status", (q) => q.eq("status", "PUBLISHED"))
        .collect()
    }

    // Filtrer par ville si pas déjà fait
    if (args.city && !args.province) {
      const normalizedCity = args.city.trim().toLowerCase()
      posts = posts.filter((p) =>
        p.city.toLowerCase().includes(normalizedCity)
      )
    }

    // Filtrer par terme de recherche
    if (args.searchTerm && args.searchTerm.trim() !== "") {
      const normalizedTerm = args.searchTerm.trim().toLowerCase()
      posts = posts.filter(
        (p) =>
          p.businessName.toLowerCase().includes(normalizedTerm) ||
          p.description?.toLowerCase().includes(normalizedTerm) ||
          p.city.toLowerCase().includes(normalizedTerm) ||
          p.address.toLowerCase().includes(normalizedTerm)
      )
    }

    return posts
  },
})

/**
 * Recherche admin (tous statuts)
 */
export const searchAdmin = query({
  args: {
    searchTerm: v.optional(v.string()),
    category: v.optional(v.string()),
    province: v.optional(v.string()),
    city: v.optional(v.string()),
    status: v.optional(postStatus),
  },
  handler: async (ctx, args) => {
    let posts = await ctx.db.query("posts").order("desc").collect()

    // Filtrer par statut
    if (args.status) {
      posts = posts.filter((p) => p.status === args.status)
    }

    // Filtrer par catégorie
    if (args.category && args.category !== "all") {
      posts = posts.filter((p) => p.category === args.category)
    }

    // Filtrer par province
    if (args.province && args.province !== "all") {
      posts = posts.filter((p) => p.province === args.province)
    }

    // Filtrer par ville
    if (args.city && args.city.trim() !== "") {
      const normalizedCity = args.city.trim().toLowerCase()
      posts = posts.filter((p) =>
        p.city.toLowerCase().includes(normalizedCity)
      )
    }

    // Filtrer par terme de recherche
    if (args.searchTerm && args.searchTerm.trim() !== "") {
      const normalizedTerm = args.searchTerm.trim().toLowerCase()
      posts = posts.filter(
        (p) =>
          p.businessName.toLowerCase().includes(normalizedTerm) ||
          p.description?.toLowerCase().includes(normalizedTerm) ||
          p.city.toLowerCase().includes(normalizedTerm) ||
          p.address.toLowerCase().includes(normalizedTerm)
      )
    }

    return posts
  },
})

/**
 * Récupère les posts de l'utilisateur courant (ses posts ou ceux de ses orgs)
 */
export const getMyPosts = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx)
    if (!user) return []

    // Récupérer les posts où l'utilisateur est propriétaire direct
    const userPosts = await ctx.db
      .query("posts")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .collect()

    // Récupérer les organisations de l'utilisateur
    const memberships = await ctx.db
      .query("organizationMembers")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .collect()

    // Récupérer les posts de chaque organisation
    const orgPosts = []
    for (const membership of memberships) {
      const posts = await ctx.db
        .query("posts")
        .withIndex("by_organizationId", (q) =>
          q.eq("organizationId", membership.organizationId)
        )
        .collect()
      orgPosts.push(...posts)
    }

    // Combiner et trier par date
    const allPosts = [...userPosts, ...orgPosts]
    allPosts.sort((a, b) => b._creationTime - a._creationTime)

    return allPosts
  },
})

// =============================================================================
// MUTATIONS
// =============================================================================

/**
 * Crée un nouveau post (Admin only)
 */
export const create = mutation({
  args: {
    // Ownership XOR
    userId: v.optional(v.id("users")),
    organizationId: v.optional(v.id("organizations")),
    // Business info
    businessName: v.string(),
    category: v.string(),
    description: v.optional(v.string()),
    // Contact
    phone: v.string(),
    email: v.string(),
    website: v.optional(v.string()),
    // Location
    address: v.string(),
    city: v.string(),
    province: v.string(),
    postalCode: v.string(),
    longitude: v.optional(v.number()),
    latitude: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const admin = await requireAdmin(ctx)

    // Valider ownership XOR
    validatePostOwnership(args.userId, args.organizationId)

    const { longitude, latitude, ...rest } = args

    const geo =
      longitude !== undefined && latitude !== undefined
        ? { longitude, latitude }
        : undefined

    const postId = await ctx.db.insert("posts", {
      ...rest,
      geo,
      status: "DRAFT",
      createdBy: admin._id,
    })

    // Audit log
    await ctx.db.insert("statusHistory", {
      postId,
      previousStatus: undefined,
      newStatus: "DRAFT",
      changedBy: admin._id,
      reason: "Création du post",
    })

    return postId
  },
})

/**
 * Met à jour un post (Admin only)
 */
export const update = mutation({
  args: {
    id: v.id("posts"),
    businessName: v.optional(v.string()),
    category: v.optional(v.string()),
    description: v.optional(v.string()),
    phone: v.optional(v.string()),
    email: v.optional(v.string()),
    website: v.optional(v.string()),
    address: v.optional(v.string()),
    city: v.optional(v.string()),
    province: v.optional(v.string()),
    postalCode: v.optional(v.string()),
    longitude: v.optional(v.number()),
    latitude: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx)

    const { id, longitude, latitude, ...updates } = args

    const post = await ctx.db.get(id)
    if (!post) {
      throw new Error("Post non trouvé")
    }

    const geo =
      longitude !== undefined && latitude !== undefined
        ? { longitude, latitude }
        : post.geo

    // Filtrer les champs undefined
    const filteredUpdates = Object.fromEntries(
      Object.entries(updates).filter(([, value]) => value !== undefined)
    )

    await ctx.db.patch(id, {
      ...filteredUpdates,
      geo,
    })

    return id
  },
})

/**
 * Change le statut d'un post (Admin only)
 */
export const changeStatus = mutation({
  args: {
    id: v.id("posts"),
    status: postStatus,
    reason: v.optional(v.string()),
  },
  handler: async (ctx, { id, status, reason }) => {
    const admin = await requireAdmin(ctx)

    const post = await ctx.db.get(id)
    if (!post) {
      throw new Error("Post non trouvé")
    }

    const previousStatus = post.status

    // Mettre à jour le statut
    const updates: { status: typeof status; publishedAt?: number; expiresAt?: number } = {
      status,
    }

    // Si on publie, mettre à jour publishedAt
    if (status === "PUBLISHED" && previousStatus !== "PUBLISHED") {
      updates.publishedAt = Date.now()
    }

    await ctx.db.patch(id, updates)

    // Audit log
    await ctx.db.insert("statusHistory", {
      postId: id,
      previousStatus,
      newStatus: status,
      changedBy: admin._id,
      reason,
    })

    return id
  },
})

/**
 * Supprime un post et toutes ses données associées (Admin only)
 * Returns mediaStoragePaths for Bunny CDN cleanup
 */
export const remove = mutation({
  args: { id: v.id("posts") },
  handler: async (ctx, { id }) => {
    await requireAdmin(ctx)

    const post = await ctx.db.get(id)
    if (!post) {
      throw new Error("Post non trouvé")
    }

    // Supprimer tous les médias associés et collecter les storagePaths
    const media = await ctx.db
      .query("media")
      .withIndex("by_postId", (q) => q.eq("postId", id))
      .collect()

    // Filter out undefined storagePaths (legacy records without Bunny paths)
    const mediaStoragePaths = media
      .map((m) => m.storagePath)
      .filter((path): path is string => path !== undefined)

    for (const m of media) {
      await ctx.db.delete(m._id)
    }

    // Supprimer tous les paiements associés
    const payments = await ctx.db
      .query("payments")
      .withIndex("by_postId", (q) => q.eq("postId", id))
      .collect()

    for (const p of payments) {
      await ctx.db.delete(p._id)
    }

    // Supprimer l'historique
    const history = await ctx.db
      .query("statusHistory")
      .withIndex("by_postId", (q) => q.eq("postId", id))
      .collect()

    for (const h of history) {
      await ctx.db.delete(h._id)
    }

    // Supprimer le post
    await ctx.db.delete(id)

    return { id, mediaStoragePaths }
  },
})

// =============================================================================
// INTERNAL MUTATIONS (pour cron jobs)
// =============================================================================

/**
 * Expire les posts dont la période de publication est terminée
 * Appelé quotidiennement par le cron job
 */
export const expireOldPosts = internalMutation({
  handler: async (ctx) => {
    const now = Date.now()

    // Récupérer les posts publiés expirés
    const expiredPosts = await ctx.db
      .query("posts")
      .withIndex("by_status_expiresAt")
      .filter((q) =>
        q.and(
          q.eq(q.field("status"), "PUBLISHED"),
          q.neq(q.field("expiresAt"), undefined),
          q.lt(q.field("expiresAt"), now)
        )
      )
      .collect()

    let expiredCount = 0

    for (const post of expiredPosts) {
      await ctx.db.patch(post._id, { status: "EXPIRED" })

      // Audit log
      await ctx.db.insert("statusHistory", {
        postId: post._id,
        previousStatus: "PUBLISHED",
        newStatus: "EXPIRED",
        changedBy: post.createdBy, // Utiliser le créateur pour les actions système
        reason: "Période de publication expirée",
      })

      expiredCount++
    }

    return { expiredCount }
  },
})

// =============================================================================
// BACKWARD COMPATIBILITY (à migrer progressivement)
// =============================================================================

/**
 * @deprecated Utilisez getById à la place
 */
export const getPostById = query({
  args: { postId: v.id("posts") },
  handler: async (ctx, { postId }) => {
    return await ctx.db.get(postId)
  },
})

/**
 * @deprecated Utilisez list à la place
 */
export const getPosts = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("posts").order("desc").collect()
  },
})

/**
 * @deprecated Utilisez getMyPosts à la place
 */
export const getCurrentUserPosts = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx)
    if (!user) return []

    // Pour la compatibilité, chercher par userId
    return await ctx.db
      .query("posts")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .order("desc")
      .collect()
  },
})

/**
 * @deprecated Utilisez searchAdmin à la place
 */
export const searchPostsAdvanced = query({
  args: {
    searchTerm: v.optional(v.string()),
    category: v.optional(v.string()),
    province: v.optional(v.string()),
    city: v.optional(v.string()),
    status: v.optional(
      v.union(
        v.literal("DRAFT"),
        v.literal("PUBLISHED"),
        v.literal("EXPIRED"),
        v.literal("DISABLED")
      )
    ),
  },
  handler: async (ctx, args) => {
    let posts = await ctx.db.query("posts").order("desc").collect()

    // Filtrer par statut (par défaut uniquement PUBLISHED)
    if (args.status) {
      posts = posts.filter((p) => p.status === args.status)
    } else {
      posts = posts.filter((p) => p.status === "PUBLISHED")
    }

    if (args.category && args.category !== "all") {
      posts = posts.filter((p) => p.category === args.category)
    }

    if (args.province && args.province !== "all") {
      posts = posts.filter((p) => p.province === args.province)
    }

    if (args.city && args.city.trim() !== "") {
      const normalizedCity = args.city.trim().toLowerCase()
      posts = posts.filter((p) =>
        p.city.toLowerCase().includes(normalizedCity)
      )
    }

    if (args.searchTerm && args.searchTerm.trim() !== "") {
      const normalizedTerm = args.searchTerm.trim().toLowerCase()
      posts = posts.filter(
        (p) =>
          p.businessName.toLowerCase().includes(normalizedTerm) ||
          p.description?.toLowerCase().includes(normalizedTerm) ||
          p.city.toLowerCase().includes(normalizedTerm) ||
          p.address.toLowerCase().includes(normalizedTerm)
      )
    }

    return posts
  },
})
