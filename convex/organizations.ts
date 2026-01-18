import { v } from "convex/values"
import { internalMutation, mutation, query } from "./_generated/server"
import { requireAdmin, requireAuth } from "./lib/auth"

// =============================================================================
// QUERIES
// =============================================================================

/**
 * Récupère une organisation par son ID
 */
export const getById = query({
  args: { id: v.id("organizations") },
  handler: async (ctx, { id }) => {
    return await ctx.db.get(id)
  },
})

/**
 * Liste toutes les organisations (admin)
 */
export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("organizations").order("desc").collect()
  },
})

/**
 * Liste les organisations créées par un utilisateur
 */
export const getByOwnerId = query({
  args: { ownerId: v.id("users") },
  handler: async (ctx, { ownerId }) => {
    return await ctx.db
      .query("organizations")
      .withIndex("by_ownerId", (q) => q.eq("ownerId", ownerId))
      .collect()
  },
})

/**
 * Recherche organisations par nom
 */
export const searchByName = query({
  args: { name: v.string() },
  handler: async (ctx, { name }) => {
    const allOrgs = await ctx.db.query("organizations").collect()
    const searchLower = name.toLowerCase()
    return allOrgs.filter((org) =>
      org.name.toLowerCase().includes(searchLower)
    )
  },
})

/**
 * Liste organisations par secteur
 */
export const getBySector = query({
  args: { sector: v.string() },
  handler: async (ctx, { sector }) => {
    return await ctx.db
      .query("organizations")
      .withIndex("by_sector", (q) => q.eq("sector", sector))
      .collect()
  },
})

/**
 * Liste organisations par province et ville
 */
export const getByLocation = query({
  args: {
    province: v.string(),
    city: v.optional(v.string()),
  },
  handler: async (ctx, { province, city }) => {
    let query = ctx.db
      .query("organizations")
      .withIndex("by_province_city", (q) => q.eq("province", province))

    const results = await query.collect()

    if (city) {
      return results.filter((org) => org.city === city)
    }

    return results
  },
})

// =============================================================================
// MUTATIONS
// =============================================================================

/**
 * Crée une nouvelle organisation (Admin only)
 */
export const create = mutation({
  args: {
    name: v.string(),
    ownerId: v.id("users"), // User qui a demandé la création
    logo: v.optional(v.string()),
    logoStoragePath: v.optional(v.string()),
    description: v.optional(v.string()),
    sector: v.optional(v.string()),
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

    const { longitude, latitude, ...rest } = args

    const geo =
      longitude !== undefined && latitude !== undefined
        ? { longitude, latitude }
        : undefined

    const orgId = await ctx.db.insert("organizations", {
      ...rest,
      geo,
      updatedAt: Date.now(),
    })

    // Ajouter automatiquement le owner comme membre OWNER
    await ctx.db.insert("organizationMembers", {
      organizationId: orgId,
      userId: args.ownerId,
      role: "OWNER",
    })

    return orgId
  },
})

/**
 * Met à jour une organisation (Admin only)
 */
export const update = mutation({
  args: {
    id: v.id("organizations"),
    name: v.optional(v.string()),
    logo: v.optional(v.string()),
    logoStoragePath: v.optional(v.string()),
    description: v.optional(v.string()),
    sector: v.optional(v.string()),
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

    const org = await ctx.db.get(id)
    if (!org) {
      throw new Error("Organisation non trouvée")
    }

    const geo =
      longitude !== undefined && latitude !== undefined
        ? { longitude, latitude }
        : org.geo

    await ctx.db.patch(id, {
      ...updates,
      geo,
      updatedAt: Date.now(),
    })

    return id
  },
})

/**
 * Supprime une organisation (Admin only)
 * Returns logoStoragePath for Bunny CDN cleanup
 */
export const remove = mutation({
  args: { id: v.id("organizations") },
  handler: async (ctx, { id }) => {
    await requireAdmin(ctx)

    const org = await ctx.db.get(id)
    if (!org) {
      throw new Error("Organisation non trouvée")
    }

    const logoStoragePath = org.logoStoragePath

    // Supprimer tous les membres
    const members = await ctx.db
      .query("organizationMembers")
      .withIndex("by_organizationId", (q) => q.eq("organizationId", id))
      .collect()

    for (const member of members) {
      await ctx.db.delete(member._id)
    }

    // Supprimer l'organisation
    await ctx.db.delete(id)

    return { id, logoStoragePath }
  },
})

/**
 * Récupère les organisations dont l'utilisateur actuel est membre
 */
export const getMyOrganizations = query({
  args: {},
  handler: async (ctx) => {
    const user = await requireAuth(ctx)

    const memberships = await ctx.db
      .query("organizationMembers")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .collect()

    const organizations = await Promise.all(
      memberships.map(async (membership) => {
        const org = await ctx.db.get(membership.organizationId)
        return org ? { ...org, memberRole: membership.role } : null
      })
    )

    return organizations.filter(Boolean)
  },
})

// =============================================================================
// INTERNAL MUTATIONS FOR HTTP ACTIONS
// =============================================================================

/**
 * Update organization logo (for HTTP actions)
 */
export const updateLogoInternal = internalMutation({
  args: {
    id: v.id("organizations"),
    logo: v.string(),
    logoStoragePath: v.string(),
  },
  handler: async (ctx, { id, logo, logoStoragePath }) => {
    const org = await ctx.db.get(id)
    if (!org) {
      throw new Error("Organisation non trouvée")
    }

    // Return old storage path for cleanup
    const oldLogoStoragePath = org.logoStoragePath

    await ctx.db.patch(id, {
      logo,
      logoStoragePath,
      updatedAt: Date.now(),
    })

    return { oldLogoStoragePath }
  },
})
