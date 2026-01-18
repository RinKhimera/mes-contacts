import type { WebhookEvent } from "@clerk/backend"
import { httpRouter } from "convex/server"
import { Webhook } from "svix"
import { internal } from "./_generated/api"
import { httpAction } from "./_generated/server"
import {
  deleteFromBunny,
  generateAvatarPath,
  generateOrgLogoPath,
  generatePostImagePath,
  getExtensionFromMimeType,
  uploadToBunny,
  validateImageFile,
} from "./lib/bunny"

const http = httpRouter()

// ============================================
// CORS HELPERS
// ============================================

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
}

const jsonResponseHeaders = {
  "Content-Type": "application/json",
  ...corsHeaders,
}

const jsonResponse = (data: object, status: number = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: jsonResponseHeaders,
  })

http.route({
  path: "/clerk",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const event = await validateRequest(request)
    if (!event) {
      return new Response("Error occured while calling webhook", {
        status: 400,
      })
    }
    switch (event.type) {
      case "user.created":
        await ctx.runMutation(internal.users.createUser, {
          externalId: event.data.id,
          tokenIdentifier: `${process.env.NEXT_PUBLIC_CLERK_FRONTEND_API_URL}|${event.data.id}`,
          name: `${event.data.first_name ?? "Guest"} ${event.data.last_name ?? ""}`,
          email: event.data.email_addresses[0]?.email_address,
          image: event.data.image_url,
        })
        break

      case "user.updated":
        await ctx.runMutation(internal.users.upsertFromClerk, {
          data: event.data,
        })
        break

      case "user.deleted": {
        const clerkUserId = event.data.id!
        await ctx.runMutation(internal.users.deleteFromClerk, { clerkUserId })
        break
      }

      default:
        console.log("Ignored Clerk webhook event", event.type)
    }

    return new Response(null, { status: 200 })
  }),
})

async function validateRequest(req: Request): Promise<WebhookEvent | null> {
  const payloadString = await req.text()
  const svixHeaders = {
    "svix-id": req.headers.get("svix-id")!,
    "svix-timestamp": req.headers.get("svix-timestamp")!,
    "svix-signature": req.headers.get("svix-signature")!,
  }
  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET!)
  try {
    return wh.verify(payloadString, svixHeaders) as unknown as WebhookEvent
  } catch (error) {
    console.error("Error verifying webhook event", error)
    return null
  }
}

// ============================================
// POST MEDIA UPLOAD ROUTES
// ============================================

// OPTIONS preflight for post-media
http.route({
  path: "/api/upload/post-media",
  method: "OPTIONS",
  handler: httpAction(async () => {
    return new Response(null, { status: 204, headers: corsHeaders })
  }),
})

/**
 * Upload post media (Admin only)
 * POST /api/upload/post-media
 * Body: FormData with "file", "postId", "imageIndex" (optional)
 */
http.route({
  path: "/api/upload/post-media",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    // Verify authentication
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      return jsonResponse({ error: "Non authentifié" }, 401)
    }

    // Get user and check admin role
    const user = await ctx.runQuery(internal.users.getUserByTokenIdentifier, {
      tokenIdentifier: identity.tokenIdentifier,
    })
    if (!user || user.role !== "ADMIN") {
      return jsonResponse({ error: "Accès non autorisé" }, 403)
    }

    try {
      const formData = await request.formData()
      const file = formData.get("file") as File | null
      const postId = formData.get("postId") as string | null
      const imageIndex = parseInt(formData.get("imageIndex") as string) || 0

      if (!file) {
        return jsonResponse({ error: "Fichier manquant" }, 400)
      }

      if (!postId) {
        return jsonResponse({ error: "postId manquant" }, 400)
      }

      // Validate file
      const validationError = validateImageFile(file.type, file.size)
      if (validationError) {
        return jsonResponse({ error: validationError }, 400)
      }

      // Generate storage path
      const extension = getExtensionFromMimeType(file.type)
      const storagePath = generatePostImagePath(postId, imageIndex, extension)

      // Upload to Bunny
      const fileBuffer = await file.arrayBuffer()
      const result = await uploadToBunny(fileBuffer, storagePath)

      if (!result.success) {
        return jsonResponse({ error: result.error }, 500)
      }

      // Create media record in database
      const mediaId = await ctx.runMutation(internal.media.createFromUpload, {
        postId: postId as any, // Convex ID
        url: result.url,
        storagePath: result.storagePath,
        type: "IMAGE",
      })

      return jsonResponse({
        success: true,
        url: result.url,
        storagePath: result.storagePath,
        mediaId,
      })
    } catch (error) {
      console.error("Post media upload error:", error)
      return jsonResponse({ error: "Échec de l'upload" }, 500)
    }
  }),
})

/**
 * Delete post media (Admin only)
 * DELETE /api/upload/post-media
 * Body: JSON with "mediaId"
 */
http.route({
  path: "/api/upload/post-media",
  method: "DELETE",
  handler: httpAction(async (ctx, request) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      return jsonResponse({ error: "Non authentifié" }, 401)
    }

    // Get user and check admin role
    const user = await ctx.runQuery(internal.users.getUserByTokenIdentifier, {
      tokenIdentifier: identity.tokenIdentifier,
    })
    if (!user || user.role !== "ADMIN") {
      return jsonResponse({ error: "Accès non autorisé" }, 403)
    }

    try {
      const body = await request.json()
      const { mediaId } = body as { mediaId?: string }

      if (!mediaId) {
        return jsonResponse({ error: "mediaId manquant" }, 400)
      }

      // Delete from database and get storagePath
      const result = await ctx.runMutation(internal.media.deleteAndGetPath, {
        id: mediaId as any,
      })

      // Delete from Bunny CDN
      if (result.storagePath) {
        await deleteFromBunny(result.storagePath)
      }

      return jsonResponse({ success: true })
    } catch (error) {
      console.error("Post media delete error:", error)
      return jsonResponse({ error: "Échec de la suppression" }, 500)
    }
  }),
})

// ============================================
// ORGANIZATION LOGO UPLOAD ROUTES
// ============================================

// OPTIONS preflight for org-logo
http.route({
  path: "/api/upload/org-logo",
  method: "OPTIONS",
  handler: httpAction(async () => {
    return new Response(null, { status: 204, headers: corsHeaders })
  }),
})

/**
 * Upload organization logo (Admin only)
 * POST /api/upload/org-logo
 * Body: FormData with "file", "organizationId"
 */
http.route({
  path: "/api/upload/org-logo",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      return jsonResponse({ error: "Non authentifié" }, 401)
    }

    // Get user and check admin role
    const user = await ctx.runQuery(internal.users.getUserByTokenIdentifier, {
      tokenIdentifier: identity.tokenIdentifier,
    })
    if (!user || user.role !== "ADMIN") {
      return jsonResponse({ error: "Accès non autorisé" }, 403)
    }

    try {
      const formData = await request.formData()
      const file = formData.get("file") as File | null
      const organizationId = formData.get("organizationId") as string | null

      if (!file) {
        return jsonResponse({ error: "Fichier manquant" }, 400)
      }

      if (!organizationId) {
        return jsonResponse({ error: "organizationId manquant" }, 400)
      }

      const validationError = validateImageFile(file.type, file.size)
      if (validationError) {
        return jsonResponse({ error: validationError }, 400)
      }

      // Generate storage path
      const extension = getExtensionFromMimeType(file.type)
      const storagePath = generateOrgLogoPath(organizationId, extension)

      // Upload to Bunny
      const fileBuffer = await file.arrayBuffer()
      const result = await uploadToBunny(fileBuffer, storagePath)

      if (!result.success) {
        return jsonResponse({ error: result.error }, 500)
      }

      // Update organization and get old logo path for cleanup
      const updateResult = await ctx.runMutation(
        internal.organizations.updateLogoInternal,
        {
          id: organizationId as any,
          logo: result.url,
          logoStoragePath: result.storagePath,
        }
      )

      // Delete old logo from Bunny if exists
      if (updateResult.oldLogoStoragePath) {
        await deleteFromBunny(updateResult.oldLogoStoragePath)
      }

      return jsonResponse({
        success: true,
        url: result.url,
        storagePath: result.storagePath,
      })
    } catch (error) {
      console.error("Org logo upload error:", error)
      return jsonResponse({ error: "Échec de l'upload" }, 500)
    }
  }),
})

// ============================================
// AVATAR UPLOAD ROUTES
// ============================================

// OPTIONS preflight for avatar
http.route({
  path: "/api/upload/avatar",
  method: "OPTIONS",
  handler: httpAction(async () => {
    return new Response(null, { status: 204, headers: corsHeaders })
  }),
})

/**
 * Upload user avatar
 * POST /api/upload/avatar
 * Body: FormData with "file"
 */
http.route({
  path: "/api/upload/avatar",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      return jsonResponse({ error: "Non authentifié" }, 401)
    }

    // Get user from database
    const user = await ctx.runQuery(internal.users.getUserByTokenIdentifier, {
      tokenIdentifier: identity.tokenIdentifier,
    })
    if (!user) {
      return jsonResponse({ error: "Utilisateur non trouvé" }, 404)
    }

    try {
      const formData = await request.formData()
      const file = formData.get("file") as File | null

      if (!file) {
        return jsonResponse({ error: "Fichier manquant" }, 400)
      }

      const validationError = validateImageFile(file.type, file.size)
      if (validationError) {
        return jsonResponse({ error: validationError }, 400)
      }

      // Generate storage path
      const extension = getExtensionFromMimeType(file.type)
      const storagePath = generateAvatarPath(user._id, extension)

      // Upload to Bunny
      const fileBuffer = await file.arrayBuffer()
      const result = await uploadToBunny(fileBuffer, storagePath)

      if (!result.success) {
        return jsonResponse({ error: result.error }, 500)
      }

      // Update user profile and get old avatar path for cleanup
      const updateResult = await ctx.runMutation(
        internal.users.updateUserAvatar,
        {
          userId: user._id,
          avatarUrl: result.url,
          avatarStoragePath: result.storagePath,
        }
      )

      // Delete old avatar from Bunny if exists
      if (updateResult.oldStoragePath) {
        await deleteFromBunny(updateResult.oldStoragePath)
      }

      return jsonResponse({
        success: true,
        url: result.url,
        storagePath: result.storagePath,
      })
    } catch (error) {
      console.error("Avatar upload error:", error)
      return jsonResponse({ error: "Échec de l'upload" }, 500)
    }
  }),
})

export default http
