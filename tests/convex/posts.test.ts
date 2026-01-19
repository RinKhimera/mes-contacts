/// <reference types="vite/client" />
/**
 * Convex Posts Backend Tests
 *
 * Tests for Convex queries and mutations.
 * Uses convex-test with edge-runtime environment.
 */

import { convexTest } from "convex-test"
import { describe, expect, it } from "vitest"

import { api } from "../../convex/_generated/api"
import schema from "../../convex/schema"

const modules = import.meta.glob("../../convex/**/*.ts")

describe("posts", () => {
  describe("list", () => {
    it("returns published posts", async () => {
      const t = convexTest(schema, modules)

      // Create a test user (all required fields per schema)
      const userId = await t.run(async (ctx) => {
        return await ctx.db.insert("users", {
          name: "Test User",
          email: "test@example.com",
          image: "https://example.com/avatar.jpg",
          tokenIdentifier: "https://clerk.example.com|test_123",
          role: "ADMIN",
        })
      })

      // Create a published post (all required fields per schema)
      await t.run(async (ctx) => {
        return await ctx.db.insert("posts", {
          userId,
          createdBy: userId,
          category: "Services",
          businessName: "Test Business",
          phone: "(514) 555-1234",
          email: "business@example.com",
          address: "123 Rue Test",
          province: "Québec",
          city: "Montréal",
          postalCode: "H2X 1Y4",
          status: "PUBLISHED",
        })
      })

      // Query published posts
      const posts = await t.query(api.posts.list, { status: "PUBLISHED" })

      expect(posts).toHaveLength(1)
      expect(posts[0].businessName).toBe("Test Business")
      expect(posts[0].status).toBe("PUBLISHED")
    })
  })
})
