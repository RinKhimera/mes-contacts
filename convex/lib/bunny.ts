/**
 * Bunny.net service for media upload and management
 *
 * Required environment variables (Convex Dashboard):
 * - BUNNY_STORAGE_ZONE_NAME: Storage Zone name
 * - BUNNY_STORAGE_API_KEY: Storage Zone password (AccessKey)
 * - BUNNY_CDN_HOSTNAME: Pull Zone hostname (e.g., "cdn.example.com")
 */

// ============================================
// TYPES
// ============================================

export type BunnyUploadResult = {
  success: true
  url: string
  storagePath: string
}

export type BunnyUploadError = {
  success: false
  error: string
}

export type BunnyResult = BunnyUploadResult | BunnyUploadError

export type ImageOptimizationParams = {
  width?: number
  height?: number
  quality?: number // 0-100, default 85
  crop?: "fit" | "fill" | "scale"
}

// ============================================
// CONFIGURATION
// ============================================

const getConfig = () => {
  const storageZoneName = process.env.BUNNY_STORAGE_ZONE_NAME
  const apiKey = process.env.BUNNY_STORAGE_API_KEY
  const cdnHostname = process.env.BUNNY_CDN_HOSTNAME

  if (!storageZoneName || !apiKey || !cdnHostname) {
    throw new Error(
      "Missing Bunny configuration. Check BUNNY_STORAGE_ZONE_NAME, BUNNY_STORAGE_API_KEY and BUNNY_CDN_HOSTNAME."
    )
  }

  return {
    storageZoneName,
    apiKey,
    storageHostname: "storage.bunnycdn.com",
    cdnHostname,
  }
}

// ============================================
// UPLOAD
// ============================================

/**
 * Upload a file to Bunny Storage
 *
 * @param fileData - File data as ArrayBuffer or Uint8Array
 * @param storagePath - Path in storage (e.g., "posts/abc123/photo.jpg")
 * @returns Result with CDN URL or error
 */
export const uploadToBunny = async (
  fileData: ArrayBuffer | Uint8Array,
  storagePath: string
): Promise<BunnyResult> => {
  const config = getConfig()

  const uploadUrl = `https://${config.storageHostname}/${config.storageZoneName}/${storagePath}`

  const bodyData =
    fileData instanceof Uint8Array ? fileData : new Uint8Array(fileData)

  try {
    const response = await fetch(uploadUrl, {
      method: "PUT",
      headers: {
        AccessKey: config.apiKey,
        "Content-Type": "application/octet-stream",
      },
      body: bodyData as unknown as BodyInit,
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`Bunny upload failed: ${response.status} - ${errorText}`)

      if (response.status === 401) {
        return {
          success: false,
          error: "Bunny authentication failed. Check your API key.",
        }
      }

      return {
        success: false,
        error: `Upload failed: ${response.status}`,
      }
    }

    const cdnUrl = `https://${config.cdnHostname}/${storagePath}`

    return {
      success: true,
      url: cdnUrl,
      storagePath,
    }
  } catch (error) {
    console.error("Bunny upload error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Network error",
    }
  }
}

// ============================================
// DELETE
// ============================================

/**
 * Delete a file from Bunny Storage
 *
 * @param storagePath - Path to delete (e.g., "posts/abc123/photo.jpg")
 * @returns true if deleted successfully, false otherwise
 */
export const deleteFromBunny = async (storagePath: string): Promise<boolean> => {
  const config = getConfig()

  const deleteUrl = `https://${config.storageHostname}/${config.storageZoneName}/${storagePath}`

  try {
    const response = await fetch(deleteUrl, {
      method: "DELETE",
      headers: {
        AccessKey: config.apiKey,
      },
    })

    if (!response.ok && response.status !== 404) {
      console.error(`Bunny delete failed: ${response.status}`)
      return false
    }

    // 200 = deleted, 404 = already deleted (both are OK)
    return true
  } catch (error) {
    console.error("Bunny delete error:", error)
    return false
  }
}

// ============================================
// URL HELPERS
// ============================================

/**
 * Generate an optimized CDN URL with Bunny Optimizer parameters
 */
export const getOptimizedImageUrl = (
  baseUrl: string,
  params: ImageOptimizationParams
): string => {
  const searchParams = new URLSearchParams()

  if (params.width) searchParams.set("width", params.width.toString())
  if (params.height) searchParams.set("height", params.height.toString())
  if (params.quality) searchParams.set("quality", params.quality.toString())
  if (params.crop) searchParams.set("crop", params.crop)

  const queryString = searchParams.toString()
  return queryString ? `${baseUrl}?${queryString}` : baseUrl
}

/**
 * Generate a thumbnail URL
 */
export const getThumbnailUrl = (baseUrl: string, size: number = 200): string => {
  return getOptimizedImageUrl(baseUrl, {
    width: size,
    height: size,
    crop: "fit",
    quality: 80,
  })
}

/**
 * Generate an avatar URL
 */
export const getAvatarUrl = (baseUrl: string, size: number = 128): string => {
  return getOptimizedImageUrl(baseUrl, {
    width: size,
    height: size,
    crop: "fit",
    quality: 85,
  })
}

// ============================================
// PATH HELPERS
// ============================================

/**
 * Generate a unique path for a post image
 */
export const generatePostImagePath = (
  postId: string,
  index: number,
  extension: string
): string => {
  const timestamp = Date.now()
  const cleanExt = extension.replace(/^\./, "").toLowerCase()
  return `posts/${postId}/${timestamp}-${index}.${cleanExt}`
}

/**
 * Generate a unique path for an organization logo
 */
export const generateOrgLogoPath = (
  organizationId: string,
  extension: string
): string => {
  const timestamp = Date.now()
  const cleanExt = extension.replace(/^\./, "").toLowerCase()
  return `organizations/${organizationId}/${timestamp}.${cleanExt}`
}

/**
 * Generate a unique path for a user avatar
 */
export const generateAvatarPath = (userId: string, extension: string): string => {
  const timestamp = Date.now()
  const cleanExt = extension.replace(/^\./, "").toLowerCase()
  return `avatars/${userId}/${timestamp}.${cleanExt}`
}

/**
 * Extract file extension from MIME type
 */
export const getExtensionFromMimeType = (mimeType: string): string => {
  const mimeToExt: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/gif": "gif",
  }
  return mimeToExt[mimeType] || "jpg"
}

// ============================================
// VALIDATION
// ============================================

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"]
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

/**
 * Validate an image file before upload
 *
 * @param mimeType - File MIME type
 * @param size - File size in bytes
 * @returns null if valid, error message otherwise
 */
export const validateImageFile = (
  mimeType: string,
  size: number
): string | null => {
  if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
    return "Format non supporté. Utilisez JPG, PNG ou WebP."
  }

  if (size > MAX_FILE_SIZE) {
    const maxMB = MAX_FILE_SIZE / (1024 * 1024)
    return `Fichier trop volumineux. Maximum ${maxMB}MB.`
  }

  return null
}
