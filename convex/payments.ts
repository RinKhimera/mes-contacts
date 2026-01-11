import { v } from "convex/values"
import { mutation, query } from "./_generated/server"
import { requireAdmin } from "./lib/auth"
import { calculateExpiresAt } from "./lib/validation"
import { paymentMethod, paymentStatus } from "./schema"

// =============================================================================
// QUERIES
// =============================================================================

/**
 * Récupère un paiement par son ID
 */
export const getById = query({
  args: { id: v.id("payments") },
  handler: async (ctx, { id }) => {
    return await ctx.db.get(id)
  },
})

/**
 * Liste tous les paiements d'un post
 */
export const getByPost = query({
  args: { postId: v.id("posts") },
  handler: async (ctx, { postId }) => {
    return await ctx.db
      .query("payments")
      .withIndex("by_postId", (q) => q.eq("postId", postId))
      .order("desc")
      .collect()
  },
})

/**
 * Liste tous les paiements (Admin)
 */
export const list = query({
  args: {
    status: v.optional(paymentStatus),
    method: v.optional(paymentMethod),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, { status, method, limit }) => {
    let query = ctx.db.query("payments")

    if (status && method) {
      query = query.withIndex("by_status_method", (q) =>
        q.eq("status", status).eq("method", method)
      )
    } else if (status) {
      query = query.withIndex("by_status", (q) => q.eq("status", status))
    } else if (method) {
      query = query.withIndex("by_method", (q) => q.eq("method", method))
    }

    const results = await query.order("desc").collect()

    if (limit) {
      return results.slice(0, limit)
    }

    return results
  },
})

/**
 * Liste les paiements enregistrés par un admin
 */
export const getByRecordedBy = query({
  args: { adminId: v.id("users") },
  handler: async (ctx, { adminId }) => {
    return await ctx.db
      .query("payments")
      .withIndex("by_recordedBy", (q) => q.eq("recordedBy", adminId))
      .order("desc")
      .collect()
  },
})

/**
 * Liste les paiements par période
 */
export const getByDateRange = query({
  args: {
    startDate: v.number(),
    endDate: v.number(),
    status: v.optional(paymentStatus),
  },
  handler: async (ctx, { startDate, endDate, status }) => {
    let payments

    if (status) {
      payments = await ctx.db
        .query("payments")
        .withIndex("by_status_paymentDate", (q) => q.eq("status", status))
        .collect()
    } else {
      payments = await ctx.db
        .query("payments")
        .withIndex("by_paymentDate")
        .collect()
    }

    return payments.filter((p) => {
      const date = p.paymentDate
      if (!date) return false
      return date >= startDate && date <= endDate
    })
  },
})

/**
 * Calcule les statistiques de paiement
 */
export const getStats = query({
  args: {},
  handler: async (ctx) => {
    const allPayments = await ctx.db.query("payments").collect()

    const completed = allPayments.filter((p) => p.status === "COMPLETED")
    const pending = allPayments.filter((p) => p.status === "PENDING")
    const refunded = allPayments.filter((p) => p.status === "REFUNDED")

    const totalRevenue = completed.reduce((sum, p) => sum + p.amount, 0)
    const pendingAmount = pending.reduce((sum, p) => sum + p.amount, 0)
    const refundedAmount = refunded.reduce((sum, p) => sum + p.amount, 0)

    const byMethod: Record<string, number> = {}
    for (const payment of completed) {
      byMethod[payment.method] = (byMethod[payment.method] || 0) + payment.amount
    }

    return {
      totalCount: allPayments.length,
      completedCount: completed.length,
      pendingCount: pending.length,
      refundedCount: refunded.length,
      totalRevenue,
      pendingAmount,
      refundedAmount,
      byMethod,
    }
  },
})

// =============================================================================
// MUTATIONS
// =============================================================================

/**
 * Enregistre un paiement et publie le post (Admin only)
 */
export const record = mutation({
  args: {
    postId: v.id("posts"),
    amount: v.number(), // En cents
    method: paymentMethod,
    durationDays: v.number(),
    paymentDate: v.optional(v.number()),
    notes: v.optional(v.string()),
    externalReference: v.optional(v.string()),
    autoPublish: v.optional(v.boolean()), // Défaut: true
  },
  handler: async (ctx, args) => {
    const admin = await requireAdmin(ctx)

    const post = await ctx.db.get(args.postId)
    if (!post) {
      throw new Error("Post non trouvé")
    }

    const now = Date.now()
    const expiresAt = calculateExpiresAt(args.durationDays)

    // Enregistrer le paiement
    const paymentId = await ctx.db.insert("payments", {
      postId: args.postId,
      amount: args.amount,
      currency: "CAD",
      method: args.method,
      status: "COMPLETED",
      paymentDate: args.paymentDate ?? now,
      durationDays: args.durationDays,
      notes: args.notes,
      externalReference: args.externalReference,
      recordedBy: admin._id,
    })

    // Publier le post si autoPublish (défaut: true)
    const shouldPublish = args.autoPublish !== false
    if (shouldPublish) {
      const previousStatus = post.status
      await ctx.db.patch(args.postId, {
        status: "PUBLISHED",
        publishedAt: now,
        expiresAt,
      })

      // Audit log
      await ctx.db.insert("statusHistory", {
        postId: args.postId,
        previousStatus,
        newStatus: "PUBLISHED",
        changedBy: admin._id,
        reason: `Paiement de ${args.amount / 100} CAD - ${args.durationDays} jours`,
      })
    }

    return paymentId
  },
})

/**
 * Enregistre un paiement en attente (Admin only)
 */
export const recordPending = mutation({
  args: {
    postId: v.id("posts"),
    amount: v.number(),
    method: paymentMethod,
    durationDays: v.number(),
    notes: v.optional(v.string()),
    externalReference: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const admin = await requireAdmin(ctx)

    const post = await ctx.db.get(args.postId)
    if (!post) {
      throw new Error("Post non trouvé")
    }

    return await ctx.db.insert("payments", {
      postId: args.postId,
      amount: args.amount,
      currency: "CAD",
      method: args.method,
      status: "PENDING",
      durationDays: args.durationDays,
      notes: args.notes,
      externalReference: args.externalReference,
      recordedBy: admin._id,
    })
  },
})

/**
 * Confirme un paiement en attente et publie le post (Admin only)
 */
export const confirmPending = mutation({
  args: {
    paymentId: v.id("payments"),
    paymentDate: v.optional(v.number()),
  },
  handler: async (ctx, { paymentId, paymentDate }) => {
    const admin = await requireAdmin(ctx)

    const payment = await ctx.db.get(paymentId)
    if (!payment) {
      throw new Error("Paiement non trouvé")
    }

    if (payment.status !== "PENDING") {
      throw new Error("Ce paiement n'est pas en attente")
    }

    const now = Date.now()
    const expiresAt = calculateExpiresAt(payment.durationDays)

    // Confirmer le paiement
    await ctx.db.patch(paymentId, {
      status: "COMPLETED",
      paymentDate: paymentDate ?? now,
    })

    // Publier le post
    const post = await ctx.db.get(payment.postId)
    if (post) {
      const previousStatus = post.status
      await ctx.db.patch(payment.postId, {
        status: "PUBLISHED",
        publishedAt: now,
        expiresAt,
      })

      // Audit log
      await ctx.db.insert("statusHistory", {
        postId: payment.postId,
        previousStatus,
        newStatus: "PUBLISHED",
        changedBy: admin._id,
        reason: `Confirmation paiement de ${payment.amount / 100} CAD`,
      })
    }

    return paymentId
  },
})

/**
 * Marque un paiement comme remboursé (Admin only)
 */
export const refund = mutation({
  args: {
    paymentId: v.id("payments"),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, { paymentId, notes }) => {
    const admin = await requireAdmin(ctx)

    const payment = await ctx.db.get(paymentId)
    if (!payment) {
      throw new Error("Paiement non trouvé")
    }

    if (payment.status !== "COMPLETED") {
      throw new Error("Seuls les paiements complétés peuvent être remboursés")
    }

    // Marquer comme remboursé
    await ctx.db.patch(paymentId, {
      status: "REFUNDED",
      notes: notes
        ? `${payment.notes || ""}\n[REMBOURSÉ] ${notes}`.trim()
        : payment.notes,
    })

    // Désactiver le post
    const post = await ctx.db.get(payment.postId)
    if (post && post.status === "PUBLISHED") {
      await ctx.db.patch(payment.postId, {
        status: "DISABLED",
      })

      // Audit log
      await ctx.db.insert("statusHistory", {
        postId: payment.postId,
        previousStatus: "PUBLISHED",
        newStatus: "DISABLED",
        changedBy: admin._id,
        reason: "Paiement remboursé",
      })
    }

    return paymentId
  },
})

/**
 * Met à jour les notes d'un paiement (Admin only)
 */
export const updateNotes = mutation({
  args: {
    paymentId: v.id("payments"),
    notes: v.string(),
  },
  handler: async (ctx, { paymentId, notes }) => {
    await requireAdmin(ctx)

    const payment = await ctx.db.get(paymentId)
    if (!payment) {
      throw new Error("Paiement non trouvé")
    }

    await ctx.db.patch(paymentId, { notes })

    return paymentId
  },
})

/**
 * Renouvelle un post expiré avec un nouveau paiement (Admin only)
 */
export const renew = mutation({
  args: {
    postId: v.id("posts"),
    amount: v.number(),
    method: paymentMethod,
    durationDays: v.number(),
    paymentDate: v.optional(v.number()),
    notes: v.optional(v.string()),
    externalReference: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const admin = await requireAdmin(ctx)

    const post = await ctx.db.get(args.postId)
    if (!post) {
      throw new Error("Post non trouvé")
    }

    if (post.status !== "EXPIRED" && post.status !== "DISABLED") {
      throw new Error("Seuls les posts expirés ou désactivés peuvent être renouvelés")
    }

    const now = Date.now()
    const expiresAt = calculateExpiresAt(args.durationDays)

    // Enregistrer le nouveau paiement
    const paymentId = await ctx.db.insert("payments", {
      postId: args.postId,
      amount: args.amount,
      currency: "CAD",
      method: args.method,
      status: "COMPLETED",
      paymentDate: args.paymentDate ?? now,
      durationDays: args.durationDays,
      notes: args.notes ? `[RENOUVELLEMENT] ${args.notes}` : "[RENOUVELLEMENT]",
      externalReference: args.externalReference,
      recordedBy: admin._id,
    })

    // Republier le post
    const previousStatus = post.status
    await ctx.db.patch(args.postId, {
      status: "PUBLISHED",
      publishedAt: now,
      expiresAt,
    })

    // Audit log
    await ctx.db.insert("statusHistory", {
      postId: args.postId,
      previousStatus,
      newStatus: "PUBLISHED",
      changedBy: admin._id,
      reason: `Renouvellement - ${args.amount / 100} CAD pour ${args.durationDays} jours`,
    })

    return paymentId
  },
})
