import { z } from "zod"

export const postSchema = z.object({
  name: z.string().min(2).max(50),
  phone: z.string().min(10).max(15),
  email: z.string().email().optional(),
  website: z.string().url().optional(),
  // title: z.string().min(2).max(100),
  description: z.string().min(2).max(500),
  address: z.string().min(2).max(100),
  city: z.string().min(2).max(50),
  province: z.string().min(2).max(50),
  postalCode: z.string().min(2).max(10),
  category: z.string().min(2).max(50),
  // subcategory: z.string().min(2).max(50),
  services: z.array(z.string().min(2).max(50)).optional(),
})
