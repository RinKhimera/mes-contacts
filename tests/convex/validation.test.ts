/**
 * Validation Library Tests
 *
 * Tests for pure utility functions in convex/lib/validation.ts
 */

import { describe, expect, it, vi, beforeEach, afterEach } from "vitest"

import {
  validatePostOwnership,
  toCents,
  toDollars,
  validateDurationDays,
  calculateExpiresAt,
} from "../../convex/lib/validation"
import { Id } from "../../convex/_generated/dataModel"

describe("validatePostOwnership", () => {
  const mockUserId = "user123" as Id<"users">
  const mockOrgId = "org456" as Id<"organizations">

  it("accepts userId only", () => {
    expect(() => validatePostOwnership(mockUserId, undefined)).not.toThrow()
  })

  it("accepts organizationId only", () => {
    expect(() => validatePostOwnership(undefined, mockOrgId)).not.toThrow()
  })

  it("throws when both userId and organizationId are provided", () => {
    expect(() => validatePostOwnership(mockUserId, mockOrgId)).toThrow(
      "Un post ne peut pas appartenir à un utilisateur ET une organisation en même temps"
    )
  })

  it("throws when neither userId nor organizationId is provided", () => {
    expect(() => validatePostOwnership(undefined, undefined)).toThrow(
      "Un post doit appartenir soit à un utilisateur, soit à une organisation"
    )
  })
})

describe("toCents", () => {
  it("converts whole dollars to cents correctly", () => {
    expect(toCents(50)).toBe(5000)
    expect(toCents(1)).toBe(100)
    expect(toCents(0)).toBe(0)
    expect(toCents(100)).toBe(10000)
  })

  it("handles decimal precision correctly", () => {
    expect(toCents(50.99)).toBe(5099)
    expect(toCents(0.01)).toBe(1)
    expect(toCents(0.99)).toBe(99)
    expect(toCents(123.45)).toBe(12345)
  })

  it("rounds correctly for floating point issues", () => {
    // Common floating point issue: 0.1 + 0.2 = 0.30000000000000004
    expect(toCents(0.1 + 0.2)).toBe(30)
    // Test rounding
    expect(toCents(50.995)).toBe(5100) // Rounds up
    expect(toCents(50.994)).toBe(5099) // Rounds down
  })

  it("handles negative values", () => {
    expect(toCents(-50)).toBe(-5000)
    expect(toCents(-0.99)).toBe(-99)
  })
})

describe("toDollars", () => {
  it("converts cents to dollars correctly", () => {
    expect(toDollars(5000)).toBe(50)
    expect(toDollars(100)).toBe(1)
    expect(toDollars(0)).toBe(0)
    expect(toDollars(10000)).toBe(100)
  })

  it("returns decimal values correctly", () => {
    expect(toDollars(5099)).toBe(50.99)
    expect(toDollars(1)).toBe(0.01)
    expect(toDollars(99)).toBe(0.99)
    expect(toDollars(12345)).toBe(123.45)
  })

  it("handles negative values", () => {
    expect(toDollars(-5000)).toBe(-50)
    expect(toDollars(-99)).toBe(-0.99)
  })
})

describe("calculateExpiresAt", () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date("2024-01-15T12:00:00Z"))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it("calculates expiration for 30 days", () => {
    const now = Date.now()
    const expiresAt = calculateExpiresAt(30)

    // 30 days in milliseconds
    const expectedMs = 30 * 24 * 60 * 60 * 1000
    expect(expiresAt).toBe(now + expectedMs)
  })

  it("calculates expiration for 1 day", () => {
    const now = Date.now()
    const expiresAt = calculateExpiresAt(1)

    const expectedMs = 24 * 60 * 60 * 1000
    expect(expiresAt).toBe(now + expectedMs)
  })

  it("calculates expiration for 365 days", () => {
    const now = Date.now()
    const expiresAt = calculateExpiresAt(365)

    const expectedMs = 365 * 24 * 60 * 60 * 1000
    expect(expiresAt).toBe(now + expectedMs)
  })

  it("returns timestamp in milliseconds", () => {
    const expiresAt = calculateExpiresAt(30)

    // Should be a valid timestamp (number of milliseconds since epoch)
    expect(typeof expiresAt).toBe("number")
    expect(expiresAt).toBeGreaterThan(Date.now())
    expect(new Date(expiresAt).getTime()).toBe(expiresAt)
  })

  it("handles zero days", () => {
    const now = Date.now()
    const expiresAt = calculateExpiresAt(0)

    expect(expiresAt).toBe(now)
  })
})

describe("validateDurationDays", () => {
  it("throws for durationDays < 1", () => {
    expect(() => validateDurationDays(0)).toThrow(
      "La durée de publication doit être d'au moins 1 jour"
    )
    expect(() => validateDurationDays(-1)).toThrow(
      "La durée de publication doit être d'au moins 1 jour"
    )
    expect(() => validateDurationDays(-100)).toThrow(
      "La durée de publication doit être d'au moins 1 jour"
    )
  })

  it("allows durationDays >= 1", () => {
    expect(() => validateDurationDays(1)).not.toThrow()
    expect(() => validateDurationDays(30)).not.toThrow()
    expect(() => validateDurationDays(365)).not.toThrow()
  })
})
