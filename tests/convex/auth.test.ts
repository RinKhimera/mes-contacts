/// <reference types="vite/client" />
/**
 * Auth Library Tests
 *
 * Tests for authentication helper functions in convex/lib/auth.ts
 * Uses convex-test with edge-runtime environment.
 *
 * Since auth functions are helpers (not exported queries), we test them
 * indirectly through the queries that use them, or via t.run() which
 * provides access to the Convex context.
 */

import { convexTest } from "convex-test"
import { describe, expect, it } from "vitest"

import { api } from "../../convex/_generated/api"
import schema from "../../convex/schema"
import { createTestUser, createTestAdmin, createTestPost } from "./helpers/factories"

const modules = import.meta.glob("../../convex/**/*.ts")

describe("auth helpers via posts.create mutation", () => {
  /**
   * Testing requireAdmin indirectly through posts.create which requires admin
   */

  it("posts.create throws when not authenticated", async () => {
    const t = convexTest(schema, modules)

    // Create owner user for the post
    const ownerId = await t.run(async (ctx) => {
      return await createTestUser(ctx)
    })

    // Try to create post without authentication - should fail with auth error
    await expect(
      t.mutation(api.posts.create, {
        userId: ownerId,
        businessName: "Test Business",
        category: "Services",
        phone: "(514) 555-1234",
        email: "test@example.com",
        address: "123 Rue Test",
        city: "Montréal",
        province: "Québec",
        postalCode: "H2X 1Y4",
      })
    ).rejects.toThrow("Authentification requise")
  })

  it("posts.create throws when authenticated as non-admin USER", async () => {
    const t = convexTest(schema, modules)

    const tokenIdentifier = "https://clerk.example.com|regular_user"

    // Create regular user
    const userId = await t.run(async (ctx) => {
      return await createTestUser(ctx, {
        tokenIdentifier,
        role: "USER",
      })
    })

    // Try to create post as regular user - should fail with admin error
    const asUser = t.withIdentity({ tokenIdentifier })
    await expect(
      asUser.mutation(api.posts.create, {
        userId,
        businessName: "Test Business",
        category: "Services",
        phone: "(514) 555-1234",
        email: "test@example.com",
        address: "123 Rue Test",
        city: "Montréal",
        province: "Québec",
        postalCode: "H2X 1Y4",
      })
    ).rejects.toThrow("Accès réservé aux administrateurs")
  })

  it("posts.create succeeds when authenticated as ADMIN", async () => {
    const t = convexTest(schema, modules)

    const tokenIdentifier = "https://clerk.example.com|admin_user"

    // Create admin user
    const adminId = await t.run(async (ctx) => {
      return await createTestAdmin(ctx, { tokenIdentifier })
    })

    // Create owner user
    const ownerId = await t.run(async (ctx) => {
      return await createTestUser(ctx)
    })

    // Create post as admin - should succeed
    const asAdmin = t.withIdentity({ tokenIdentifier })
    const postId = await asAdmin.mutation(api.posts.create, {
      userId: ownerId,
      businessName: "Test Business",
      category: "Services",
      phone: "(514) 555-1234",
      email: "test@example.com",
      address: "123 Rue Test",
      city: "Montréal",
      province: "Québec",
      postalCode: "H2X 1Y4",
    })

    expect(postId).toBeDefined()

    // Verify post was created with correct data
    const post = await t.query(api.posts.getById, { id: postId })
    expect(post?.businessName).toBe("Test Business")
    expect(post?.status).toBe("DRAFT")
    expect(post?.createdBy).toEqual(adminId)
  })
})

describe("getCurrentUser via posts.getMyPosts query", () => {
  /**
   * Testing getCurrentUser indirectly through posts.getMyPosts
   */

  it("returns empty array when not authenticated", async () => {
    const t = convexTest(schema, modules)

    const posts = await t.query(api.posts.getMyPosts, {})

    expect(posts).toEqual([])
  })

  it("returns user posts when authenticated", async () => {
    const t = convexTest(schema, modules)

    const userToken = "https://clerk.example.com|my_posts_user"
    const adminToken = "https://clerk.example.com|my_posts_admin"

    // Create admin to create posts
    const adminId = await t.run(async (ctx) => {
      return await createTestAdmin(ctx, { tokenIdentifier: adminToken })
    })

    // Create user who will own posts
    const userId = await t.run(async (ctx) => {
      return await createTestUser(ctx, { tokenIdentifier: userToken })
    })

    // Create post for user (via admin)
    await t.run(async (ctx) => {
      await createTestPost(ctx, adminId, {
        userId,
        status: "PUBLISHED",
        businessName: "User Business",
      })
    })

    // Query as user
    const asUser = t.withIdentity({ tokenIdentifier: userToken })
    const posts = await asUser.query(api.posts.getMyPosts, {})

    expect(posts).toHaveLength(1)
    expect(posts[0].businessName).toBe("User Business")
  })
})

describe("isAdmin via users.getCurrentUser query", () => {
  /**
   * Testing role checking by querying user and checking role
   */

  it("returns ADMIN role for admin user", async () => {
    const t = convexTest(schema, modules)

    const tokenIdentifier = "https://clerk.example.com|check_admin_role"

    await t.run(async (ctx) => {
      await createTestAdmin(ctx, { tokenIdentifier })
    })

    const asAdmin = t.withIdentity({ tokenIdentifier })
    const user = await asAdmin.query(api.users.getCurrentUser, {})

    expect(user).not.toBeNull()
    expect(user?.role).toBe("ADMIN")
  })

  it("returns USER role for regular user", async () => {
    const t = convexTest(schema, modules)

    const tokenIdentifier = "https://clerk.example.com|check_user_role"

    await t.run(async (ctx) => {
      await createTestUser(ctx, { tokenIdentifier, role: "USER" })
    })

    const asUser = t.withIdentity({ tokenIdentifier })
    const user = await asUser.query(api.users.getCurrentUser, {})

    expect(user).not.toBeNull()
    expect(user?.role).toBe("USER")
  })

  it("returns null when not authenticated", async () => {
    const t = convexTest(schema, modules)

    const user = await t.query(api.users.getCurrentUser, {})

    expect(user).toBeNull()
  })
})
