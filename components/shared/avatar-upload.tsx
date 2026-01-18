"use client"

import { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"
import { User, Loader2, Camera } from "lucide-react"
import { cn } from "@/lib/utils"
import { useBunnyUpload } from "@/hooks"
import { toast } from "sonner"

interface AvatarUploadProps {
  currentAvatar?: string | null
  onAvatarChange?: (url: string) => void
  disabled?: boolean
  size?: "sm" | "md" | "lg"
  className?: string
}

const sizeClasses = {
  sm: "w-16 h-16",
  md: "w-24 h-24",
  lg: "w-32 h-32",
}

const iconSizeClasses = {
  sm: "h-6 w-6",
  md: "h-8 w-8",
  lg: "h-10 w-10",
}

export function AvatarUpload({
  currentAvatar,
  onAvatarChange,
  disabled = false,
  size = "md",
  className,
}: AvatarUploadProps) {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(currentAvatar || null)
  const { uploadAvatar, isUploading } = useBunnyUpload()

  const updateAvatar = useCallback(
    (url: string) => {
      setAvatarUrl(url)
      onAvatarChange?.(url)
    },
    [onAvatarChange]
  )

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0]
      if (!file) return

      const result = await uploadAvatar(file)

      if (result.success && result.url) {
        updateAvatar(result.url)
        toast.success("Avatar mis à jour")
      } else {
        toast.error(result.error || "Échec de l'upload")
      }
    },
    [uploadAvatar, updateAvatar]
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
    <div className={cn("flex flex-col items-center gap-3", className)}>
      {/* Avatar Preview / Dropzone */}
      <div
        {...getRootProps()}
        className={cn(
          "relative rounded-full border-2 border-dashed flex items-center justify-center cursor-pointer transition-all overflow-hidden",
          sizeClasses[size],
          isDragActive && "border-primary bg-primary/5",
          isDisabled && "opacity-50 cursor-not-allowed",
          !isDisabled && !isDragActive && "border-muted-foreground/25 hover:border-primary/50"
        )}
      >
        <input {...getInputProps()} />

        {isUploading ? (
          <Loader2 className={cn("animate-spin text-muted-foreground", iconSizeClasses[size])} />
        ) : avatarUrl ? (
          <>
            <img
              src={avatarUrl}
              alt="Avatar"
              className="w-full h-full object-cover"
            />
            {/* Camera overlay on hover */}
            <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center rounded-full">
              <Camera className="h-6 w-6 text-white" />
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center bg-muted rounded-full w-full h-full">
            <User className={cn("text-muted-foreground", iconSizeClasses[size])} />
          </div>
        )}
      </div>

      {/* Instructions */}
      <p className="text-xs text-muted-foreground text-center">
        Cliquez pour {avatarUrl ? "changer" : "ajouter"} votre avatar
      </p>
    </div>
  )
}
