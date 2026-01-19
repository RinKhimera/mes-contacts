"use client"

import Image from "next/image"
import { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"
import { ImagePlus, X, Loader2, GripVertical } from "lucide-react"
import { DndContext, closestCenter, DragEndEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core"
import { SortableContext, useSortable, rectSortingStrategy, arrayMove } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import Lightbox from "yet-another-react-lightbox"
import "yet-another-react-lightbox/styles.css"
import { useMutation } from "convex/react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useBunnyUpload } from "@/hooks"
import { toast } from "sonner"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"

interface UploadedImage {
  id?: string
  url: string
  storagePath?: string
  order: number
}

interface ImageUploadProps {
  postId: Id<"posts">
  existingImages?: UploadedImage[]
  onImagesChange?: (images: UploadedImage[]) => void
  maxImages?: number
  disabled?: boolean
}

// Sortable image item component
interface SortableImageProps {
  image: UploadedImage
  index: number
  onRemove: (index: number) => void
  onImageClick: (index: number) => void
  isUploading: boolean
}

function SortableImage({ image, index, onRemove, onImageClick, isUploading }: SortableImageProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: image.id || image.url })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "relative group aspect-square rounded-lg overflow-hidden bg-muted",
        isDragging && "opacity-50 ring-2 ring-primary"
      )}
    >
      <Image
        src={image.url}
        alt={`Image ${index + 1}`}
        fill
        className="object-cover cursor-pointer"
        sizes="(max-width: 768px) 50vw, 200px"
        onClick={() => onImageClick(index)}
      />
      {/* Order badge */}
      {index === 0 && (
        <span className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded pointer-events-none">
          Principale
        </span>
      )}
      {/* Delete button */}
      <Button
        type="button"
        variant="destructive"
        size="icon"
        className="absolute top-2 right-2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={(e) => {
          e.stopPropagation()
          onRemove(index)
        }}
        disabled={isUploading}
      >
        <X className="h-4 w-4" />
      </Button>
      {/* Drag handle */}
      <div
        {...attributes}
        {...listeners}
        className="absolute bottom-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing p-1 rounded bg-black/30 hover:bg-black/50"
      >
        <GripVertical className="h-5 w-5 text-white drop-shadow-md" />
      </div>
    </div>
  )
}

export function ImageUpload({
  postId,
  existingImages = [],
  onImagesChange,
  maxImages = 5,
  disabled = false,
}: ImageUploadProps) {
  const [images, setImages] = useState<UploadedImage[]>(existingImages)
  const [uploadingCount, setUploadingCount] = useState(0)
  const [lightboxIndex, setLightboxIndex] = useState(-1)
  const { uploadPostMedia, deletePostMedia, isUploading } = useBunnyUpload()
  const reorderMedia = useMutation(api.media.reorder)

  // DnD sensors with activation constraint to prevent accidental drags
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )

  // Track previous existingImages to detect when async data loads
  const [prevExistingImages, setPrevExistingImages] = useState(existingImages)

  // Sync during render when existingImages prop changes (React recommended pattern)
  if (existingImages.length > 0 && existingImages !== prevExistingImages) {
    setPrevExistingImages(existingImages)
    if (images.length === 0) {
      setImages(existingImages)
    }
  }

  const updateImages = useCallback(
    (newImages: UploadedImage[]) => {
      setImages(newImages)
      onImagesChange?.(newImages)
    },
    [onImagesChange]
  )

  const handleDragEnd = useCallback(
    async (event: DragEndEvent) => {
      const { active, over } = event
      if (!over || active.id === over.id) return

      const oldIndex = images.findIndex((img) => (img.id || img.url) === active.id)
      const newIndex = images.findIndex((img) => (img.id || img.url) === over.id)

      if (oldIndex === -1 || newIndex === -1) return

      const reordered = arrayMove(images, oldIndex, newIndex)
        .map((img, i) => ({ ...img, order: i }))

      // Update local state immediately for responsiveness
      updateImages(reordered)

      // Persist to database
      const mediaIds = reordered
        .filter((img) => img.id)
        .map((img) => img.id as Id<"media">)

      if (mediaIds.length > 0) {
        try {
          await reorderMedia({ postId, mediaIds })
        } catch (error) {
          console.error("Failed to reorder media:", error)
          toast.error("Erreur lors de la réorganisation")
        }
      }
    },
    [images, updateImages, reorderMedia, postId]
  )

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const remainingSlots = maxImages - images.length
      const filesToUpload = acceptedFiles.slice(0, remainingSlots)

      if (acceptedFiles.length > remainingSlots) {
        toast.warning(`Maximum ${maxImages} images. ${acceptedFiles.length - remainingSlots} fichier(s) ignoré(s).`)
      }

      setUploadingCount(filesToUpload.length)

      const uploadPromises = filesToUpload.map(async (file, index): Promise<UploadedImage | null> => {
        const imageIndex = images.length + index
        const result = await uploadPostMedia(file, postId, imageIndex)

        if (result.success && result.url) {
          return {
            id: result.mediaId,
            url: result.url,
            storagePath: result.storagePath,
            order: imageIndex,
          }
        } else {
          toast.error(`Erreur: ${result.error || "Échec upload"}`)
          return null
        }
      })

      const results = await Promise.all(uploadPromises)
      const successfulUploads = results.filter((r): r is UploadedImage => r !== null)

      if (successfulUploads.length > 0) {
        updateImages([...images, ...successfulUploads])
        toast.success(`${successfulUploads.length} image(s) ajoutée(s)`)
      }

      setUploadingCount(0)
    },
    [images, maxImages, postId, uploadPostMedia, updateImages]
  )

  const removeImage = useCallback(
    async (index: number) => {
      const imageToRemove = images[index]

      if (imageToRemove.id) {
        const result = await deletePostMedia(imageToRemove.id)
        if (!result.success) {
          toast.error(result.error || "Erreur lors de la suppression")
          return
        }
      }

      const newImages = images
        .filter((_, i) => i !== index)
        .map((img, i) => ({ ...img, order: i }))

      updateImages(newImages)
      toast.success("Image supprimée")
    },
    [images, deletePostMedia, updateImages]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "image/webp": [".webp"],
    },
    maxSize: 5 * 1024 * 1024, // 5MB
    disabled: disabled || isUploading || images.length >= maxImages,
  })

  const isDisabled = disabled || isUploading || images.length >= maxImages

  return (
    <div className="space-y-4">
      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors",
          isDragActive && "border-primary bg-primary/5",
          isDisabled && "opacity-50 cursor-not-allowed",
          !isDisabled && !isDragActive && "border-muted-foreground/25 hover:border-primary/50"
        )}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-2">
          {uploadingCount > 0 ? (
            <>
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Upload en cours... ({uploadingCount} fichier{uploadingCount > 1 ? "s" : ""})
              </p>
            </>
          ) : (
            <>
              <ImagePlus className="h-8 w-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                {isDragActive
                  ? "Déposez les images ici..."
                  : images.length >= maxImages
                    ? `Maximum ${maxImages} images atteint`
                    : "Glissez-déposez ou cliquez pour ajouter des images"}
              </p>
              <p className="text-xs text-muted-foreground">
                JPG, PNG ou WebP (max. 5MB)
              </p>
            </>
          )}
        </div>
      </div>

      {/* Image Grid with DnD */}
      {images.length > 0 && (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={images.map((img) => img.id || img.url)}
            strategy={rectSortingStrategy}
          >
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {images.map((image, index) => (
                <SortableImage
                  key={image.id || image.url}
                  image={image}
                  index={index}
                  onRemove={removeImage}
                  onImageClick={setLightboxIndex}
                  isUploading={isUploading}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {/* Counter */}
      <p className="text-xs text-muted-foreground text-right">
        {images.length} / {maxImages} images
      </p>

      {/* Lightbox */}
      <Lightbox
        open={lightboxIndex >= 0}
        close={() => setLightboxIndex(-1)}
        index={lightboxIndex}
        slides={images.map((img) => ({ src: img.url }))}
      />
    </div>
  )
}
