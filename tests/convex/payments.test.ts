/// <reference types="vite/client" />
/**
 * Payments Module Tests
 *
 * Tests for payment-related queries and mutations in convex/payments.ts
 * Uses convex-test with edge-runtime environment.
 */

import { convexTest } from "convex-test"
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest"

import { api } from "../../convex/_generated/api"
import schema from "../../convex/schema"
import {
  createTestUser,
  createTestAdmin,
  createTestPost,
  createTestPayment,
} from "./helpers/factories"

const modules = import.meta.glob("../../convex/**/*.ts")

describe("payments.record", () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date("2024-06-15T12:00:00Z"))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it("creates payment and publishes post with correct expiresAt", async () => {
    const t = convexTest(schema, modules)

    const adminToken = "https://clerk.example.com|payment_admin"
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
    const paymentId = await asAdmin.mutation(api.payments.record, {
      postId,
      amount: 5000, // 50.00 CAD
      method: "E_TRANSFER",
      durationDays: 30,
    })

    expect(paymentId).toBeDefined()

    // Verify payment was created
    const payment = await t.query(api.payments.getById, { id: paymentId })
    expect(payment?.amount).toBe(5000)
    expect(payment?.method).toBe("E_TRANSFER")
    expect(payment?.status).toBe("COMPLETED")
    expect(payment?.durationDays).toBe(30)

    // Verify post was published with correct expiresAt
    const post = await t.query(api.posts.getById, { id: postId })
    expect(post?.status).toBe("PUBLISHED")
    expect(post?.publishedAt).toBeDefined()
    // 30 days from now
    const expectedExpires = Date.now() + 30 * 24 * 60 * 60 * 1000
    expect(post?.expiresAt).toBe(expectedExpires)
  })

  it("throws validation error for invalid post ID format", async () => {
    const t = convexTest(schema, modules)

    const adminToken = "https://clerk.example.com|payment_admin_notfound"
    await t.run(async (ctx) => {
      return await createTestAdmin(ctx, { tokenIdentifier: adminToken })
    })

    const asAdmin = t.withIdentity({ tokenIdentifier: adminToken })

    // Convex validates ID format before handler executes
    const fakePostId = "invalid_id_format" as never

    await expect(
      asAdmin.mutation(api.payments.record, {
        postId: fakePostId,
        amount: 5000,
        method: "CASH",
        durationDays: 30,
      })
    ).rejects.toThrow("Validator error")
  })

  it("requires admin authentication", async () => {
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

    // Try without auth
    await expect(
      t.mutation(api.payments.record, {
        postId,
        amount: 5000,
        method: "CASH",
        durationDays: 30,
      })
    ).rejects.toThrow("Authentification requise")
  })

  it("does not publish when autoPublish is false", async () => {
    const t = convexTest(schema, modules)

    const adminToken = "https://clerk.example.com|no_autopublish_admin"
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
    await asAdmin.mutation(api.payments.record, {
      postId,
      amount: 5000,
      method: "CASH",
      durationDays: 30,
      autoPublish: false,
    })

    // Post should still be DRAFT
    const post = await t.query(api.posts.getById, { id: postId })
    expect(post?.status).toBe("DRAFT")
  })
})

describe("payments.recordPending", () => {
  it("creates pending payment without publishing", async () => {
    const t = convexTest(schema, modules)

    const adminToken = "https://clerk.example.com|pending_admin"
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
    const paymentId = await asAdmin.mutation(api.payments.recordPending, {
      postId,
      amount: 5000,
      method: "E_TRANSFER",
      durationDays: 30,
    })

    // Payment should be PENDING
    const payment = await t.query(api.payments.getById, { id: paymentId })
    expect(payment?.status).toBe("PENDING")

    // Post should still be DRAFT
    const post = await t.query(api.posts.getById, { id: postId })
    expect(post?.status).toBe("DRAFT")
  })

  it("throws validation error for invalid post ID format", async () => {
    const t = convexTest(schema, modules)

    const adminToken = "https://clerk.example.com|pending_notfound"
    await t.run(async (ctx) => {
      return await createTestAdmin(ctx, { tokenIdentifier: adminToken })
    })

    const asAdmin = t.withIdentity({ tokenIdentifier: adminToken })
    const fakePostId = "invalid_id" as never

    await expect(
      asAdmin.mutation(api.payments.recordPending, {
        postId: fakePostId,
        amount: 5000,
        method: "CASH",
        durationDays: 30,
      })
    ).rejects.toThrow("Validator error")
  })
})

describe("payments.confirmPending", () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date("2024-06-15T12:00:00Z"))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it("confirms payment and publishes post", async () => {
    const t = convexTest(schema, modules)

    const adminToken = "https://clerk.example.com|confirm_admin"
    const adminId = await t.run(async (ctx) => {
      return await createTestAdmin(ctx, { tokenIdentifier: adminToken })
    })

    const userId = await t.run(async (ctx) => {
      return await createTestUser(ctx)
    })

    const postId = await t.run(async (ctx) => {
      return await createTestPost(ctx, adminId, { userId, status: "DRAFT" })
    })

    const paymentId = await t.run(async (ctx) => {
      return await createTestPayment(ctx, postId, adminId, { status: "PENDING" })
    })

    const asAdmin = t.withIdentity({ tokenIdentifier: adminToken })
    await asAdmin.mutation(api.payments.confirmPending, { paymentId })

    // Payment should be COMPLETED
    const payment = await t.query(api.payments.getById, { id: paymentId })
    expect(payment?.status).toBe("COMPLETED")

    // Post should be PUBLISHED
    const post = await t.query(api.posts.getById, { id: postId })
    expect(post?.status).toBe("PUBLISHED")
  })

  it("throws validation error for invalid payment ID format", async () => {
    const t = convexTest(schema, modules)

    const adminToken = "https://clerk.example.com|confirm_notfound"
    await t.run(async (ctx) => {
      return await createTestAdmin(ctx, { tokenIdentifier: adminToken })
    })

    const asAdmin = t.withIdentity({ tokenIdentifier: adminToken })
    const fakePaymentId = "invalid_payment_id" as never

    await expect(
      asAdmin.mutation(api.payments.confirmPending, { paymentId: fakePaymentId })
    ).rejects.toThrow("Validator error")
  })

  it("throws when payment is not pending", async () => {
    const t = convexTest(schema, modules)

    const adminToken = "https://clerk.example.com|confirm_completed"
    const adminId = await t.run(async (ctx) => {
      return await createTestAdmin(ctx, { tokenIdentifier: adminToken })
    })

    const userId = await t.run(async (ctx) => {
      return await createTestUser(ctx)
    })

    const postId = await t.run(async (ctx) => {
      return await createTestPost(ctx, adminId, { userId })
    })

    // Create COMPLETED payment
    const paymentId = await t.run(async (ctx) => {
      return await createTestPayment(ctx, postId, adminId, { status: "COMPLETED" })
    })

    const asAdmin = t.withIdentity({ tokenIdentifier: adminToken })
    await expect(
      asAdmin.mutation(api.payments.confirmPending, { paymentId })
    ).rejects.toThrow("Ce paiement n'est pas en attente")
  })
})

describe("payments.refund", () => {
  it("marks payment as REFUNDED and disables post", async () => {
    const t = convexTest(schema, modules)

    const adminToken = "https://clerk.example.com|refund_admin"
    const adminId = await t.run(async (ctx) => {
      return await createTestAdmin(ctx, { tokenIdentifier: adminToken })
    })

    const userId = await t.run(async (ctx) => {
      return await createTestUser(ctx)
    })

    const postId = await t.run(async (ctx) => {
      return await createTestPost(ctx, adminId, { userId, status: "PUBLISHED" })
    })

    const paymentId = await t.run(async (ctx) => {
      return await createTestPayment(ctx, postId, adminId, { status: "COMPLETED" })
    })

    const asAdmin = t.withIdentity({ tokenIdentifier: adminToken })
    await asAdmin.mutation(api.payments.refund, {
      paymentId,
      notes: "Client demande remboursement",
    })

    // Payment should be REFUNDED
    const payment = await t.query(api.payments.getById, { id: paymentId })
    expect(payment?.status).toBe("REFUNDED")
    expect(payment?.notes).toContain("[REMBOURSÉ]")

    // Post should be DISABLED
    const post = await t.query(api.posts.getById, { id: postId })
    expect(post?.status).toBe("DISABLED")
  })

  it("throws when payment not COMPLETED", async () => {
    const t = convexTest(schema, modules)

    const adminToken = "https://clerk.example.com|refund_pending"
    const adminId = await t.run(async (ctx) => {
      return await createTestAdmin(ctx, { tokenIdentifier: adminToken })
    })

    const userId = await t.run(async (ctx) => {
      return await createTestUser(ctx)
    })

    const postId = await t.run(async (ctx) => {
      return await createTestPost(ctx, adminId, { userId })
    })

    // Create PENDING payment
    const paymentId = await t.run(async (ctx) => {
      return await createTestPayment(ctx, postId, adminId, { status: "PENDING" })
    })

    const asAdmin = t.withIdentity({ tokenIdentifier: adminToken })
    await expect(
      asAdmin.mutation(api.payments.refund, { paymentId })
    ).rejects.toThrow("Seuls les paiements complétés peuvent être remboursés")
  })
})

describe("payments.renew", () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date("2024-06-15T12:00:00Z"))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it("renews EXPIRED post with new payment", async () => {
    const t = convexTest(schema, modules)

    const adminToken = "https://clerk.example.com|renew_expired"
    const adminId = await t.run(async (ctx) => {
      return await createTestAdmin(ctx, { tokenIdentifier: adminToken })
    })

    const userId = await t.run(async (ctx) => {
      return await createTestUser(ctx)
    })

    const postId = await t.run(async (ctx) => {
      return await createTestPost(ctx, adminId, { userId, status: "EXPIRED" })
    })

    const asAdmin = t.withIdentity({ tokenIdentifier: adminToken })
    const paymentId = await asAdmin.mutation(api.payments.renew, {
      postId,
      amount: 5000,
      method: "E_TRANSFER",
      durationDays: 30,
    })

    expect(paymentId).toBeDefined()

    // Payment should be COMPLETED with RENOUVELLEMENT note
    const payment = await t.query(api.payments.getById, { id: paymentId })
    expect(payment?.status).toBe("COMPLETED")
    expect(payment?.notes).toContain("[RENOUVELLEMENT]")

    // Post should be PUBLISHED
    const post = await t.query(api.posts.getById, { id: postId })
    expect(post?.status).toBe("PUBLISHED")
  })

  it("renews DISABLED post", async () => {
    const t = convexTest(schema, modules)

    const adminToken = "https://clerk.example.com|renew_disabled"
    const adminId = await t.run(async (ctx) => {
      return await createTestAdmin(ctx, { tokenIdentifier: adminToken })
    })

    const userId = await t.run(async (ctx) => {
      return await createTestUser(ctx)
    })

    const postId = await t.run(async (ctx) => {
      return await createTestPost(ctx, adminId, { userId, status: "DISABLED" })
    })

    const asAdmin = t.withIdentity({ tokenIdentifier: adminToken })
    await asAdmin.mutation(api.payments.renew, {
      postId,
      amount: 5000,
      method: "CASH",
      durationDays: 30,
    })

    // Post should be PUBLISHED
    const post = await t.query(api.posts.getById, { id: postId })
    expect(post?.status).toBe("PUBLISHED")
  })

  it("throws for PUBLISHED or DRAFT posts", async () => {
    const t = convexTest(schema, modules)

    const adminToken = "https://clerk.example.com|renew_published"
    const adminId = await t.run(async (ctx) => {
      return await createTestAdmin(ctx, { tokenIdentifier: adminToken })
    })

    const userId = await t.run(async (ctx) => {
      return await createTestUser(ctx)
    })

    const postId = await t.run(async (ctx) => {
      return await createTestPost(ctx, adminId, { userId, status: "PUBLISHED" })
    })

    const asAdmin = t.withIdentity({ tokenIdentifier: adminToken })
    await expect(
      asAdmin.mutation(api.payments.renew, {
        postId,
        amount: 5000,
        method: "CASH",
        durationDays: 30,
      })
    ).rejects.toThrow("Seuls les posts expirés ou désactivés peuvent être renouvelés")
  })
})

describe("durationDays validation", () => {
  it("throws for durationDays < 1 in record", async () => {
    const t = convexTest(schema, modules)

    const adminToken = "https://clerk.example.com|duration_record"
    const adminId = await t.run(async (ctx) => {
      return await createTestAdmin(ctx, { tokenIdentifier: adminToken })
    })

    const userId = await t.run(async (ctx) => {
      return await createTestUser(ctx)
    })

    const postId = await t.run(async (ctx) => {
      return await createTestPost(ctx, adminId, { userId })
    })

    const asAdmin = t.withIdentity({ tokenIdentifier: adminToken })
    await expect(
      asAdmin.mutation(api.payments.record, {
        postId,
        amount: 5000,
        method: "CASH",
        durationDays: 0,
      })
    ).rejects.toThrow("La durée de publication doit être d'au moins 1 jour")
  })

  it("throws for durationDays < 1 in recordPending", async () => {
    const t = convexTest(schema, modules)

    const adminToken = "https://clerk.example.com|duration_pending"
    const adminId = await t.run(async (ctx) => {
      return await createTestAdmin(ctx, { tokenIdentifier: adminToken })
    })

    const userId = await t.run(async (ctx) => {
      return await createTestUser(ctx)
    })

    const postId = await t.run(async (ctx) => {
      return await createTestPost(ctx, adminId, { userId })
    })

    const asAdmin = t.withIdentity({ tokenIdentifier: adminToken })
    await expect(
      asAdmin.mutation(api.payments.recordPending, {
        postId,
        amount: 5000,
        method: "CASH",
        durationDays: 0,
      })
    ).rejects.toThrow("La durée de publication doit être d'au moins 1 jour")
  })

  it("throws for durationDays < 1 in renew", async () => {
    const t = convexTest(schema, modules)

    const adminToken = "https://clerk.example.com|duration_renew"
    const adminId = await t.run(async (ctx) => {
      return await createTestAdmin(ctx, { tokenIdentifier: adminToken })
    })

    const userId = await t.run(async (ctx) => {
      return await createTestUser(ctx)
    })

    const postId = await t.run(async (ctx) => {
      return await createTestPost(ctx, adminId, { userId, status: "EXPIRED" })
    })

    const asAdmin = t.withIdentity({ tokenIdentifier: adminToken })
    await expect(
      asAdmin.mutation(api.payments.renew, {
        postId,
        amount: 5000,
        method: "CASH",
        durationDays: 0,
      })
    ).rejects.toThrow("La durée de publication doit être d'au moins 1 jour")
  })

  it("allows durationDays >= 1", async () => {
    const t = convexTest(schema, modules)

    const adminToken = "https://clerk.example.com|duration_valid"
    const adminId = await t.run(async (ctx) => {
      return await createTestAdmin(ctx, { tokenIdentifier: adminToken })
    })

    const userId = await t.run(async (ctx) => {
      return await createTestUser(ctx)
    })

    const postId = await t.run(async (ctx) => {
      return await createTestPost(ctx, adminId, { userId })
    })

    const asAdmin = t.withIdentity({ tokenIdentifier: adminToken })
    const paymentId = await asAdmin.mutation(api.payments.record, {
      postId,
      amount: 5000,
      method: "CASH",
      durationDays: 1,
    })

    expect(paymentId).toBeDefined()
  })
})

describe("payments.getStats", () => {
  it("calculates totalRevenue correctly in cents", async () => {
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

    // Create some payments
    await t.run(async (ctx) => {
      await createTestPayment(ctx, postId, adminId, {
        amount: 5000,
        status: "COMPLETED",
      })
      await createTestPayment(ctx, postId, adminId, {
        amount: 3000,
        status: "COMPLETED",
      })
      await createTestPayment(ctx, postId, adminId, {
        amount: 2000,
        status: "PENDING",
      })
    })

    const stats = await t.query(api.payments.getStats, {})

    expect(stats.totalCount).toBe(3)
    expect(stats.completedCount).toBe(2)
    expect(stats.pendingCount).toBe(1)
    expect(stats.totalRevenue).toBe(8000) // 5000 + 3000 (only COMPLETED)
    expect(stats.pendingAmount).toBe(2000)
  })

  it("groups by payment method", async () => {
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
      await createTestPayment(ctx, postId, adminId, {
        amount: 5000,
        method: "E_TRANSFER",
        status: "COMPLETED",
      })
      await createTestPayment(ctx, postId, adminId, {
        amount: 3000,
        method: "CASH",
        status: "COMPLETED",
      })
      await createTestPayment(ctx, postId, adminId, {
        amount: 2000,
        method: "E_TRANSFER",
        status: "COMPLETED",
      })
    })

    const stats = await t.query(api.payments.getStats, {})

    expect(stats.byMethod["E_TRANSFER"]).toBe(7000) // 5000 + 2000
    expect(stats.byMethod["CASH"]).toBe(3000)
  })
})

describe("payments.getByPost", () => {
  it("returns all payments for a post", async () => {
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
      await createTestPayment(ctx, postId, adminId, { amount: 5000 })
      await createTestPayment(ctx, postId, adminId, { amount: 3000 })
    })

    const payments = await t.query(api.payments.getByPost, { postId })

    expect(payments).toHaveLength(2)
  })
})

describe("payments.list", () => {
  it("filters by status", async () => {
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
      await createTestPayment(ctx, postId, adminId, { status: "COMPLETED" })
      await createTestPayment(ctx, postId, adminId, { status: "PENDING" })
      await createTestPayment(ctx, postId, adminId, { status: "COMPLETED" })
    })

    const completed = await t.query(api.payments.list, { status: "COMPLETED" })
    const pending = await t.query(api.payments.list, { status: "PENDING" })

    expect(completed).toHaveLength(2)
    expect(pending).toHaveLength(1)
  })

  it("filters by method", async () => {
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
      await createTestPayment(ctx, postId, adminId, { method: "E_TRANSFER" })
      await createTestPayment(ctx, postId, adminId, { method: "CASH" })
      await createTestPayment(ctx, postId, adminId, { method: "E_TRANSFER" })
    })

    const transfers = await t.query(api.payments.list, { method: "E_TRANSFER" })
    const cash = await t.query(api.payments.list, { method: "CASH" })

    expect(transfers).toHaveLength(2)
    expect(cash).toHaveLength(1)
  })
})
