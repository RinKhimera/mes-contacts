/// <reference types="vite/client" />
/**
 * Convex Posts Backend Tests
 *
 * Tests for Convex queries and mutations.
 * Uses convex-test with edge-runtime environment.
 */

import { convexTest } from "convex-test"
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest"

import { api, internal } from "../../convex/_generated/api"
import schema from "../../convex/schema"
import {
  createTestUser,
  createTestAdmin,
  createTestPost,
  createPublishedPost,
  createTestOrganization,
  createTestOrganizationMember,
  createTestMedia,
  createTestPayment,
  createTestStatusHistory,
} from "./helpers/factories"

const modules = import.meta.glob("../../convex/**/*.ts")

// =============================================================================
// QUERIES
// =============================================================================

describe("posts.getById", () => {
  it("returns post by ID", async () => {
    const t = convexTest(schema, modules)

    const adminId = await t.run(async (ctx) => {
      return await createTestAdmin(ctx)
    })

    const userId = await t.run(async (ctx) => {
      return await createTestUser(ctx)
    })

    const postId = await t.run(async (ctx) => {
      return await createTestPost(ctx, adminId, {
        userId,
        businessName: "GetById Test",
      })
    })

    const post = await t.query(api.posts.getById, { id: postId })

    expect(post).not.toBeNull()
    expect(post?.businessName).toBe("GetById Test")
  })

  it("returns null for non-existent post", async () => {
    const t = convexTest(schema, modules)

    const adminId = await t.run(async (ctx) => {
      return await createTestAdmin(ctx)
    })

    const userId = await t.run(async (ctx) => {
      return await createTestUser(ctx)
    })

    // Create a post so we get a valid ID format
    const postId = await t.run(async (ctx) => {
      return await createTestPost(ctx, adminId, { userId })
    })

    // Delete the post
    await t.run(async (ctx) => {
      await ctx.db.delete(postId)
    })

    const post = await t.query(api.posts.getById, { id: postId })
    expect(post).toBeNull()
  })
})

describe("posts.getByIdWithDetails", () => {
  it("returns post with media and owner info", async () => {
    const t = convexTest(schema, modules)

    const adminId = await t.run(async (ctx) => {
      return await createTestAdmin(ctx, { name: "Creator Admin" })
    })

    const userId = await t.run(async (ctx) => {
      return await createTestUser(ctx, { name: "Owner User" })
    })

    const postId = await t.run(async (ctx) => {
      return await createTestPost(ctx, adminId, {
        userId,
        businessName: "Details Test",
      })
    })

    // Add media
    await t.run(async (ctx) => {
      await createTestMedia(ctx, postId, { order: 0 })
      await createTestMedia(ctx, postId, { order: 1 })
    })

    const result = await t.query(api.posts.getByIdWithDetails, { id: postId })

    expect(result).not.toBeNull()
    expect(result?.businessName).toBe("Details Test")
    expect(result?.media).toHaveLength(2)
    expect(result?.owner?.name).toBe("Owner User")
    expect(result?.ownerType).toBe("user")
    expect(result?.createdByUser?.name).toBe("Creator Admin")
  })

  it("returns organization as owner when post belongs to org", async () => {
    const t = convexTest(schema, modules)

    const adminId = await t.run(async (ctx) => {
      return await createTestAdmin(ctx)
    })

    const userId = await t.run(async (ctx) => {
      return await createTestUser(ctx)
    })

    const orgId = await t.run(async (ctx) => {
      return await createTestOrganization(ctx, userId, { name: "Test Org" })
    })

    const postId = await t.run(async (ctx) => {
      return await createTestPost(ctx, adminId, { organizationId: orgId })
    })

    const result = await t.query(api.posts.getByIdWithDetails, { id: postId })

    expect(result?.ownerType).toBe("organization")
    expect(result?.owner?.name).toBe("Test Org")
  })

  it("returns null for non-existent post", async () => {
    const t = convexTest(schema, modules)

    const adminId = await t.run(async (ctx) => {
      return await createTestAdmin(ctx)
    })

    const userId = await t.run(async (ctx) => {
      return await createTestUser(ctx)
    })

    const postId = await t.run(async (ctx) => {
      return await createTestPost(ctx, adminId, { userId })
    })

    await t.run(async (ctx) => {
      await ctx.db.delete(postId)
    })

    const result = await t.query(api.posts.getByIdWithDetails, { id: postId })
    expect(result).toBeNull()
  })
})

describe("posts.list", () => {
  it("returns posts filtered by status", async () => {
    const t = convexTest(schema, modules)

    const adminId = await t.run(async (ctx) => {
      return await createTestAdmin(ctx)
    })

    const userId = await t.run(async (ctx) => {
      return await createTestUser(ctx)
    })

    await t.run(async (ctx) => {
      await createTestPost(ctx, adminId, { userId, status: "DRAFT" })
      await createTestPost(ctx, adminId, { userId, status: "PUBLISHED" })
      await createTestPost(ctx, adminId, { userId, status: "PUBLISHED" })
      await createTestPost(ctx, adminId, { userId, status: "EXPIRED" })
    })

    const published = await t.query(api.posts.list, { status: "PUBLISHED" })
    const draft = await t.query(api.posts.list, { status: "DRAFT" })
    const all = await t.query(api.posts.list, {})

    expect(published).toHaveLength(2)
    expect(draft).toHaveLength(1)
    expect(all).toHaveLength(4)
  })

  it("respects limit parameter", async () => {
    const t = convexTest(schema, modules)

    const adminId = await t.run(async (ctx) => {
      return await createTestAdmin(ctx)
    })

    const userId = await t.run(async (ctx) => {
      return await createTestUser(ctx)
    })

    await t.run(async (ctx) => {
      for (let i = 0; i < 5; i++) {
        await createTestPost(ctx, adminId, { userId, status: "PUBLISHED" })
      }
    })

    const limited = await t.query(api.posts.list, { limit: 3 })
    expect(limited).toHaveLength(3)
  })
})

describe("posts.getPublished", () => {
  it("returns only PUBLISHED posts", async () => {
    const t = convexTest(schema, modules)

    const adminId = await t.run(async (ctx) => {
      return await createTestAdmin(ctx)
    })

    const userId = await t.run(async (ctx) => {
      return await createTestUser(ctx)
    })

    await t.run(async (ctx) => {
      await createTestPost(ctx, adminId, { userId, status: "DRAFT" })
      await createTestPost(ctx, adminId, { userId, status: "PUBLISHED" })
      await createTestPost(ctx, adminId, { userId, status: "EXPIRED" })
    })

    const posts = await t.query(api.posts.getPublished, {})

    expect(posts).toHaveLength(1)
    expect(posts[0].status).toBe("PUBLISHED")
  })
})

describe("posts.getByUser", () => {
  it("returns posts for specific user", async () => {
    const t = convexTest(schema, modules)

    const adminId = await t.run(async (ctx) => {
      return await createTestAdmin(ctx)
    })

    const user1 = await t.run(async (ctx) => {
      return await createTestUser(ctx)
    })

    const user2 = await t.run(async (ctx) => {
      return await createTestUser(ctx)
    })

    await t.run(async (ctx) => {
      await createTestPost(ctx, adminId, { userId: user1 })
      await createTestPost(ctx, adminId, { userId: user1 })
      await createTestPost(ctx, adminId, { userId: user2 })
    })

    const user1Posts = await t.query(api.posts.getByUser, { userId: user1 })
    const user2Posts = await t.query(api.posts.getByUser, { userId: user2 })

    expect(user1Posts).toHaveLength(2)
    expect(user2Posts).toHaveLength(1)
  })
})

describe("posts.getByOrganization", () => {
  it("returns posts for specific organization", async () => {
    const t = convexTest(schema, modules)

    const adminId = await t.run(async (ctx) => {
      return await createTestAdmin(ctx)
    })

    const userId = await t.run(async (ctx) => {
      return await createTestUser(ctx)
    })

    const org1 = await t.run(async (ctx) => {
      return await createTestOrganization(ctx, userId)
    })

    const org2 = await t.run(async (ctx) => {
      return await createTestOrganization(ctx, userId)
    })

    await t.run(async (ctx) => {
      await createTestPost(ctx, adminId, { organizationId: org1 })
      await createTestPost(ctx, adminId, { organizationId: org2 })
      await createTestPost(ctx, adminId, { organizationId: org2 })
    })

    const org1Posts = await t.query(api.posts.getByOrganization, {
      organizationId: org1,
    })
    const org2Posts = await t.query(api.posts.getByOrganization, {
      organizationId: org2,
    })

    expect(org1Posts).toHaveLength(1)
    expect(org2Posts).toHaveLength(2)
  })
})

describe("posts.search", () => {
  it("filters by category (only PUBLISHED)", async () => {
    const t = convexTest(schema, modules)

    const adminId = await t.run(async (ctx) => {
      return await createTestAdmin(ctx)
    })

    const userId = await t.run(async (ctx) => {
      return await createTestUser(ctx)
    })

    await t.run(async (ctx) => {
      await createPublishedPost(ctx, adminId, { userId, category: "Services" })
      await createPublishedPost(ctx, adminId, { userId, category: "Services" })
      await createPublishedPost(ctx, adminId, { userId, category: "Commerce" })
      // DRAFT post should not appear
      await createTestPost(ctx, adminId, {
        userId,
        category: "Services",
        status: "DRAFT",
      })
    })

    const services = await t.query(api.posts.search, { category: "Services" })
    const commerce = await t.query(api.posts.search, { category: "Commerce" })

    expect(services).toHaveLength(2)
    expect(commerce).toHaveLength(1)
  })

  it("filters by province", async () => {
    const t = convexTest(schema, modules)

    const adminId = await t.run(async (ctx) => {
      return await createTestAdmin(ctx)
    })

    const userId = await t.run(async (ctx) => {
      return await createTestUser(ctx)
    })

    await t.run(async (ctx) => {
      await createPublishedPost(ctx, adminId, { userId, province: "Québec" })
      await createPublishedPost(ctx, adminId, { userId, province: "Ontario" })
    })

    const quebec = await t.query(api.posts.search, { province: "Québec" })

    expect(quebec).toHaveLength(1)
    expect(quebec[0].province).toBe("Québec")
  })

  it("filters by searchTerm in businessName", async () => {
    const t = convexTest(schema, modules)

    const adminId = await t.run(async (ctx) => {
      return await createTestAdmin(ctx)
    })

    const userId = await t.run(async (ctx) => {
      return await createTestUser(ctx)
    })

    await t.run(async (ctx) => {
      await createPublishedPost(ctx, adminId, {
        userId,
        businessName: "ABC Plumbing",
      })
      await createPublishedPost(ctx, adminId, {
        userId,
        businessName: "XYZ Electric",
      })
      await createPublishedPost(ctx, adminId, {
        userId,
        businessName: "ABC Roofing",
      })
    })

    const abc = await t.query(api.posts.search, { searchTerm: "ABC" })

    expect(abc).toHaveLength(2)
  })

  it("combines multiple filters", async () => {
    const t = convexTest(schema, modules)

    const adminId = await t.run(async (ctx) => {
      return await createTestAdmin(ctx)
    })

    const userId = await t.run(async (ctx) => {
      return await createTestUser(ctx)
    })

    await t.run(async (ctx) => {
      await createPublishedPost(ctx, adminId, {
        userId,
        category: "Services",
        province: "Québec",
        city: "Montréal",
      })
      await createPublishedPost(ctx, adminId, {
        userId,
        category: "Services",
        province: "Ontario",
        city: "Toronto",
      })
      await createPublishedPost(ctx, adminId, {
        userId,
        category: "Commerce",
        province: "Québec",
        city: "Montréal",
      })
    })

    const result = await t.query(api.posts.search, {
      category: "Services",
      province: "Québec",
      city: "Montréal",
    })

    expect(result).toHaveLength(1)
    expect(result[0].category).toBe("Services")
    expect(result[0].province).toBe("Québec")
  })
})

describe("posts.searchAdmin", () => {
  it("returns posts of all statuses", async () => {
    const t = convexTest(schema, modules)

    const adminId = await t.run(async (ctx) => {
      return await createTestAdmin(ctx)
    })

    const userId = await t.run(async (ctx) => {
      return await createTestUser(ctx)
    })

    await t.run(async (ctx) => {
      await createTestPost(ctx, adminId, { userId, status: "DRAFT" })
      await createTestPost(ctx, adminId, { userId, status: "PUBLISHED" })
      await createTestPost(ctx, adminId, { userId, status: "EXPIRED" })
    })

    const all = await t.query(api.posts.searchAdmin, {})

    expect(all).toHaveLength(3)
  })

  it("filters by status", async () => {
    const t = convexTest(schema, modules)

    const adminId = await t.run(async (ctx) => {
      return await createTestAdmin(ctx)
    })

    const userId = await t.run(async (ctx) => {
      return await createTestUser(ctx)
    })

    await t.run(async (ctx) => {
      await createTestPost(ctx, adminId, { userId, status: "DRAFT" })
      await createTestPost(ctx, adminId, { userId, status: "DRAFT" })
      await createTestPost(ctx, adminId, { userId, status: "PUBLISHED" })
    })

    const drafts = await t.query(api.posts.searchAdmin, { status: "DRAFT" })

    expect(drafts).toHaveLength(2)
  })
})

describe("posts.getMyPosts", () => {
  it("returns posts for authenticated user and their orgs", async () => {
    const t = convexTest(schema, modules)

    const userToken = "https://clerk.example.com|myposts_user"
    const adminToken = "https://clerk.example.com|myposts_admin"

    const adminId = await t.run(async (ctx) => {
      return await createTestAdmin(ctx, { tokenIdentifier: adminToken })
    })

    const userId = await t.run(async (ctx) => {
      return await createTestUser(ctx, { tokenIdentifier: userToken })
    })

    const orgId = await t.run(async (ctx) => {
      return await createTestOrganization(ctx, userId)
    })

    // Add user as member of org
    await t.run(async (ctx) => {
      await createTestOrganizationMember(ctx, orgId, userId, "OWNER")
    })

    // Create posts: 2 for user directly, 1 for org
    await t.run(async (ctx) => {
      await createTestPost(ctx, adminId, { userId })
      await createTestPost(ctx, adminId, { userId })
      await createTestPost(ctx, adminId, { organizationId: orgId })
    })

    const asUser = t.withIdentity({ tokenIdentifier: userToken })
    const posts = await asUser.query(api.posts.getMyPosts, {})

    // Should get all 3: 2 personal + 1 from org
    expect(posts).toHaveLength(3)
  })
})

// =============================================================================
// MUTATIONS
// =============================================================================

describe("posts.create", () => {
  it("creates DRAFT post with userId ownership", async () => {
    const t = convexTest(schema, modules)

    const adminToken = "https://clerk.example.com|create_admin"
    const adminId = await t.run(async (ctx) => {
      return await createTestAdmin(ctx, { tokenIdentifier: adminToken })
    })

    const userId = await t.run(async (ctx) => {
      return await createTestUser(ctx)
    })

    const asAdmin = t.withIdentity({ tokenIdentifier: adminToken })
    const postId = await asAdmin.mutation(api.posts.create, {
      userId,
      businessName: "New Business",
      category: "Services",
      phone: "(514) 555-1234",
      email: "test@example.com",
      address: "123 Test St",
      city: "Montréal",
      province: "Québec",
      postalCode: "H2X 1Y4",
    })

    const post = await t.query(api.posts.getById, { id: postId })

    expect(post?.status).toBe("DRAFT")
    expect(post?.userId).toEqual(userId)
    expect(post?.createdBy).toEqual(adminId)
  })

  it("creates DRAFT post with organizationId ownership", async () => {
    const t = convexTest(schema, modules)

    const adminToken = "https://clerk.example.com|create_org_admin"
    await t.run(async (ctx) => {
      return await createTestAdmin(ctx, { tokenIdentifier: adminToken })
    })

    const userId = await t.run(async (ctx) => {
      return await createTestUser(ctx)
    })

    const orgId = await t.run(async (ctx) => {
      return await createTestOrganization(ctx, userId)
    })

    const asAdmin = t.withIdentity({ tokenIdentifier: adminToken })
    const postId = await asAdmin.mutation(api.posts.create, {
      organizationId: orgId,
      businessName: "Org Business",
      category: "Services",
      phone: "(514) 555-1234",
      email: "test@example.com",
      address: "123 Test St",
      city: "Montréal",
      province: "Québec",
      postalCode: "H2X 1Y4",
    })

    const post = await t.query(api.posts.getById, { id: postId })

    expect(post?.organizationId).toEqual(orgId)
    expect(post?.userId).toBeUndefined()
  })

  it("handles geo coordinates correctly", async () => {
    const t = convexTest(schema, modules)

    const adminToken = "https://clerk.example.com|geo_admin"
    await t.run(async (ctx) => {
      return await createTestAdmin(ctx, { tokenIdentifier: adminToken })
    })

    const userId = await t.run(async (ctx) => {
      return await createTestUser(ctx)
    })

    const asAdmin = t.withIdentity({ tokenIdentifier: adminToken })
    const postId = await asAdmin.mutation(api.posts.create, {
      userId,
      businessName: "Geo Business",
      category: "Services",
      phone: "(514) 555-1234",
      email: "test@example.com",
      address: "123 Test St",
      city: "Montréal",
      province: "Québec",
      postalCode: "H2X 1Y4",
      longitude: -73.5673,
      latitude: 45.5017,
    })

    const post = await t.query(api.posts.getById, { id: postId })

    expect(post?.geo?.longitude).toBe(-73.5673)
    expect(post?.geo?.latitude).toBe(45.5017)
  })
})

describe("posts.update", () => {
  it("updates post fields", async () => {
    const t = convexTest(schema, modules)

    const adminToken = "https://clerk.example.com|update_admin"
    const adminId = await t.run(async (ctx) => {
      return await createTestAdmin(ctx, { tokenIdentifier: adminToken })
    })

    const userId = await t.run(async (ctx) => {
      return await createTestUser(ctx)
    })

    const postId = await t.run(async (ctx) => {
      return await createTestPost(ctx, adminId, {
        userId,
        businessName: "Old Name",
      })
    })

    const asAdmin = t.withIdentity({ tokenIdentifier: adminToken })
    await asAdmin.mutation(api.posts.update, {
      id: postId,
      businessName: "New Name",
      description: "Updated description",
    })

    const post = await t.query(api.posts.getById, { id: postId })

    expect(post?.businessName).toBe("New Name")
    expect(post?.description).toBe("Updated description")
  })

  it("preserves existing geo when partial update", async () => {
    const t = convexTest(schema, modules)

    const adminToken = "https://clerk.example.com|geo_preserve_admin"
    const adminId = await t.run(async (ctx) => {
      return await createTestAdmin(ctx, { tokenIdentifier: adminToken })
    })

    const userId = await t.run(async (ctx) => {
      return await createTestUser(ctx)
    })

    const postId = await t.run(async (ctx) => {
      return await createTestPost(ctx, adminId, {
        userId,
        geo: { longitude: -73.5673, latitude: 45.5017 },
      })
    })

    const asAdmin = t.withIdentity({ tokenIdentifier: adminToken })
    await asAdmin.mutation(api.posts.update, {
      id: postId,
      businessName: "Updated",
    })

    const post = await t.query(api.posts.getById, { id: postId })

    expect(post?.geo?.longitude).toBe(-73.5673)
  })
})

describe("posts.changeStatus", () => {
  it("changes status and creates audit log", async () => {
    const t = convexTest(schema, modules)

    const adminToken = "https://clerk.example.com|status_admin"
    const adminId = await t.run(async (ctx) => {
      return await createTestAdmin(ctx, { tokenIdentifier: adminToken })
    })

    const userId = await t.run(async (ctx) => {
      return await createTestUser(ctx)
    })

    const postId = await t.run(async (ctx) => {
      return await createTestPost(ctx, adminId, { userId, status: "DRAFT" })
    })

    const asAdmin = t.withIdentity({ tokenIdentifier: adminToken })
    await asAdmin.mutation(api.posts.changeStatus, {
      id: postId,
      status: "DISABLED",
      reason: "Test disable",
    })

    const post = await t.query(api.posts.getById, { id: postId })
    expect(post?.status).toBe("DISABLED")

    // Check audit log
    const history = await t.run(async (ctx) => {
      return await ctx.db
        .query("statusHistory")
        .withIndex("by_postId", (q) => q.eq("postId", postId))
        .collect()
    })

    expect(history.length).toBeGreaterThan(0)
    expect(history[history.length - 1].newStatus).toBe("DISABLED")
  })

  it("sets publishedAt when publishing", async () => {
    const t = convexTest(schema, modules)

    vi.useFakeTimers()
    vi.setSystemTime(new Date("2024-06-15T12:00:00Z"))

    const adminToken = "https://clerk.example.com|publish_admin"
    const adminId = await t.run(async (ctx) => {
      return await createTestAdmin(ctx, { tokenIdentifier: adminToken })
    })

    const userId = await t.run(async (ctx) => {
      return await createTestUser(ctx)
    })

    const postId = await t.run(async (ctx) => {
      return await createTestPost(ctx, adminId, { userId, status: "DRAFT" })
    })

    const asAdmin = t.withIdentity({ tokenIdentifier: adminToken })
    await asAdmin.mutation(api.posts.changeStatus, {
      id: postId,
      status: "PUBLISHED",
    })

    const post = await t.query(api.posts.getById, { id: postId })
    expect(post?.publishedAt).toBe(Date.now())

    vi.useRealTimers()
  })
})

describe("posts.remove", () => {
  it("deletes post and all associated data", async () => {
    const t = convexTest(schema, modules)

    const adminToken = "https://clerk.example.com|remove_admin"
    const adminId = await t.run(async (ctx) => {
      return await createTestAdmin(ctx, { tokenIdentifier: adminToken })
    })

    const userId = await t.run(async (ctx) => {
      return await createTestUser(ctx)
    })

    const postId = await t.run(async (ctx) => {
      return await createTestPost(ctx, adminId, { userId })
    })

    // Add associated data
    await t.run(async (ctx) => {
      await createTestMedia(ctx, postId)
      await createTestPayment(ctx, postId, adminId)
      await createTestStatusHistory(ctx, postId, adminId)
    })

    const asAdmin = t.withIdentity({ tokenIdentifier: adminToken })
    const result = await asAdmin.mutation(api.posts.remove, { id: postId })

    expect(result.id).toEqual(postId)

    // Verify post is deleted
    const post = await t.query(api.posts.getById, { id: postId })
    expect(post).toBeNull()

    // Verify associated data is deleted
    const media = await t.run(async (ctx) => {
      return await ctx.db
        .query("media")
        .withIndex("by_postId", (q) => q.eq("postId", postId))
        .collect()
    })
    expect(media).toHaveLength(0)
  })

  it("returns mediaStoragePaths for Bunny cleanup", async () => {
    const t = convexTest(schema, modules)

    const adminToken = "https://clerk.example.com|remove_paths_admin"
    const adminId = await t.run(async (ctx) => {
      return await createTestAdmin(ctx, { tokenIdentifier: adminToken })
    })

    const userId = await t.run(async (ctx) => {
      return await createTestUser(ctx)
    })

    const postId = await t.run(async (ctx) => {
      return await createTestPost(ctx, adminId, { userId })
    })

    await t.run(async (ctx) => {
      await createTestMedia(ctx, postId, { storagePath: "posts/test/image1.jpg" })
      await createTestMedia(ctx, postId, { storagePath: "posts/test/image2.jpg" })
    })

    const asAdmin = t.withIdentity({ tokenIdentifier: adminToken })
    const result = await asAdmin.mutation(api.posts.remove, { id: postId })

    expect(result.mediaStoragePaths).toHaveLength(2)
    expect(result.mediaStoragePaths).toContain("posts/test/image1.jpg")
    expect(result.mediaStoragePaths).toContain("posts/test/image2.jpg")
  })
})

// =============================================================================
// INTERNAL MUTATIONS
// =============================================================================

describe("posts.expireOldPosts", () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it("expires posts past expiresAt date", async () => {
    const t = convexTest(schema, modules)

    vi.setSystemTime(new Date("2024-06-01T12:00:00Z"))

    const adminId = await t.run(async (ctx) => {
      return await createTestAdmin(ctx)
    })

    const userId = await t.run(async (ctx) => {
      return await createTestUser(ctx)
    })

    // Create post that expired yesterday
    const expiredPostId = await t.run(async (ctx) => {
      return await createPublishedPost(ctx, adminId, {
        userId,
        expiresAt: Date.now() - 24 * 60 * 60 * 1000, // Yesterday
      })
    })

    // Create post that expires tomorrow
    const activePostId = await t.run(async (ctx) => {
      return await createPublishedPost(ctx, adminId, {
        userId,
        expiresAt: Date.now() + 24 * 60 * 60 * 1000, // Tomorrow
      })
    })

    // Run the cron job
    const result = await t.mutation(internal.posts.expireOldPosts, {})

    expect(result.expiredCount).toBe(1)

    // Check statuses
    const expiredPost = await t.query(api.posts.getById, { id: expiredPostId })
    const activePost = await t.query(api.posts.getById, { id: activePostId })

    expect(expiredPost?.status).toBe("EXPIRED")
    expect(activePost?.status).toBe("PUBLISHED")
  })

  it("creates audit log for each expiration", async () => {
    const t = convexTest(schema, modules)

    vi.setSystemTime(new Date("2024-06-01T12:00:00Z"))

    const adminId = await t.run(async (ctx) => {
      return await createTestAdmin(ctx)
    })

    const userId = await t.run(async (ctx) => {
      return await createTestUser(ctx)
    })

    const postId = await t.run(async (ctx) => {
      return await createPublishedPost(ctx, adminId, {
        userId,
        expiresAt: Date.now() - 24 * 60 * 60 * 1000,
      })
    })

    await t.mutation(internal.posts.expireOldPosts, {})

    const history = await t.run(async (ctx) => {
      return await ctx.db
        .query("statusHistory")
        .withIndex("by_postId", (q) => q.eq("postId", postId))
        .collect()
    })

    const expirationEntry = history.find(
      (h) => h.newStatus === "EXPIRED" && h.previousStatus === "PUBLISHED"
    )
    expect(expirationEntry).toBeDefined()
    expect(expirationEntry?.reason).toContain("expirée")
  })
})
