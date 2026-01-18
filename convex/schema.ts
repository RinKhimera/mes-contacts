import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"

// =============================================================================
// ENUMS RÉUTILISABLES
// =============================================================================

/**
 * Rôles utilisateur - ADMIN peut créer des posts, USER est un membre standard
 */
export const userRole = v.union(v.literal("ADMIN"), v.literal("USER"))

/**
 * Rôles membre organisation - OWNER a créé l'org, MEMBER est membre standard
 */
export const orgMemberRole = v.union(v.literal("OWNER"), v.literal("MEMBER"))

/**
 * Statuts de post:
 * DRAFT → PUBLISHED → EXPIRED → DISABLED
 */
export const postStatus = v.union(
  v.literal("DRAFT"),
  v.literal("PUBLISHED"),
  v.literal("EXPIRED"),
  v.literal("DISABLED")
)

/**
 * Types de médias supportés (Bunny CDN)
 */
export const mediaType = v.union(
  v.literal("IMAGE"),
  v.literal("VIDEO"),
  v.literal("DOCUMENT")
)

/**
 * Méthodes de paiement manuelles
 */
export const paymentMethod = v.union(
  v.literal("CASH"),
  v.literal("E_TRANSFER"),
  v.literal("VIREMENT"),
  v.literal("CARD"),
  v.literal("OTHER")
)

/**
 * Statuts de paiement
 */
export const paymentStatus = v.union(
  v.literal("PENDING"),
  v.literal("COMPLETED"),
  v.literal("REFUNDED")
)

// =============================================================================
// TYPES RÉUTILISABLES
// =============================================================================

/**
 * Coordonnées géographiques pour Mapbox
 */
const geoCoordinates = v.object({
  longitude: v.number(),
  latitude: v.number(),
})

// =============================================================================
// SCHÉMA
// =============================================================================

export default defineSchema({
  // ===========================================================================
  // USERS - Synchronisés depuis Clerk via webhook
  // ===========================================================================
  users: defineTable({
    name: v.string(),
    email: v.string(),
    image: v.string(),
    avatarStoragePath: v.optional(v.string()), // Bunny CDN path for cleanup
    tokenIdentifier: v.string(), // Format: "{CLERK_FRONTEND_URL}|{clerk_user_id}"
    externalId: v.optional(v.string()), // Clerk user ID
    role: userRole,
  })
    .index("by_tokenIdentifier", ["tokenIdentifier"])
    .index("byExternalId", ["externalId"])
    .index("by_role", ["role"]),

  // ===========================================================================
  // ORGANIZATIONS - Entreprises/groupes
  // Note: _creationTime = date de création
  // ===========================================================================
  organizations: defineTable({
    name: v.string(),
    logo: v.optional(v.string()), // Bunny CDN URL
    logoStoragePath: v.optional(v.string()), // Bunny CDN path for cleanup
    description: v.optional(v.string()),
    sector: v.optional(v.string()),
    phone: v.optional(v.string()),
    email: v.optional(v.string()),
    website: v.optional(v.string()),
    address: v.optional(v.string()),
    city: v.optional(v.string()),
    province: v.optional(v.string()),
    postalCode: v.optional(v.string()),
    geo: v.optional(geoCoordinates),
    ownerId: v.id("users"), // User qui a demandé la création
    updatedAt: v.number(), // Dernière modification
  })
    .index("by_ownerId", ["ownerId"])
    .index("by_name", ["name"])
    .index("by_sector", ["sector"])
    .index("by_province_city", ["province", "city"]),

  // ===========================================================================
  // ORGANIZATION MEMBERS - Table de jonction
  // Note: _creationTime = date d'adhésion
  // ===========================================================================
  organizationMembers: defineTable({
    organizationId: v.id("organizations"),
    userId: v.id("users"),
    role: orgMemberRole,
  })
    .index("by_organizationId", ["organizationId"])
    .index("by_userId", ["userId"])
    .index("by_organizationId_userId", ["organizationId", "userId"])
    .index("by_organizationId_role", ["organizationId", "role"]),

  // ===========================================================================
  // POSTS - Annonces de services
  // Note: _creationTime = date de création du post
  // ===========================================================================
  posts: defineTable({
    // Ownership XOR: userId OU organizationId, jamais les deux
    userId: v.optional(v.id("users")),
    organizationId: v.optional(v.id("organizations")),

    // Infos business
    businessName: v.string(),
    category: v.string(),
    description: v.optional(v.string()),

    // Contact
    phone: v.string(),
    email: v.string(),
    website: v.optional(v.string()),

    // Localisation
    address: v.string(),
    city: v.string(),
    province: v.string(),
    postalCode: v.string(),
    geo: v.optional(geoCoordinates),

    // Lifecycle
    status: postStatus,
    publishedAt: v.optional(v.number()),
    expiresAt: v.optional(v.number()),

    // Audit
    createdBy: v.id("users"), // Admin qui a créé
  })
    .index("by_userId", ["userId"])
    .index("by_organizationId", ["organizationId"])
    .index("by_status", ["status"])
    .index("by_category", ["category"])
    .index("by_province", ["province"])
    .index("by_city", ["city"])
    .index("by_category_province", ["category", "province"])
    .index("by_category_province_city", ["category", "province", "city"])
    .index("by_status_category", ["status", "category"])
    .index("by_status_province", ["status", "province"])
    .index("by_status_province_city", ["status", "province", "city"])
    .index("by_createdBy", ["createdBy"])
    .index("by_status_expiresAt", ["status", "expiresAt"]),

  // ===========================================================================
  // MEDIA - Fichiers Bunny CDN
  // Note: _creationTime = date d'upload
  // ===========================================================================
  media: defineTable({
    postId: v.id("posts"),
    url: v.string(), // Bunny CDN URL
    storagePath: v.optional(v.string()), // Bunny Storage path for cleanup (optional for legacy records)
    type: mediaType,
    altText: v.optional(v.string()),
    order: v.number(),
  })
    .index("by_postId", ["postId"])
    .index("by_postId_type", ["postId", "type"])
    .index("by_postId_order", ["postId", "order"]),

  // ===========================================================================
  // PAYMENTS - Paiements manuels enregistrés par les admins
  // Note: _creationTime = date d'enregistrement
  // ===========================================================================
  payments: defineTable({
    postId: v.id("posts"),
    amount: v.number(), // En cents (5000 = 50.00 CAD)
    currency: v.string(), // "CAD"
    method: paymentMethod,
    status: paymentStatus,
    paymentDate: v.optional(v.number()), // Date de réception du paiement
    durationDays: v.number(), // Période de publication (30, 90, 365...)
    notes: v.optional(v.string()),
    externalReference: v.optional(v.string()), // Numéro de transaction
    recordedBy: v.id("users"), // Admin qui a enregistré
  })
    .index("by_postId", ["postId"])
    .index("by_status", ["status"])
    .index("by_method", ["method"])
    .index("by_status_method", ["status", "method"])
    .index("by_recordedBy", ["recordedBy"])
    .index("by_paymentDate", ["paymentDate"])
    .index("by_status_paymentDate", ["status", "paymentDate"]),

  // ===========================================================================
  // STATUS HISTORY - Audit log des changements de statut
  // Note: _creationTime = moment du changement
  // ===========================================================================
  statusHistory: defineTable({
    postId: v.id("posts"),
    previousStatus: v.optional(postStatus),
    newStatus: postStatus,
    changedBy: v.id("users"),
    reason: v.optional(v.string()),
  })
    .index("by_postId", ["postId"])
    .index("by_changedBy", ["changedBy"])
    .index("by_newStatus", ["newStatus"]),
})
