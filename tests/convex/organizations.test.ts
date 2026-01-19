/// <reference types="vite/client" />
/**
 * Organizations Module Tests
 *
 * Tests for organization-related queries and mutations.
 * Uses convex-test with edge-runtime environment.
 */

import { convexTest } from "convex-test"
import { describe, expect, it } from "vitest"

import { api, internal } from "../../convex/_generated/api"
import schema from "../../convex/schema"
import {
  createTestUser,
  createTestAdmin,
  createTestOrganization,
  createTestOrganizationMember,
} from "./helpers/factories"

const modules = import.meta.glob("../../convex/**/*.ts")

// =============================================================================
// QUERIES
// =============================================================================

describe("organizations.getById", () => {
  it("returns organization by ID", async () => {
    const t = convexTest(schema, modules)

    const userId = await t.run(async (ctx) => {
      return await createTestUser(ctx)
    })

    const orgId = await t.run(async (ctx) => {
      return await createTestOrganization(ctx, userId, { name: "Test Org" })
    })

    const org = await t.query(api.organizations.getById, { id: orgId })

    expect(org).not.toBeNull()
    expect(org?.name).toBe("Test Org")
  })

  it("returns null for non-existent organization", async () => {
    const t = convexTest(schema, modules)

    const userId = await t.run(async (ctx) => {
      return await createTestUser(ctx)
    })

    const orgId = await t.run(async (ctx) => {
      return await createTestOrganization(ctx, userId)
    })

    await t.run(async (ctx) => {
      await ctx.db.delete(orgId)
    })

    const org = await t.query(api.organizations.getById, { id: orgId })
    expect(org).toBeNull()
  })
})

describe("organizations.list", () => {
  it("returns all organizations", async () => {
    const t = convexTest(schema, modules)

    const userId = await t.run(async (ctx) => {
      return await createTestUser(ctx)
    })

    await t.run(async (ctx) => {
      await createTestOrganization(ctx, userId, { name: "Org 1" })
      await createTestOrganization(ctx, userId, { name: "Org 2" })
      await createTestOrganization(ctx, userId, { name: "Org 3" })
    })

    const orgs = await t.query(api.organizations.list, {})

    expect(orgs).toHaveLength(3)
  })

})

describe("organizations.getByOwnerId", () => {
  it("returns organizations owned by user", async () => {
    const t = convexTest(schema, modules)

    const user1 = await t.run(async (ctx) => {
      return await createTestUser(ctx)
    })

    const user2 = await t.run(async (ctx) => {
      return await createTestUser(ctx)
    })

    await t.run(async (ctx) => {
      await createTestOrganization(ctx, user1, { name: "User1 Org 1" })
      await createTestOrganization(ctx, user1, { name: "User1 Org 2" })
      await createTestOrganization(ctx, user2, { name: "User2 Org" })
    })

    const user1Orgs = await t.query(api.organizations.getByOwnerId, {
      ownerId: user1,
    })
    const user2Orgs = await t.query(api.organizations.getByOwnerId, {
      ownerId: user2,
    })

    expect(user1Orgs).toHaveLength(2)
    expect(user2Orgs).toHaveLength(1)
  })
})

describe("organizations.searchByName", () => {
  it("searches organizations by name", async () => {
    const t = convexTest(schema, modules)

    const userId = await t.run(async (ctx) => {
      return await createTestUser(ctx)
    })

    await t.run(async (ctx) => {
      await createTestOrganization(ctx, userId, { name: "ABC Company" })
      await createTestOrganization(ctx, userId, { name: "XYZ Corp" })
      await createTestOrganization(ctx, userId, { name: "ABC Industries" })
    })

    const results = await t.query(api.organizations.searchByName, {
      name: "ABC",
    })

    expect(results).toHaveLength(2)
  })

  it("returns all when searchTerm is empty", async () => {
    const t = convexTest(schema, modules)

    const userId = await t.run(async (ctx) => {
      return await createTestUser(ctx)
    })

    await t.run(async (ctx) => {
      await createTestOrganization(ctx, userId, { name: "Org 1" })
      await createTestOrganization(ctx, userId, { name: "Org 2" })
    })

    // Empty search returns empty array (requires min 2 chars for performance)
    const results = await t.query(api.organizations.searchByName, {
      name: "",
    })

    expect(results).toHaveLength(0)
  })

  it("returns empty when name is too short", async () => {
    const t = convexTest(schema, modules)

    const userId = await t.run(async (ctx) => {
      return await createTestUser(ctx)
    })

    await t.run(async (ctx) => {
      await createTestOrganization(ctx, userId, { name: "Org 1" })
    })

    // Single character search returns empty (requires min 2 chars)
    const results = await t.query(api.organizations.searchByName, {
      name: "O",
    })

    expect(results).toHaveLength(0)
  })
})

describe("organizations.getBySector", () => {
  it("returns organizations in specific sector", async () => {
    const t = convexTest(schema, modules)

    const userId = await t.run(async (ctx) => {
      return await createTestUser(ctx)
    })

    await t.run(async (ctx) => {
      await createTestOrganization(ctx, userId, { sector: "Technology" })
      await createTestOrganization(ctx, userId, { sector: "Healthcare" })
      await createTestOrganization(ctx, userId, { sector: "Technology" })
    })

    const techOrgs = await t.query(api.organizations.getBySector, {
      sector: "Technology",
    })

    expect(techOrgs).toHaveLength(2)
  })
})

describe("organizations.getByLocation", () => {
  it("returns organizations by province", async () => {
    const t = convexTest(schema, modules)

    const userId = await t.run(async (ctx) => {
      return await createTestUser(ctx)
    })

    await t.run(async (ctx) => {
      await createTestOrganization(ctx, userId, { province: "Québec" })
      await createTestOrganization(ctx, userId, { province: "Ontario" })
      await createTestOrganization(ctx, userId, { province: "Québec" })
    })

    const quebecOrgs = await t.query(api.organizations.getByLocation, {
      province: "Québec",
    })

    expect(quebecOrgs).toHaveLength(2)
  })

  it("returns organizations by province and city", async () => {
    const t = convexTest(schema, modules)

    const userId = await t.run(async (ctx) => {
      return await createTestUser(ctx)
    })

    await t.run(async (ctx) => {
      await createTestOrganization(ctx, userId, {
        province: "Québec",
        city: "Montréal",
      })
      await createTestOrganization(ctx, userId, {
        province: "Québec",
        city: "Québec City",
      })
      await createTestOrganization(ctx, userId, {
        province: "Québec",
        city: "Montréal",
      })
    })

    const mtlOrgs = await t.query(api.organizations.getByLocation, {
      province: "Québec",
      city: "Montréal",
    })

    expect(mtlOrgs).toHaveLength(2)
  })
})

describe("organizations.getMyOrganizations", () => {
  it("returns organizations where user is member", async () => {
    const t = convexTest(schema, modules)

    const userToken = "https://clerk.example.com|my_orgs_user"
    const userId = await t.run(async (ctx) => {
      return await createTestUser(ctx, { tokenIdentifier: userToken })
    })

    const otherUser = await t.run(async (ctx) => {
      return await createTestUser(ctx)
    })

    const org1 = await t.run(async (ctx) => {
      return await createTestOrganization(ctx, userId, { name: "My Org 1" })
    })

    const org2 = await t.run(async (ctx) => {
      return await createTestOrganization(ctx, otherUser, { name: "Other Org" })
    })

    const org3 = await t.run(async (ctx) => {
      return await createTestOrganization(ctx, userId, { name: "My Org 2" })
    })

    // Add user as member
    await t.run(async (ctx) => {
      await createTestOrganizationMember(ctx, org1, userId, "OWNER")
      await createTestOrganizationMember(ctx, org2, otherUser, "OWNER")
      await createTestOrganizationMember(ctx, org3, userId, "MEMBER")
    })

    const asUser = t.withIdentity({ tokenIdentifier: userToken })
    const myOrgs = await asUser.query(api.organizations.getMyOrganizations, {})

    expect(myOrgs).toHaveLength(2)
    expect(myOrgs.map((o) => o?.name).sort()).toEqual(["My Org 1", "My Org 2"])
  })

  it("includes memberRole in response", async () => {
    const t = convexTest(schema, modules)

    const userToken = "https://clerk.example.com|role_check_user"
    const userId = await t.run(async (ctx) => {
      return await createTestUser(ctx, { tokenIdentifier: userToken })
    })

    const orgId = await t.run(async (ctx) => {
      return await createTestOrganization(ctx, userId)
    })

    await t.run(async (ctx) => {
      await createTestOrganizationMember(ctx, orgId, userId, "OWNER")
    })

    const asUser = t.withIdentity({ tokenIdentifier: userToken })
    const myOrgs = await asUser.query(api.organizations.getMyOrganizations, {})

    expect(myOrgs[0]?.memberRole).toBe("OWNER")
  })

  it("throws when not authenticated", async () => {
    const t = convexTest(schema, modules)

    await expect(
      t.query(api.organizations.getMyOrganizations, {})
    ).rejects.toThrow("Authentification requise")
  })
})

// =============================================================================
// MUTATIONS
// =============================================================================

describe("organizations.create", () => {
  it("creates organization and adds owner as member", async () => {
    const t = convexTest(schema, modules)

    const adminToken = "https://clerk.example.com|org_create_admin"
    await t.run(async (ctx) => {
      return await createTestAdmin(ctx, { tokenIdentifier: adminToken })
    })

    const userId = await t.run(async (ctx) => {
      return await createTestUser(ctx)
    })

    const asAdmin = t.withIdentity({ tokenIdentifier: adminToken })
    const orgId = await asAdmin.mutation(api.organizations.create, {
      name: "New Organization",
      ownerId: userId,
      description: "Test description",
    })

    expect(orgId).toBeDefined()

    // Verify org created
    const org = await t.query(api.organizations.getById, { id: orgId })
    expect(org?.name).toBe("New Organization")
    expect(org?.ownerId).toEqual(userId)

    // Verify owner is added as OWNER member
    const members = await t.run(async (ctx) => {
      return await ctx.db
        .query("organizationMembers")
        .withIndex("by_organizationId", (q) => q.eq("organizationId", orgId))
        .collect()
    })

    expect(members).toHaveLength(1)
    expect(members[0].userId).toEqual(userId)
    expect(members[0].role).toBe("OWNER")
  })

  it("requires admin authentication", async () => {
    const t = convexTest(schema, modules)

    const userId = await t.run(async (ctx) => {
      return await createTestUser(ctx)
    })

    await expect(
      t.mutation(api.organizations.create, {
        name: "Test Org",
        ownerId: userId,
      })
    ).rejects.toThrow("Authentification requise")
  })
})

describe("organizations.update", () => {
  it("updates organization fields", async () => {
    const t = convexTest(schema, modules)

    const adminToken = "https://clerk.example.com|org_update_admin"
    await t.run(async (ctx) => {
      return await createTestAdmin(ctx, { tokenIdentifier: adminToken })
    })

    const userId = await t.run(async (ctx) => {
      return await createTestUser(ctx)
    })

    const orgId = await t.run(async (ctx) => {
      return await createTestOrganization(ctx, userId, { name: "Old Name" })
    })

    const asAdmin = t.withIdentity({ tokenIdentifier: adminToken })
    await asAdmin.mutation(api.organizations.update, {
      id: orgId,
      name: "New Name",
      description: "Updated description",
      sector: "Technology",
    })

    const org = await t.query(api.organizations.getById, { id: orgId })

    expect(org?.name).toBe("New Name")
    expect(org?.description).toBe("Updated description")
    expect(org?.sector).toBe("Technology")
  })
})

describe("organizations.remove", () => {
  it("deletes organization and all members", async () => {
    const t = convexTest(schema, modules)

    const adminToken = "https://clerk.example.com|org_remove_admin"
    await t.run(async (ctx) => {
      return await createTestAdmin(ctx, { tokenIdentifier: adminToken })
    })

    const userId = await t.run(async (ctx) => {
      return await createTestUser(ctx)
    })

    const orgId = await t.run(async (ctx) => {
      return await createTestOrganization(ctx, userId)
    })

    await t.run(async (ctx) => {
      await createTestOrganizationMember(ctx, orgId, userId, "OWNER")
    })

    const asAdmin = t.withIdentity({ tokenIdentifier: adminToken })
    await asAdmin.mutation(api.organizations.remove, { id: orgId })

    // Verify org deleted
    const org = await t.query(api.organizations.getById, { id: orgId })
    expect(org).toBeNull()

    // Verify members deleted
    const members = await t.run(async (ctx) => {
      return await ctx.db
        .query("organizationMembers")
        .withIndex("by_organizationId", (q) => q.eq("organizationId", orgId))
        .collect()
    })
    expect(members).toHaveLength(0)
  })

  it("returns logoStoragePath for cleanup", async () => {
    const t = convexTest(schema, modules)

    const adminToken = "https://clerk.example.com|org_logo_admin"
    await t.run(async (ctx) => {
      return await createTestAdmin(ctx, { tokenIdentifier: adminToken })
    })

    const userId = await t.run(async (ctx) => {
      return await createTestUser(ctx)
    })

    const orgId = await t.run(async (ctx) => {
      const id = await createTestOrganization(ctx, userId)
      await ctx.db.patch(id, {
        logo: "https://cdn.example.com/logo.jpg",
        logoStoragePath: "organizations/test/logo.jpg",
      })
      return id
    })

    const asAdmin = t.withIdentity({ tokenIdentifier: adminToken })
    const result = await asAdmin.mutation(api.organizations.remove, { id: orgId })

    expect(result.logoStoragePath).toBe("organizations/test/logo.jpg")
  })

  it("throws when organization not found", async () => {
    const t = convexTest(schema, modules)

    const adminToken = "https://clerk.example.com|org_remove_notfound"
    await t.run(async (ctx) => {
      return await createTestAdmin(ctx, { tokenIdentifier: adminToken })
    })

    const userId = await t.run(async (ctx) => {
      return await createTestUser(ctx)
    })

    const orgId = await t.run(async (ctx) => {
      return await createTestOrganization(ctx, userId)
    })

    await t.run(async (ctx) => {
      await ctx.db.delete(orgId)
    })

    const asAdmin = t.withIdentity({ tokenIdentifier: adminToken })
    await expect(
      asAdmin.mutation(api.organizations.remove, { id: orgId })
    ).rejects.toThrow("Organisation non trouvée")
  })
})

describe("organizations.update error cases", () => {
  it("throws when organization not found", async () => {
    const t = convexTest(schema, modules)

    const adminToken = "https://clerk.example.com|org_update_notfound"
    await t.run(async (ctx) => {
      return await createTestAdmin(ctx, { tokenIdentifier: adminToken })
    })

    const userId = await t.run(async (ctx) => {
      return await createTestUser(ctx)
    })

    const orgId = await t.run(async (ctx) => {
      return await createTestOrganization(ctx, userId)
    })

    await t.run(async (ctx) => {
      await ctx.db.delete(orgId)
    })

    const asAdmin = t.withIdentity({ tokenIdentifier: adminToken })
    await expect(
      asAdmin.mutation(api.organizations.update, {
        id: orgId,
        name: "New Name",
      })
    ).rejects.toThrow("Organisation non trouvée")
  })
})

// =============================================================================
// INTERNAL MUTATIONS
// =============================================================================

describe("organizations.updateLogoInternal", () => {
  it("updates organization logo", async () => {
    const t = convexTest(schema, modules)

    const userId = await t.run(async (ctx) => {
      return await createTestUser(ctx)
    })

    const orgId = await t.run(async (ctx) => {
      return await createTestOrganization(ctx, userId)
    })

    await t.mutation(internal.organizations.updateLogoInternal, {
      id: orgId,
      logo: "https://cdn.example.com/new-logo.jpg",
      logoStoragePath: "organizations/test/new-logo.jpg",
    })

    const org = await t.query(api.organizations.getById, { id: orgId })
    expect(org?.logo).toBe("https://cdn.example.com/new-logo.jpg")
    expect(org?.logoStoragePath).toBe("organizations/test/new-logo.jpg")
  })

  it("returns old storage path for cleanup", async () => {
    const t = convexTest(schema, modules)

    const userId = await t.run(async (ctx) => {
      return await createTestUser(ctx)
    })

    const orgId = await t.run(async (ctx) => {
      const id = await createTestOrganization(ctx, userId)
      await ctx.db.patch(id, {
        logoStoragePath: "organizations/old-logo.jpg",
      })
      return id
    })

    const result = await t.mutation(internal.organizations.updateLogoInternal, {
      id: orgId,
      logo: "https://cdn.example.com/new-logo.jpg",
      logoStoragePath: "organizations/new-logo.jpg",
    })

    expect(result.oldLogoStoragePath).toBe("organizations/old-logo.jpg")
  })

  it("throws when organization not found", async () => {
    const t = convexTest(schema, modules)

    const userId = await t.run(async (ctx) => {
      return await createTestUser(ctx)
    })

    const orgId = await t.run(async (ctx) => {
      return await createTestOrganization(ctx, userId)
    })

    await t.run(async (ctx) => {
      await ctx.db.delete(orgId)
    })

    await expect(
      t.mutation(internal.organizations.updateLogoInternal, {
        id: orgId,
        logo: "https://cdn.example.com/logo.jpg",
        logoStoragePath: "organizations/logo.jpg",
      })
    ).rejects.toThrow("Organisation non trouvée")
  })
})
