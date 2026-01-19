"use client"

import { useState } from "react"
import Image from "next/image"
import { Building2, Expand } from "lucide-react"
import Lightbox from "yet-another-react-lightbox"
import "yet-another-react-lightbox/styles.css"
import { cn } from "@/lib/utils"

interface GalleryImage {
  url: string
  alt?: string
}

interface ImageGalleryProps {
  images: GalleryImage[]
  businessName?: string
  className?: string
}

export function ImageGallery({ images, businessName, className }: ImageGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState(-1)

  // No images - show elegant placeholder
  if (!images || images.length === 0) {
    return (
      <div
        className={cn(
          "relative aspect-[4/3] overflow-hidden rounded-xl border border-border/50 bg-gradient-to-br from-muted/30 via-muted/50 to-muted/30",
          className
        )}
      >
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]">
          <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern
                id="gallery-grid"
                width="24"
                height="24"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 24 0 L 0 0 0 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#gallery-grid)" />
          </svg>
        </div>

        {/* Centered content */}
        <div className="relative flex h-full flex-col items-center justify-center gap-3 p-6">
          <div className="flex size-16 items-center justify-center rounded-full border border-border/50 bg-background/50 shadow-sm">
            <Building2 className="size-7 text-muted-foreground/60" strokeWidth={1.5} />
          </div>
          <p className="text-sm font-medium text-muted-foreground">
            Aucune image disponible
          </p>
        </div>
      </div>
    )
  }

  const primaryImage = images[0]
  const thumbnails = images.slice(1)

  return (
    <div className={cn("space-y-3", className)}>
      {/* Primary Image */}
      <div
        className="group relative aspect-[4/3] cursor-pointer overflow-hidden rounded-xl border border-border/50 bg-muted shadow-sm transition-shadow duration-300 hover:shadow-md"
        onClick={() => setLightboxIndex(0)}
      >
        <Image
          src={primaryImage.url}
          alt={primaryImage.alt || businessName || "Image principale"}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/10" />

        {/* Expand icon */}
        <div className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full border border-white/20 bg-black/50 px-2.5 py-1 text-xs text-white opacity-0 backdrop-blur-sm transition-opacity duration-200 group-hover:opacity-100">
          <Expand className="size-3.5" />
          <span>Agrandir</span>
        </div>

        {/* Image count badge */}
        {images.length > 1 && (
          <div className="absolute top-3 right-3 rounded-full bg-black/60 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
            1 / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {thumbnails.length > 0 && (
        <div className="grid grid-cols-4 gap-2">
          {thumbnails.map((image, index) => (
            <div
              key={image.url}
              className="group relative aspect-square cursor-pointer overflow-hidden rounded-lg border border-border/50 bg-muted transition-all duration-200 hover:border-primary/50 hover:shadow-sm"
              onClick={() => setLightboxIndex(index + 1)}
            >
              <Image
                src={image.url}
                alt={image.alt || `Image ${index + 2}`}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 768px) 25vw, 100px"
              />
              {/* Subtle hover overlay */}
              <div className="absolute inset-0 bg-black/0 transition-colors duration-200 group-hover:bg-black/5" />
            </div>
          ))}
        </div>
      )}

      {/* Lightbox */}
      <Lightbox
        open={lightboxIndex >= 0}
        close={() => setLightboxIndex(-1)}
        index={lightboxIndex}
        slides={images.map((img) => ({
          src: img.url,
          alt: img.alt || businessName || "Image"
        }))}
      />
    </div>
  )
}
