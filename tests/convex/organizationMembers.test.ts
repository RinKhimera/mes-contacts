/// <reference types="vite/client" />
/**
 * Organization Members Module Tests
 *
 * Tests for organization membership queries and mutations.
 * Uses convex-test with edge-runtime environment.
 */

import { convexTest } from "convex-test"
import { describe, expect, it } from "vitest"

import { api } from "../../convex/_generated/api"
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

describe("organizationMembers.getByOrganization", () => {
  it("returns members of an organization with user data", async () => {
    const t = convexTest(schema, modules)

    const user1 = await t.run(async (ctx) => {
      return await createTestUser(ctx, { name: "User 1" })
    })

    const user2 = await t.run(async (ctx) => {
      return await createTestUser(ctx, { name: "User 2" })
    })

    const orgId = await t.run(async (ctx) => {
      return await createTestOrganization(ctx, user1)
    })

    await t.run(async (ctx) => {
      await createTestOrganizationMember(ctx, orgId, user1, "OWNER")
      await createTestOrganizationMember(ctx, orgId, user2, "MEMBER")
    })

    const members = await t.query(api.organizationMembers.getByOrganization, {
      organizationId: orgId,
    })

    expect(members).toHaveLength(2)
    expect(members.map((m) => m.user?.name).sort()).toEqual(["User 1", "User 2"])
  })
})

describe("organizationMembers.getByUser", () => {
  it("returns memberships of a user with organization data", async () => {
    const t = convexTest(schema, modules)

    const userId = await t.run(async (ctx) => {
      return await createTestUser(ctx)
    })

    const otherUser = await t.run(async (ctx) => {
      return await createTestUser(ctx)
    })

    const org1 = await t.run(async (ctx) => {
      return await createTestOrganization(ctx, userId, { name: "Org 1" })
    })

    const org2 = await t.run(async (ctx) => {
      return await createTestOrganization(ctx, otherUser, { name: "Org 2" })
    })

    await t.run(async (ctx) => {
      await createTestOrganizationMember(ctx, org1, userId, "OWNER")
      await createTestOrganizationMember(ctx, org2, userId, "MEMBER")
    })

    const memberships = await t.query(api.organizationMembers.getByUser, {
      userId,
    })

    expect(memberships).toHaveLength(2)
    expect(memberships.map((m) => m.organization?.name).sort()).toEqual([
      "Org 1",
      "Org 2",
    ])
  })
})

describe("organizationMembers.isMember", () => {
  it("returns true when user is member", async () => {
    const t = convexTest(schema, modules)

    const userId = await t.run(async (ctx) => {
      return await createTestUser(ctx)
    })

    const orgId = await t.run(async (ctx) => {
      return await createTestOrganization(ctx, userId)
    })

    await t.run(async (ctx) => {
      await createTestOrganizationMember(ctx, orgId, userId, "MEMBER")
    })

    const result = await t.query(api.organizationMembers.isMember, {
      organizationId: orgId,
      userId,
    })

    expect(result).toBe(true)
  })

  it("returns false when user is not member", async () => {
    const t = convexTest(schema, modules)

    const userId = await t.run(async (ctx) => {
      return await createTestUser(ctx)
    })

    const otherUser = await t.run(async (ctx) => {
      return await createTestUser(ctx)
    })

    const orgId = await t.run(async (ctx) => {
      return await createTestOrganization(ctx, userId)
    })

    const result = await t.query(api.organizationMembers.isMember, {
      organizationId: orgId,
      userId: otherUser,
    })

    expect(result).toBe(false)
  })
})

describe("organizationMembers.getMembership", () => {
  it("returns membership record", async () => {
    const t = convexTest(schema, modules)

    const userId = await t.run(async (ctx) => {
      return await createTestUser(ctx)
    })

    const orgId = await t.run(async (ctx) => {
      return await createTestOrganization(ctx, userId)
    })

    await t.run(async (ctx) => {
      await createTestOrganizationMember(ctx, orgId, userId, "OWNER")
    })

    const membership = await t.query(api.organizationMembers.getMembership, {
      organizationId: orgId,
      userId,
    })

    expect(membership).not.toBeNull()
    expect(membership?.role).toBe("OWNER")
  })

  it("returns null when not a member", async () => {
    const t = convexTest(schema, modules)

    const userId = await t.run(async (ctx) => {
      return await createTestUser(ctx)
    })

    const otherUser = await t.run(async (ctx) => {
      return await createTestUser(ctx)
    })

    const orgId = await t.run(async (ctx) => {
      return await createTestOrganization(ctx, userId)
    })

    const membership = await t.query(api.organizationMembers.getMembership, {
      organizationId: orgId,
      userId: otherUser,
    })

    expect(membership).toBeNull()
  })
})

describe("organizationMembers.getOwners", () => {
  it("returns only OWNER members", async () => {
    const t = convexTest(schema, modules)

    const user1 = await t.run(async (ctx) => {
      return await createTestUser(ctx, { name: "Owner" })
    })

    const user2 = await t.run(async (ctx) => {
      return await createTestUser(ctx, { name: "Member" })
    })

    const orgId = await t.run(async (ctx) => {
      return await createTestOrganization(ctx, user1)
    })

    await t.run(async (ctx) => {
      await createTestOrganizationMember(ctx, orgId, user1, "OWNER")
      await createTestOrganizationMember(ctx, orgId, user2, "MEMBER")
    })

    const owners = await t.query(api.organizationMembers.getOwners, {
      organizationId: orgId,
    })

    expect(owners).toHaveLength(1)
    expect(owners[0].user?.name).toBe("Owner")
    expect(owners[0].role).toBe("OWNER")
  })
})

// =============================================================================
// MUTATIONS
// =============================================================================

describe("organizationMembers.addMember", () => {
  it("adds member to organization", async () => {
    const t = convexTest(schema, modules)

    const adminToken = "https://clerk.example.com|add_member_admin"
    await t.run(async (ctx) => {
      return await createTestAdmin(ctx, { tokenIdentifier: adminToken })
    })

    const userId = await t.run(async (ctx) => {
      return await createTestUser(ctx)
    })

    const newMember = await t.run(async (ctx) => {
      return await createTestUser(ctx)
    })

    const orgId = await t.run(async (ctx) => {
      return await createTestOrganization(ctx, userId)
    })

    const asAdmin = t.withIdentity({ tokenIdentifier: adminToken })
    const membershipId = await asAdmin.mutation(
      api.organizationMembers.addMember,
      {
        organizationId: orgId,
        userId: newMember,
        role: "MEMBER",
      }
    )

    expect(membershipId).toBeDefined()

    // Verify membership
    const membership = await t.query(api.organizationMembers.getMembership, {
      organizationId: orgId,
      userId: newMember,
    })
    expect(membership?.role).toBe("MEMBER")
  })

  it("throws when member already exists", async () => {
    const t = convexTest(schema, modules)

    const adminToken = "https://clerk.example.com|duplicate_admin"
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
      await createTestOrganizationMember(ctx, orgId, userId, "MEMBER")
    })

    const asAdmin = t.withIdentity({ tokenIdentifier: adminToken })
    await expect(
      asAdmin.mutation(api.organizationMembers.addMember, {
        organizationId: orgId,
        userId,
        role: "MEMBER",
      })
    ).rejects.toThrow("L'utilisateur est déjà membre de cette organisation")
  })

  it("throws when organization not found", async () => {
    const t = convexTest(schema, modules)

    const adminToken = "https://clerk.example.com|org_notfound_admin"
    await t.run(async (ctx) => {
      return await createTestAdmin(ctx, { tokenIdentifier: adminToken })
    })

    const userId = await t.run(async (ctx) => {
      return await createTestUser(ctx)
    })

    // Create and delete org to get valid ID format
    const orgId = await t.run(async (ctx) => {
      return await createTestOrganization(ctx, userId)
    })

    await t.run(async (ctx) => {
      await ctx.db.delete(orgId)
    })

    const asAdmin = t.withIdentity({ tokenIdentifier: adminToken })
    await expect(
      asAdmin.mutation(api.organizationMembers.addMember, {
        organizationId: orgId,
        userId,
        role: "MEMBER",
      })
    ).rejects.toThrow("Organisation non trouvée")
  })
})

describe("organizationMembers.updateRole", () => {
  it("updates member role", async () => {
    const t = convexTest(schema, modules)

    const adminToken = "https://clerk.example.com|update_role_admin"
    await t.run(async (ctx) => {
      return await createTestAdmin(ctx, { tokenIdentifier: adminToken })
    })

    const userId = await t.run(async (ctx) => {
      return await createTestUser(ctx)
    })

    const orgId = await t.run(async (ctx) => {
      return await createTestOrganization(ctx, userId)
    })

    const membershipId = await t.run(async (ctx) => {
      return await createTestOrganizationMember(ctx, orgId, userId, "MEMBER")
    })

    const asAdmin = t.withIdentity({ tokenIdentifier: adminToken })
    await asAdmin.mutation(api.organizationMembers.updateRole, {
      membershipId,
      role: "OWNER",
    })

    const membership = await t.query(api.organizationMembers.getMembership, {
      organizationId: orgId,
      userId,
    })

    expect(membership?.role).toBe("OWNER")
  })
})

describe("organizationMembers.removeMember", () => {
  it("removes member from organization", async () => {
    const t = convexTest(schema, modules)

    const adminToken = "https://clerk.example.com|remove_member_admin"
    await t.run(async (ctx) => {
      return await createTestAdmin(ctx, { tokenIdentifier: adminToken })
    })

    const owner = await t.run(async (ctx) => {
      return await createTestUser(ctx)
    })

    const member = await t.run(async (ctx) => {
      return await createTestUser(ctx)
    })

    const orgId = await t.run(async (ctx) => {
      return await createTestOrganization(ctx, owner)
    })

    await t.run(async (ctx) => {
      await createTestOrganizationMember(ctx, orgId, owner, "OWNER")
    })

    const membershipId = await t.run(async (ctx) => {
      return await createTestOrganizationMember(ctx, orgId, member, "MEMBER")
    })

    const asAdmin = t.withIdentity({ tokenIdentifier: adminToken })
    await asAdmin.mutation(api.organizationMembers.removeMember, {
      membershipId,
    })

    const result = await t.query(api.organizationMembers.isMember, {
      organizationId: orgId,
      userId: member,
    })

    expect(result).toBe(false)
  })

  it("throws when removing last OWNER", async () => {
    const t = convexTest(schema, modules)

    const adminToken = "https://clerk.example.com|last_owner_admin"
    await t.run(async (ctx) => {
      return await createTestAdmin(ctx, { tokenIdentifier: adminToken })
    })

    const owner = await t.run(async (ctx) => {
      return await createTestUser(ctx)
    })

    const orgId = await t.run(async (ctx) => {
      return await createTestOrganization(ctx, owner)
    })

    const membershipId = await t.run(async (ctx) => {
      return await createTestOrganizationMember(ctx, orgId, owner, "OWNER")
    })

    const asAdmin = t.withIdentity({ tokenIdentifier: adminToken })
    await expect(
      asAdmin.mutation(api.organizationMembers.removeMember, { membershipId })
    ).rejects.toThrow(
      "Impossible de supprimer le dernier propriétaire de l'organisation"
    )
  })
})

describe("organizationMembers.transferOwnership", () => {
  it("transfers ownership between members", async () => {
    const t = convexTest(schema, modules)

    const adminToken = "https://clerk.example.com|transfer_admin"
    await t.run(async (ctx) => {
      return await createTestAdmin(ctx, { tokenIdentifier: adminToken })
    })

    const oldOwner = await t.run(async (ctx) => {
      return await createTestUser(ctx)
    })

    const newOwner = await t.run(async (ctx) => {
      return await createTestUser(ctx)
    })

    const orgId = await t.run(async (ctx) => {
      return await createTestOrganization(ctx, oldOwner)
    })

    await t.run(async (ctx) => {
      await createTestOrganizationMember(ctx, orgId, oldOwner, "OWNER")
      await createTestOrganizationMember(ctx, orgId, newOwner, "MEMBER")
    })

    const asAdmin = t.withIdentity({ tokenIdentifier: adminToken })
    await asAdmin.mutation(api.organizationMembers.transferOwnership, {
      organizationId: orgId,
      fromUserId: oldOwner,
      toUserId: newOwner,
    })

    // Check roles are swapped
    const oldOwnerMembership = await t.query(
      api.organizationMembers.getMembership,
      {
        organizationId: orgId,
        userId: oldOwner,
      }
    )
    const newOwnerMembership = await t.query(
      api.organizationMembers.getMembership,
      {
        organizationId: orgId,
        userId: newOwner,
      }
    )

    expect(oldOwnerMembership?.role).toBe("MEMBER")
    expect(newOwnerMembership?.role).toBe("OWNER")
  })

  it("updates organization.ownerId", async () => {
    const t = convexTest(schema, modules)

    const adminToken = "https://clerk.example.com|transfer_ownerid_admin"
    await t.run(async (ctx) => {
      return await createTestAdmin(ctx, { tokenIdentifier: adminToken })
    })

    const oldOwner = await t.run(async (ctx) => {
      return await createTestUser(ctx)
    })

    const newOwner = await t.run(async (ctx) => {
      return await createTestUser(ctx)
    })

    const orgId = await t.run(async (ctx) => {
      return await createTestOrganization(ctx, oldOwner)
    })

    await t.run(async (ctx) => {
      await createTestOrganizationMember(ctx, orgId, oldOwner, "OWNER")
      await createTestOrganizationMember(ctx, orgId, newOwner, "MEMBER")
    })

    const asAdmin = t.withIdentity({ tokenIdentifier: adminToken })
    await asAdmin.mutation(api.organizationMembers.transferOwnership, {
      organizationId: orgId,
      fromUserId: oldOwner,
      toUserId: newOwner,
    })

    const org = await t.query(api.organizations.getById, { id: orgId })
    expect(org?.ownerId).toEqual(newOwner)
  })

  it("throws when fromUser is not owner", async () => {
    const t = convexTest(schema, modules)

    const adminToken = "https://clerk.example.com|not_owner_admin"
    await t.run(async (ctx) => {
      return await createTestAdmin(ctx, { tokenIdentifier: adminToken })
    })

    const owner = await t.run(async (ctx) => {
      return await createTestUser(ctx)
    })

    const member = await t.run(async (ctx) => {
      return await createTestUser(ctx)
    })

    const orgId = await t.run(async (ctx) => {
      return await createTestOrganization(ctx, owner)
    })

    await t.run(async (ctx) => {
      await createTestOrganizationMember(ctx, orgId, owner, "OWNER")
      await createTestOrganizationMember(ctx, orgId, member, "MEMBER")
    })

    const asAdmin = t.withIdentity({ tokenIdentifier: adminToken })
    await expect(
      asAdmin.mutation(api.organizationMembers.transferOwnership, {
        organizationId: orgId,
        fromUserId: member, // Not an owner
        toUserId: owner,
      })
    ).rejects.toThrow("L'utilisateur source n'est pas propriétaire")
  })
})
