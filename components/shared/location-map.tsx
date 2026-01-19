"use client"

import { cn } from "@/lib/utils"
import { Compass, MapPin, Navigation } from "lucide-react"
import "mapbox-gl/dist/mapbox-gl.css"
import Map, { Marker } from "react-map-gl/mapbox"

interface LocationMapProps {
  longitude?: number
  latitude?: number
  businessName?: string
  variant?: "preview" | "detail"
  showLabel?: boolean
  className?: string
}

export function LocationMap({
  longitude,
  latitude,
  businessName,
  variant = "detail",
  showLabel = true,
  className,
}: LocationMapProps) {
  const hasCoordinates = longitude !== undefined && latitude !== undefined

  // Height classes based on variant
  const heightClasses =
    variant === "preview" ? "h-[200px]" : "h-[300px] md:h-[400px] lg:h-[500px]"

  // Placeholder when no coordinates
  if (!hasCoordinates) {
    return (
      <div
        className={cn(
          "group relative overflow-hidden rounded-xl border border-border/50 bg-linear-to-br from-muted/30 via-muted/50 to-muted/30",
          heightClasses,
          className,
        )}
      >
        {/* Decorative background pattern */}
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]">
          <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern
                id="grid-pattern"
                width="32"
                height="32"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 32 0 L 0 0 0 32"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-pattern)" />
          </svg>
        </div>

        {/* Decorative compass rose */}
        <div className="absolute top-4 right-4 opacity-[0.08] dark:opacity-[0.12]">
          <Compass className="size-24 text-foreground" strokeWidth={0.5} />
        </div>

        {/* Decorative navigation lines */}
        <div className="absolute right-0 bottom-0 left-0 h-1/3 bg-linear-to-t from-muted/80 to-transparent" />

        {/* Content */}
        <div className="relative flex h-full flex-col items-center justify-center gap-4 p-6">
          {/* Animated pin container */}
          <div className="relative">
            {/* Outer pulse ring */}
            <div
              className="absolute inset-0 animate-ping rounded-full bg-primary/20"
              style={{ animationDuration: "2s" }}
            />

            {/* Inner glow */}
            <div className="absolute -inset-2 rounded-full bg-linear-to-br from-primary/10 to-primary/5 blur-md" />

            {/* Pin icon container */}
            <div className="relative flex size-16 items-center justify-center rounded-full border border-border/50 bg-background/80 shadow-lg backdrop-blur-sm transition-transform duration-300 group-hover:scale-105">
              <MapPin
                className="size-7 text-muted-foreground"
                strokeWidth={1.5}
              />
            </div>
          </div>

          {/* Text */}
          <div className="text-center">
            <p className="text-sm font-medium text-muted-foreground">
              {variant === "preview"
                ? "Entrez une adresse"
                : "Emplacement non disponible"}
            </p>
            {variant === "detail" && (
              <p className="mt-1 text-xs text-muted-foreground/70">
                Les coordonnees seront affichees apres la saisie de
                l&apos;adresse
              </p>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Map bounds to restrict panning
  const boundsPadding = variant === "preview" ? 0.03 : 0.05
  const maxBounds: [number, number, number, number] = [
    longitude - boundsPadding,
    latitude - boundsPadding,
    longitude + boundsPadding,
    latitude + boundsPadding,
  ]

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-xl border border-border/50 shadow-sm transition-shadow duration-300 hover:shadow-md",
        heightClasses,
        className,
      )}
    >
      {/* Map - Using uncontrolled mode with key to force remount on coordinate changes */}
      <Map
        key={`${longitude}-${latitude}`}
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || ""}
        initialViewState={{
          latitude,
          longitude,
          zoom: 14,
        }}
        style={{ width: "100%", height: "100%" }}
        minZoom={variant === "preview" ? 13 : 12}
        maxZoom={18}
        maxBounds={maxBounds}
        dragRotate={false}
        touchZoomRotate={false}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        attributionControl={false}
      >
        {/* Custom Marker */}
        <Marker longitude={longitude} latitude={latitude} anchor="bottom">
          <div className="flex flex-col items-center">
            {/* Marker container with animation */}
            <div className="relative">
              {/* Shadow/glow under marker */}
              <div className="absolute -bottom-1 left-1/2 h-2 w-6 -translate-x-1/2 rounded-full bg-black/20 blur-sm" />

              {/* Pulse ring */}
              <div
                className="absolute -inset-3 animate-pulse rounded-full bg-primary/30"
                style={{ animationDuration: "2s" }}
              />

              {/* Main marker */}
              <div className="relative flex size-10 items-center justify-center rounded-full border-2 border-white bg-linear-to-br from-primary to-primary/80 shadow-lg transition-transform duration-200 hover:scale-110">
                <MapPin
                  className="size-5 text-primary-foreground"
                  strokeWidth={2.5}
                  fill="currentColor"
                />
              </div>

              {/* Pointer/tail */}
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2">
                <div className="size-0 border-x-[6px] border-t-8 border-x-transparent border-t-primary" />
              </div>
            </div>

            {/* Business name label */}
            {showLabel && businessName && variant === "detail" && (
              <div className="mt-3 max-w-45 animate-in duration-300 fade-in slide-in-from-top-2">
                <div className="rounded-lg border border-border/50 bg-background/95 px-3 py-1.5 shadow-md backdrop-blur-sm">
                  <p className="truncate text-center text-xs font-medium text-foreground">
                    {businessName}
                  </p>
                </div>
              </div>
            )}
          </div>
        </Marker>
      </Map>

      {/* Subtle overlay gradient for depth */}
      <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-black/5 ring-inset dark:ring-white/5" />

      {/* Navigation hint on hover */}
      {variant === "detail" && (
        <div className="absolute right-3 bottom-3 flex items-center gap-1.5 rounded-full border border-border/50 bg-background/90 px-2.5 py-1 text-xs text-muted-foreground opacity-0 shadow-sm backdrop-blur-sm transition-opacity duration-200 group-hover:opacity-100">
          <Navigation className="size-3" />
          <span>Glissez pour explorer</span>
        </div>
      )}
    </div>
  )
}
