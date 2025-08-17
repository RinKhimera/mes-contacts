import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"

export default defineSchema({
  users: defineTable({
    name: v.string(),
    email: v.string(),
    image: v.string(),
    tokenIdentifier: v.string(),
    externalId: v.optional(v.string()),
    role: v.union(v.literal("ADMIN"), v.literal("USER")),
  })
    .index("by_tokenIdentifier", ["tokenIdentifier"])
    .index("byExternalId", ["externalId"])
    .index("by_role", ["role"]),

  posts: defineTable({
    authorId: v.id("users"),
    businessName: v.string(),
    businessImageUrl: v.optional(v.string()),
    category: v.string(),
    description: v.optional(v.string()),
    phone: v.string(),
    email: v.string(),
    website: v.optional(v.string()),
    address: v.string(),
    city: v.string(),
    province: v.string(),
    postalCode: v.string(),
    geo: v.optional(
      v.object({
        longitude: v.number(),
        latitude: v.number(),
      }),
    ),
    status: v.union(
      v.literal("DRAFT"),
      v.literal("PUBLISHED"),
      v.literal("DISABLED"),
    ),
  })
    .index("by_authorId", ["authorId"])
    .index("by_status", ["status"])
    .index("by_category", ["category"])
    .index("by_province", ["province"])
    .index("by_city", ["city"]),
})
