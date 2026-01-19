/**
 * Test Factories for Convex Tests
 *
 * Provides reusable functions to create test data with sensible defaults.
 * All factories accept optional overrides for customization.
 */

import { Id } from "../../../convex/_generated/dataModel"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type TestContext = { db: any }

// =============================================================================
// USER FACTORIES
// =============================================================================

export const createTestUser = async (
  ctx: TestContext,
  overrides: {
    name?: string
    email?: string
    role?: "USER" | "ADMIN"
    tokenIdentifier?: string
  } = {}
): Promise<Id<"users">> => {
  const uniqueId = Date.now() + Math.random().toString(36).slice(2)
  return await ctx.db.insert("users", {
    name: overrides.name ?? "Test User",
    email: overrides.email ?? `test-${uniqueId}@example.com`,
    image: "https://example.com/avatar.jpg",
    tokenIdentifier:
      overrides.tokenIdentifier ?? `https://clerk.example.com|user_${uniqueId}`,
    role: overrides.role ?? "USER",
  })
}

export const createTestAdmin = async (
  ctx: TestContext,
  overrides: {
    name?: string
    email?: string
    tokenIdentifier?: string
  } = {}
): Promise<Id<"users">> => {
  return createTestUser(ctx, {
    ...overrides,
    name: overrides.name ?? "Admin User",
    role: "ADMIN",
  })
}

// =============================================================================
// ORGANIZATION FACTORIES
// =============================================================================

export const createTestOrganization = async (
  ctx: TestContext,
  ownerId: Id<"users">,
  overrides: {
    name?: string
    description?: string
    sector?: string
    phone?: string
    email?: string
    city?: string
    province?: string
  } = {}
): Promise<Id<"organizations">> => {
  return await ctx.db.insert("organizations", {
    name: overrides.name ?? "Test Organization",
    description: overrides.description,
    sector: overrides.sector,
    phone: overrides.phone,
    email: overrides.email,
    city: overrides.city,
    province: overrides.province,
    ownerId,
    updatedAt: Date.now(),
  })
}

export const createTestOrganizationMember = async (
  ctx: TestContext,
  organizationId: Id<"organizations">,
  userId: Id<"users">,
  role: "OWNER" | "MEMBER" = "MEMBER"
): Promise<Id<"organizationMembers">> => {
  return await ctx.db.insert("organizationMembers", {
    organizationId,
    userId,
    role,
  })
}

// =============================================================================
// POST FACTORIES
// =============================================================================

export const createTestPost = async (
  ctx: TestContext,
  createdBy: Id<"users">,
  overrides: {
    userId?: Id<"users">
    organizationId?: Id<"organizations">
    status?: "DRAFT" | "PUBLISHED" | "EXPIRED" | "DISABLED"
    businessName?: string
    category?: string
    description?: string
    phone?: string
    email?: string
    website?: string
    address?: string
    city?: string
    province?: string
    postalCode?: string
    publishedAt?: number
    expiresAt?: number
    geo?: { longitude: number; latitude: number }
  } = {}
): Promise<Id<"posts">> => {
  return await ctx.db.insert("posts", {
    userId: overrides.userId,
    organizationId: overrides.organizationId,
    createdBy,
    businessName: overrides.businessName ?? "Test Business",
    category: overrides.category ?? "Services",
    description: overrides.description,
    phone: overrides.phone ?? "(514) 555-1234",
    email: overrides.email ?? "business@example.com",
    website: overrides.website,
    address: overrides.address ?? "123 Rue Test",
    city: overrides.city ?? "Montréal",
    province: overrides.province ?? "Québec",
    postalCode: overrides.postalCode ?? "H2X 1Y4",
    status: overrides.status ?? "DRAFT",
    publishedAt: overrides.publishedAt,
    expiresAt: overrides.expiresAt,
    geo: overrides.geo,
  })
}

export const createPublishedPost = async (
  ctx: TestContext,
  createdBy: Id<"users">,
  overrides: Omit<NonNullable<Parameters<typeof createTestPost>[2]>, "status"> = {}
): Promise<Id<"posts">> => {
  return createTestPost(ctx, createdBy, {
    ...overrides,
    status: "PUBLISHED",
    publishedAt: overrides.publishedAt ?? Date.now(),
    expiresAt: overrides.expiresAt ?? Date.now() + 30 * 24 * 60 * 60 * 1000,
  })
}

// =============================================================================
// PAYMENT FACTORIES
// =============================================================================

export const createTestPayment = async (
  ctx: TestContext,
  postId: Id<"posts">,
  recordedBy: Id<"users">,
  overrides: {
    amount?: number
    status?: "PENDING" | "COMPLETED" | "REFUNDED"
    method?: "CASH" | "E_TRANSFER" | "VIREMENT" | "CARD" | "OTHER"
    durationDays?: number
    paymentDate?: number
    notes?: string
    externalReference?: string
  } = {}
): Promise<Id<"payments">> => {
  return await ctx.db.insert("payments", {
    postId,
    amount: overrides.amount ?? 5000, // 50.00 CAD
    currency: "CAD",
    method: overrides.method ?? "E_TRANSFER",
    status: overrides.status ?? "COMPLETED",
    durationDays: overrides.durationDays ?? 30,
    paymentDate: overrides.paymentDate,
    notes: overrides.notes,
    externalReference: overrides.externalReference,
    recordedBy,
  })
}

// =============================================================================
// MEDIA FACTORIES
// =============================================================================

export const createTestMedia = async (
  ctx: TestContext,
  postId: Id<"posts">,
  overrides: {
    url?: string
    storagePath?: string
    type?: "IMAGE" | "VIDEO" | "DOCUMENT"
    altText?: string
    order?: number
  } = {}
): Promise<Id<"media">> => {
  return await ctx.db.insert("media", {
    postId,
    url: overrides.url ?? "https://cdn.example.com/image.jpg",
    storagePath: overrides.storagePath ?? `posts/${postId}/image.jpg`,
    type: overrides.type ?? "IMAGE",
    altText: overrides.altText,
    order: overrides.order ?? 0,
  })
}

// =============================================================================
// STATUS HISTORY FACTORIES
// =============================================================================

export const createTestStatusHistory = async (
  ctx: TestContext,
  postId: Id<"posts">,
  changedBy: Id<"users">,
  overrides: {
    previousStatus?: "DRAFT" | "PUBLISHED" | "EXPIRED" | "DISABLED"
    newStatus?: "DRAFT" | "PUBLISHED" | "EXPIRED" | "DISABLED"
    reason?: string
  } = {}
): Promise<Id<"statusHistory">> => {
  return await ctx.db.insert("statusHistory", {
    postId,
    previousStatus: overrides.previousStatus,
    newStatus: overrides.newStatus ?? "DRAFT",
    changedBy,
    reason: overrides.reason,
  })
}
