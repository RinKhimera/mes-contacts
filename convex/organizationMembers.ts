import { v } from "convex/values"
import { mutation, query } from "./_generated/server"
import { requireAdmin } from "./lib/auth"
import { orgMemberRole } from "./schema"

// =============================================================================
// QUERIES
// =============================================================================

/**
 * Liste tous les membres d'une organisation
 */
export const getByOrganization = query({
  args: { organizationId: v.id("organizations") },
  handler: async (ctx, { organizationId }) => {
    const members = await ctx.db
      .query("organizationMembers")
      .withIndex("by_organizationId", (q) =>
        q.eq("organizationId", organizationId)
      )
      .collect()

    // Enrichir avec les données utilisateur
    const enrichedMembers = await Promise.all(
      members.map(async (member) => {
        const user = await ctx.db.get(member.userId)
        return {
          ...member,
          user,
        }
      })
    )

    return enrichedMembers
  },
})

/**
 * Liste les organisations d'un utilisateur
 */
export const getByUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    const memberships = await ctx.db
      .query("organizationMembers")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .collect()

    // Enrichir avec les données organisation
    const enrichedMemberships = await Promise.all(
      memberships.map(async (membership) => {
        const organization = await ctx.db.get(membership.organizationId)
        return {
          ...membership,
          organization,
        }
      })
    )

    return enrichedMemberships
  },
})

/**
 * Vérifie si un utilisateur est membre d'une organisation
 */
export const isMember = query({
  args: {
    organizationId: v.id("organizations"),
    userId: v.id("users"),
  },
  handler: async (ctx, { organizationId, userId }) => {
    const membership = await ctx.db
      .query("organizationMembers")
      .withIndex("by_organizationId_userId", (q) =>
        q.eq("organizationId", organizationId).eq("userId", userId)
      )
      .unique()

    return membership !== null
  },
})

/**
 * Récupère le membership d'un utilisateur dans une organisation
 */
export const getMembership = query({
  args: {
    organizationId: v.id("organizations"),
    userId: v.id("users"),
  },
  handler: async (ctx, { organizationId, userId }) => {
    return await ctx.db
      .query("organizationMembers")
      .withIndex("by_organizationId_userId", (q) =>
        q.eq("organizationId", organizationId).eq("userId", userId)
      )
      .unique()
  },
})

/**
 * Liste les owners d'une organisation
 */
export const getOwners = query({
  args: { organizationId: v.id("organizations") },
  handler: async (ctx, { organizationId }) => {
    const owners = await ctx.db
      .query("organizationMembers")
      .withIndex("by_organizationId_role", (q) =>
        q.eq("organizationId", organizationId).eq("role", "OWNER")
      )
      .collect()

    const enrichedOwners = await Promise.all(
      owners.map(async (owner) => {
        const user = await ctx.db.get(owner.userId)
        return { ...owner, user }
      })
    )

    return enrichedOwners
  },
})

// =============================================================================
// MUTATIONS
// =============================================================================

/**
 * Ajoute un membre à une organisation (Admin only)
 */
export const addMember = mutation({
  args: {
    organizationId: v.id("organizations"),
    userId: v.id("users"),
    role: orgMemberRole,
  },
  handler: async (ctx, { organizationId, userId, role }) => {
    await requireAdmin(ctx)

    // Vérifier que l'organisation existe
    const org = await ctx.db.get(organizationId)
    if (!org) {
      throw new Error("Organisation non trouvée")
    }

    // Vérifier que l'utilisateur existe
    const user = await ctx.db.get(userId)
    if (!user) {
      throw new Error("Utilisateur non trouvé")
    }

    // Vérifier que le membre n'existe pas déjà
    const existingMembership = await ctx.db
      .query("organizationMembers")
      .withIndex("by_organizationId_userId", (q) =>
        q.eq("organizationId", organizationId).eq("userId", userId)
      )
      .unique()

    if (existingMembership) {
      throw new Error("L'utilisateur est déjà membre de cette organisation")
    }

    return await ctx.db.insert("organizationMembers", {
      organizationId,
      userId,
      role,
    })
  },
})

/**
 * Met à jour le rôle d'un membre (Admin only)
 */
export const updateRole = mutation({
  args: {
    membershipId: v.id("organizationMembers"),
    role: orgMemberRole,
  },
  handler: async (ctx, { membershipId, role }) => {
    await requireAdmin(ctx)

    const membership = await ctx.db.get(membershipId)
    if (!membership) {
      throw new Error("Membership non trouvé")
    }

    await ctx.db.patch(membershipId, { role })

    return membershipId
  },
})

/**
 * Retire un membre d'une organisation (Admin only)
 */
export const removeMember = mutation({
  args: { membershipId: v.id("organizationMembers") },
  handler: async (ctx, { membershipId }) => {
    await requireAdmin(ctx)

    const membership = await ctx.db.get(membershipId)
    if (!membership) {
      throw new Error("Membership non trouvé")
    }

    // Vérifier qu'on ne supprime pas le dernier owner
    if (membership.role === "OWNER") {
      const owners = await ctx.db
        .query("organizationMembers")
        .withIndex("by_organizationId_role", (q) =>
          q
            .eq("organizationId", membership.organizationId)
            .eq("role", "OWNER")
        )
        .collect()

      if (owners.length <= 1) {
        throw new Error(
          "Impossible de supprimer le dernier propriétaire de l'organisation"
        )
      }
    }

    await ctx.db.delete(membershipId)

    return membershipId
  },
})

/**
 * Transfère la propriété à un autre membre (Admin only)
 */
export const transferOwnership = mutation({
  args: {
    organizationId: v.id("organizations"),
    fromUserId: v.id("users"),
    toUserId: v.id("users"),
  },
  handler: async (ctx, { organizationId, fromUserId, toUserId }) => {
    await requireAdmin(ctx)

    // Récupérer les deux memberships
    const fromMembership = await ctx.db
      .query("organizationMembers")
      .withIndex("by_organizationId_userId", (q) =>
        q.eq("organizationId", organizationId).eq("userId", fromUserId)
      )
      .unique()

    const toMembership = await ctx.db
      .query("organizationMembers")
      .withIndex("by_organizationId_userId", (q) =>
        q.eq("organizationId", organizationId).eq("userId", toUserId)
      )
      .unique()

    if (!fromMembership || fromMembership.role !== "OWNER") {
      throw new Error("L'utilisateur source n'est pas propriétaire")
    }

    if (!toMembership) {
      throw new Error(
        "L'utilisateur cible n'est pas membre de l'organisation"
      )
    }

    // Transférer
    await ctx.db.patch(fromMembership._id, { role: "MEMBER" })
    await ctx.db.patch(toMembership._id, { role: "OWNER" })

    // Mettre à jour le ownerId de l'organisation
    await ctx.db.patch(organizationId, {
      ownerId: toUserId,
      updatedAt: Date.now(),
    })

    return true
  },
})
