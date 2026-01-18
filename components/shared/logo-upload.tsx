"use client"

import { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"
import { Building2, Loader2, X, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useBunnyUpload } from "@/hooks"
import { toast } from "sonner"
import { Id } from "@/convex/_generated/dataModel"

interface LogoUploadProps {
  organizationId: Id<"organizations">
  currentLogo?: string | null
  onLogoChange?: (url: string | null) => void
  disabled?: boolean
  className?: string
}

export function LogoUpload({
  organizationId,
  currentLogo,
  onLogoChange,
  disabled = false,
  className,
}: LogoUploadProps) {
  const [logoUrl, setLogoUrl] = useState<string | null>(currentLogo || null)
  const { uploadOrgLogo, isUploading } = useBunnyUpload()

  const updateLogo = useCallback(
    (url: string | null) => {
      setLogoUrl(url)
      onLogoChange?.(url)
    },
    [onLogoChange]
  )

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0]
      if (!file) return

      const result = await uploadOrgLogo(file, organizationId)

      if (result.success && result.url) {
        updateLogo(result.url)
        toast.success("Logo mis à jour")
      } else {
        toast.error(result.error || "Échec de l'upload")
      }
    },
    [organizationId, uploadOrgLogo, updateLogo]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "image/webp": [".webp"],
    },
    maxSize: 5 * 1024 * 1024, // 5MB
    maxFiles: 1,
    disabled: disabled || isUploading,
  })

  const isDisabled = disabled || isUploading

  return (
    <div className={cn("flex flex-col items-center gap-4", className)}>
      {/* Logo Preview / Dropzone */}
      <div
        {...getRootProps()}
        className={cn(
          "relative w-32 h-32 rounded-lg border-2 border-dashed flex items-center justify-center cursor-pointer transition-all overflow-hidden",
          isDragActive && "border-primary bg-primary/5",
          isDisabled && "opacity-50 cursor-not-allowed",
          !isDisabled && !isDragActive && "border-muted-foreground/25 hover:border-primary/50"
        )}
      >
        <input {...getInputProps()} />

        {isUploading ? (
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        ) : logoUrl ? (
          <>
            <img
              src={logoUrl}
              alt="Logo organisation"
              className="w-full h-full object-cover"
            />
            {/* Overlay on hover */}
            <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
              <Upload className="h-6 w-6 text-white" />
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-2 p-4">
            <Building2 className="h-8 w-8 text-muted-foreground" />
            <span className="text-xs text-muted-foreground text-center">
              {isDragActive ? "Déposez ici" : "Ajouter un logo"}
            </span>
          </div>
        )}
      </div>

      {/* Instructions */}
      <p className="text-xs text-muted-foreground text-center max-w-[200px]">
        Cliquez ou glissez-déposez pour {logoUrl ? "changer" : "ajouter"} le logo.
        JPG, PNG ou WebP (max. 5MB)
      </p>
    </div>
  )
}
