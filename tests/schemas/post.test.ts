import { describe, expect, it } from "vitest"

import { postSchema } from "@/schemas/post"

const validPost = {
  category: "Services",
  businessName: "test business",
  phone: "514-555-1234",
  email: "contact@example.com",
  address: "123 Rue Principale",
  province: "Québec",
  city: "Montréal",
  postalCode: "H2X1Y4",
}

describe("postSchema", () => {
  describe("Valid Data", () => {
    it("validates complete valid data", () => {
      const result = postSchema.safeParse(validPost)

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.businessName).toBe("Test business")
        expect(result.data.email).toBe("contact@example.com")
      }
    })

    it("validates with optional fields", () => {
      const postWithOptional = {
        ...validPost,
        description: "description du commerce",
        website: "https://example.com",
        latitude: 45.5017,
        longitude: -73.5673,
      }

      const result = postSchema.safeParse(postWithOptional)

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.description).toBe("Description du commerce")
        expect(result.data.latitude).toBe(45.5017)
      }
    })
  })

  describe("Phone Validation", () => {
    it("formats Canadian phone numbers", () => {
      const phones = [
        { input: "514-555-1234", expected: "(514) 555-1234" },
        { input: "5145551234", expected: "(514) 555-1234" },
        { input: "+1 514 555 1234", expected: "(514) 555-1234" },
        { input: "(514) 555-1234", expected: "(514) 555-1234" },
      ]

      for (const { input, expected } of phones) {
        const result = postSchema.safeParse({ ...validPost, phone: input })
        expect(result.success).toBe(true)
        if (result.success) {
          expect(result.data.phone).toBe(expected)
        }
      }
    })

    it("rejects invalid phone numbers", () => {
      const invalidPhones = ["123", "abcdefghij", "555-CALL-ME"]

      for (const phone of invalidPhones) {
        const result = postSchema.safeParse({ ...validPost, phone })
        expect(result.success).toBe(false)
      }
    })
  })

  describe("Postal Code Validation", () => {
    it("formats postal codes with space", () => {
      const result = postSchema.safeParse({
        ...validPost,
        postalCode: "h2x1y4",
      })

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.postalCode).toBe("H2X 1Y4")
      }
    })

    it("preserves already formatted postal codes", () => {
      const result = postSchema.safeParse({
        ...validPost,
        postalCode: "H2X 1Y4",
      })

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.postalCode).toBe("H2X 1Y4")
      }
    })
  })

  describe("Business Name Transform", () => {
    it("capitalizes first letter", () => {
      const result = postSchema.safeParse({
        ...validPost,
        businessName: "acme corp",
      })

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.businessName).toBe("Acme corp")
      }
    })
  })

  describe("Required Fields", () => {
    it("rejects missing category", () => {
      const { category: _category, ...incomplete } = validPost
      const result = postSchema.safeParse(incomplete)
      expect(result.success).toBe(false)
    })

    it("rejects empty businessName", () => {
      const result = postSchema.safeParse({ ...validPost, businessName: "" })
      expect(result.success).toBe(false)
    })

    it("rejects missing email", () => {
      const { email: _email, ...incomplete } = validPost
      const result = postSchema.safeParse(incomplete)
      expect(result.success).toBe(false)
    })
  })

  describe("Email Validation", () => {
    it("rejects invalid email format", () => {
      const invalidEmails = ["not-an-email", "missing@domain", "@nodomain.com"]

      for (const email of invalidEmails) {
        const result = postSchema.safeParse({ ...validPost, email })
        expect(result.success).toBe(false)
      }
    })
  })

  describe("Website Validation", () => {
    it("accepts valid URLs", () => {
      const result = postSchema.safeParse({
        ...validPost,
        website: "https://example.com",
      })
      expect(result.success).toBe(true)
    })

    it("rejects invalid URLs", () => {
      const result = postSchema.safeParse({
        ...validPost,
        website: "not-a-url",
      })
      expect(result.success).toBe(false)
    })
  })
})
