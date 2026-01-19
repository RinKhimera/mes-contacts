/// <reference types="vite/client" />
/**
 * Users Module Tests
 *
 * Tests for user-related queries and mutations.
 * Uses convex-test with edge-runtime environment.
 */

import { convexTest } from "convex-test"
import { describe, expect, it } from "vitest"

import { api, internal } from "../../convex/_generated/api"
import schema from "../../convex/schema"
import { createTestUser } from "./helpers/factories"

const modules = import.meta.glob("../../convex/**/*.ts")

// =============================================================================
// QUERIES
// =============================================================================

describe("users.getCurrentUser", () => {
  it("returns null when not authenticated", async () => {
    const t = convexTest(schema, modules)

    const user = await t.query(api.users.getCurrentUser, {})

    expect(user).toBeNull()
  })

  it("returns user when authenticated", async () => {
    const t = convexTest(schema, modules)

    const tokenIdentifier = "https://clerk.example.com|current_user_test"
    await t.run(async (ctx) => {
      return await createTestUser(ctx, {
        tokenIdentifier,
        name: "Test User",
        email: "test@example.com",
      })
    })

    const asUser = t.withIdentity({ tokenIdentifier })
    const user = await asUser.query(api.users.getCurrentUser, {})

    expect(user).not.toBeNull()
    expect(user?.name).toBe("Test User")
    expect(user?.email).toBe("test@example.com")
  })
})

describe("users.list", () => {
  it("returns all users", async () => {
    const t = convexTest(schema, modules)

    await t.run(async (ctx) => {
      await createTestUser(ctx, { name: "User 1" })
      await createTestUser(ctx, { name: "User 2" })
      await createTestUser(ctx, { name: "User 3" })
    })

    const users = await t.query(api.users.list, {})

    expect(users).toHaveLength(3)
  })
})

describe("users.search", () => {
  it("searches users by name", async () => {
    const t = convexTest(schema, modules)

    await t.run(async (ctx) => {
      await createTestUser(ctx, { name: "Alice Smith", email: "alice@test.com" })
      await createTestUser(ctx, { name: "Bob Jones", email: "bob@test.com" })
      await createTestUser(ctx, {
        name: "Charlie Brown",
        email: "charlie@test.com",
      })
    })

    const results = await t.query(api.users.search, { query: "alice" })

    expect(results).toHaveLength(1)
    expect(results[0].name).toBe("Alice Smith")
  })

  it("searches users by email", async () => {
    const t = convexTest(schema, modules)

    await t.run(async (ctx) => {
      await createTestUser(ctx, { name: "User A", email: "alice@company.com" })
      await createTestUser(ctx, { name: "User B", email: "bob@other.com" })
    })

    const results = await t.query(api.users.search, { query: "company.com" })

    expect(results).toHaveLength(1)
    expect(results[0].name).toBe("User A")
  })

  it("returns empty when no match", async () => {
    const t = convexTest(schema, modules)

    await t.run(async (ctx) => {
      await createTestUser(ctx, { name: "John Doe", email: "john@test.com" })
    })

    const results = await t.query(api.users.search, { query: "xyz" })

    expect(results).toHaveLength(0)
  })

  it("returns all when query is empty", async () => {
    const t = convexTest(schema, modules)

    await t.run(async (ctx) => {
      await createTestUser(ctx, { name: "User 1" })
      await createTestUser(ctx, { name: "User 2" })
    })

    const results = await t.query(api.users.search, { query: "" })

    expect(results).toHaveLength(2)
  })
})

describe("users.getById", () => {
  it("returns user by ID", async () => {
    const t = convexTest(schema, modules)

    const userId = await t.run(async (ctx) => {
      return await createTestUser(ctx, { name: "Specific User" })
    })

    const user = await t.query(api.users.getById, { id: userId })

    expect(user).not.toBeNull()
    expect(user?.name).toBe("Specific User")
  })

  it("returns null for non-existent user", async () => {
    const t = convexTest(schema, modules)

    const userId = await t.run(async (ctx) => {
      return await createTestUser(ctx)
    })

    await t.run(async (ctx) => {
      await ctx.db.delete(userId)
    })

    const user = await t.query(api.users.getById, { id: userId })
    expect(user).toBeNull()
  })
})

// =============================================================================
// INTERNAL MUTATIONS
// =============================================================================

describe("users.upsertFromClerk", () => {
  it("creates new user with USER role", async () => {
    const t = convexTest(schema, modules)

    // Minimal mock of Clerk UserJSON - only fields used by upsertFromClerk
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const clerkData: any = {
      id: "clerk_user_123",
      first_name: "John",
      last_name: "Doe",
      email_addresses: [{ email_address: "john@example.com" }],
      image_url: "https://example.com/avatar.jpg",
    }

    await t.mutation(internal.users.upsertFromClerk, { data: clerkData })

    const users = await t.query(api.users.list, {})
    expect(users).toHaveLength(1)
    expect(users[0].name).toBe("John Doe")
    expect(users[0].email).toBe("john@example.com")
    expect(users[0].role).toBe("USER")
    expect(users[0].externalId).toBe("clerk_user_123")
  })

  it("updates existing user without changing role", async () => {
    const t = convexTest(schema, modules)

    // Create admin user first
    const adminId = await t.run(async (ctx) => {
      return await ctx.db.insert("users", {
        externalId: "clerk_admin_456",
        tokenIdentifier: "test|clerk_admin_456",
        name: "Admin User",
        email: "admin@example.com",
        image: "https://example.com/old.jpg",
        role: "ADMIN",
      })
    })

    // Upsert with updated data from Clerk
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const clerkData: any = {
      id: "clerk_admin_456",
      first_name: "Updated",
      last_name: "Admin",
      email_addresses: [{ email_address: "new-admin@example.com" }],
      image_url: "https://example.com/new.jpg",
    }

    await t.mutation(internal.users.upsertFromClerk, { data: clerkData })

    const user = await t.query(api.users.getById, { id: adminId })
    expect(user?.name).toBe("Updated Admin")
    expect(user?.email).toBe("new-admin@example.com")
    expect(user?.role).toBe("ADMIN") // Role should not change
  })
})

describe("users.createUser", () => {
  it("creates user with USER role", async () => {
    const t = convexTest(schema, modules)

    await t.mutation(internal.users.createUser, {
      name: "New User",
      email: "new@example.com",
      image: "https://example.com/avatar.jpg",
      externalId: "ext_123",
      tokenIdentifier: "token_123",
    })

    const users = await t.query(api.users.list, {})
    expect(users).toHaveLength(1)
    expect(users[0].name).toBe("New User")
    expect(users[0].role).toBe("USER")
  })
})

describe("users.deleteFromClerk", () => {
  it("deletes user by clerkUserId", async () => {
    const t = convexTest(schema, modules)

    await t.run(async (ctx) => {
      await ctx.db.insert("users", {
        externalId: "clerk_delete_test",
        tokenIdentifier: "test|clerk_delete_test",
        name: "To Delete",
        email: "delete@example.com",
        image: "https://example.com/avatar.jpg",
        role: "USER",
      })
    })

    // Verify user exists
    let users = await t.query(api.users.list, {})
    expect(users).toHaveLength(1)

    // Delete user
    await t.mutation(internal.users.deleteFromClerk, {
      clerkUserId: "clerk_delete_test",
    })

    // Verify user deleted
    users = await t.query(api.users.list, {})
    expect(users).toHaveLength(0)
  })

  it("handles non-existent user gracefully", async () => {
    const t = convexTest(schema, modules)

    // Should not throw
    await t.mutation(internal.users.deleteFromClerk, {
      clerkUserId: "non_existent_user",
    })
  })
})

// =============================================================================
// INTERNAL QUERIES
// =============================================================================

describe("users.getUserByTokenIdentifier", () => {
  it("returns user by token identifier", async () => {
    const t = convexTest(schema, modules)

    const tokenIdentifier = "https://clerk.example.com|get_by_token_test"
    await t.run(async (ctx) => {
      return await createTestUser(ctx, {
        tokenIdentifier,
        name: "Token User",
      })
    })

    const user = await t.query(internal.users.getUserByTokenIdentifier, {
      tokenIdentifier,
    })

    expect(user).not.toBeNull()
    expect(user?.name).toBe("Token User")
  })

  it("returns null for unknown token", async () => {
    const t = convexTest(schema, modules)

    const user = await t.query(internal.users.getUserByTokenIdentifier, {
      tokenIdentifier: "unknown_token",
    })

    expect(user).toBeNull()
  })
})

describe("users.updateUserAvatar", () => {
  it("updates user avatar", async () => {
    const t = convexTest(schema, modules)

    const userId = await t.run(async (ctx) => {
      return await createTestUser(ctx, { name: "Avatar User" })
    })

    await t.mutation(internal.users.updateUserAvatar, {
      userId,
      avatarUrl: "https://cdn.example.com/new-avatar.jpg",
      avatarStoragePath: "avatars/user123/avatar.jpg",
    })

    const user = await t.query(api.users.getById, { id: userId })
    expect(user?.image).toBe("https://cdn.example.com/new-avatar.jpg")
    expect(user?.avatarStoragePath).toBe("avatars/user123/avatar.jpg")
  })

  it("returns old storage path for cleanup", async () => {
    const t = convexTest(schema, modules)

    const userId = await t.run(async (ctx) => {
      const id = await createTestUser(ctx, { name: "Avatar User" })
      await ctx.db.patch(id, {
        avatarStoragePath: "avatars/old-path.jpg",
      })
      return id
    })

    const result = await t.mutation(internal.users.updateUserAvatar, {
      userId,
      avatarUrl: "https://cdn.example.com/new-avatar.jpg",
      avatarStoragePath: "avatars/new-path.jpg",
    })

    expect(result.oldStoragePath).toBe("avatars/old-path.jpg")
  })

  it("throws when user not found", async () => {
    const t = convexTest(schema, modules)

    const userId = await t.run(async (ctx) => {
      return await createTestUser(ctx)
    })

    await t.run(async (ctx) => {
      await ctx.db.delete(userId)
    })

    await expect(
      t.mutation(internal.users.updateUserAvatar, {
        userId,
        avatarUrl: "https://cdn.example.com/avatar.jpg",
        avatarStoragePath: "avatars/path.jpg",
      })
    ).rejects.toThrow("User not found")
  })
})
