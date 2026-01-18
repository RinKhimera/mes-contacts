"use client"

import { useAuth } from "@clerk/nextjs"
import { useState, useCallback } from "react"

type UploadEndpoint = "post-media" | "org-logo" | "avatar"

interface UploadResult {
  success: boolean
  url?: string
  storagePath?: string
  mediaId?: string
  error?: string
}

interface UploadOptions {
  onSuccess?: (result: UploadResult) => void
  onError?: (error: string) => void
}

/**
 * Hook pour gérer les uploads vers Bunny CDN via les HTTP actions Convex
 */
export function useBunnyUpload(options: UploadOptions = {}) {
  const { getToken } = useAuth()
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Get Convex site URL (convert .cloud to .site for HTTP routes)
  const getConvexSiteUrl = () => {
    const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL
    if (!convexUrl) {
      throw new Error("NEXT_PUBLIC_CONVEX_URL is not configured")
    }
    return convexUrl.replace(".cloud", ".site")
  }

  /**
   * Upload une image pour un post
   */
  const uploadPostMedia = useCallback(
    async (file: File, postId: string, imageIndex: number = 0): Promise<UploadResult> => {
      setIsUploading(true)
      setError(null)

      try {
        const token = await getToken({ template: "convex" })
        if (!token) {
          throw new Error("Non authentifié")
        }

        const formData = new FormData()
        formData.append("file", file)
        formData.append("postId", postId)
        formData.append("imageIndex", imageIndex.toString())

        const response = await fetch(`${getConvexSiteUrl()}/api/upload/post-media`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        })

        const result = await response.json()

        if (!response.ok) {
          const errorMsg = result.error || "Échec de l'upload"
          setError(errorMsg)
          options.onError?.(errorMsg)
          return { success: false, error: errorMsg }
        }

        options.onSuccess?.(result)
        return result
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : "Erreur inconnue"
        setError(errorMsg)
        options.onError?.(errorMsg)
        return { success: false, error: errorMsg }
      } finally {
        setIsUploading(false)
      }
    },
    [getToken, options]
  )

  /**
   * Supprime une image d'un post
   */
  const deletePostMedia = useCallback(
    async (mediaId: string): Promise<{ success: boolean; error?: string }> => {
      setIsUploading(true)
      setError(null)

      try {
        const token = await getToken({ template: "convex" })
        if (!token) {
          throw new Error("Non authentifié")
        }

        const response = await fetch(`${getConvexSiteUrl()}/api/upload/post-media`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ mediaId }),
        })

        const result = await response.json()

        if (!response.ok) {
          const errorMsg = result.error || "Échec de la suppression"
          setError(errorMsg)
          return { success: false, error: errorMsg }
        }

        return { success: true }
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : "Erreur inconnue"
        setError(errorMsg)
        return { success: false, error: errorMsg }
      } finally {
        setIsUploading(false)
      }
    },
    [getToken]
  )

  /**
   * Upload un logo d'organisation
   */
  const uploadOrgLogo = useCallback(
    async (file: File, organizationId: string): Promise<UploadResult> => {
      setIsUploading(true)
      setError(null)

      try {
        const token = await getToken({ template: "convex" })
        if (!token) {
          throw new Error("Non authentifié")
        }

        const formData = new FormData()
        formData.append("file", file)
        formData.append("organizationId", organizationId)

        const response = await fetch(`${getConvexSiteUrl()}/api/upload/org-logo`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        })

        const result = await response.json()

        if (!response.ok) {
          const errorMsg = result.error || "Échec de l'upload"
          setError(errorMsg)
          options.onError?.(errorMsg)
          return { success: false, error: errorMsg }
        }

        options.onSuccess?.(result)
        return result
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : "Erreur inconnue"
        setError(errorMsg)
        options.onError?.(errorMsg)
        return { success: false, error: errorMsg }
      } finally {
        setIsUploading(false)
      }
    },
    [getToken, options]
  )

  /**
   * Upload un avatar utilisateur
   */
  const uploadAvatar = useCallback(
    async (file: File): Promise<UploadResult> => {
      setIsUploading(true)
      setError(null)

      try {
        const token = await getToken({ template: "convex" })
        if (!token) {
          throw new Error("Non authentifié")
        }

        const formData = new FormData()
        formData.append("file", file)

        const response = await fetch(`${getConvexSiteUrl()}/api/upload/avatar`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        })

        const result = await response.json()

        if (!response.ok) {
          const errorMsg = result.error || "Échec de l'upload"
          setError(errorMsg)
          options.onError?.(errorMsg)
          return { success: false, error: errorMsg }
        }

        options.onSuccess?.(result)
        return result
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : "Erreur inconnue"
        setError(errorMsg)
        options.onError?.(errorMsg)
        return { success: false, error: errorMsg }
      } finally {
        setIsUploading(false)
      }
    },
    [getToken, options]
  )

  return {
    isUploading,
    error,
    uploadPostMedia,
    deletePostMedia,
    uploadOrgLogo,
    uploadAvatar,
  }
}
