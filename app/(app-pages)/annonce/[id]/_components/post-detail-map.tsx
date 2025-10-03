"use client"

import { MapPin } from "lucide-react"
import "mapbox-gl/dist/mapbox-gl.css"
import { useState } from "react"
import Map, { Marker } from "react-map-gl/mapbox"

type PostDetailMapProps = {
  longitude: number | undefined
  latitude: number | undefined
  businessName: string
}

export function PostDetailMap({
  longitude,
  latitude,
  businessName,
}: PostDetailMapProps) {
  // État simple pour la vue de la carte
  const [viewState, setViewState] = useState({
    latitude: latitude || 45.5017,
    longitude: longitude || -73.5673,
    zoom: 14,
  })

  // Affichage du fallback si pas de coordonnées
  if (!longitude || !latitude) {
    return (
      <div className="flex h-[300px] items-center justify-center rounded-lg border bg-muted/50 md:h-[400px] lg:h-[500px]">
        <div className="text-center">
          <MapPin className="mx-auto mb-2 h-12 w-12 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Emplacement non disponible
          </p>
        </div>
      </div>
    )
  }

  // Limites de la carte pour restreindre le déplacement
  const boundsPadding = 0.05
  const maxBounds = [
    longitude - boundsPadding,
    latitude - boundsPadding,
    longitude + boundsPadding,
    latitude + boundsPadding,
  ] as [number, number, number, number]

  return (
    <div className="overflow-hidden rounded-lg border shadow-sm">
      <div className="h-[300px] w-full md:h-[400px] lg:h-[500px]">
        <Map
          mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || ""}
          {...viewState}
          onMove={(evt) => setViewState(evt.viewState)}
          style={{ width: "100%", height: "100%" }}
          minZoom={12}
          maxZoom={18}
          maxBounds={maxBounds}
          dragRotate={false}
          touchZoomRotate={false}
          mapStyle="mapbox://styles/mapbox/streets-v12"
        >
          <Marker longitude={longitude} latitude={latitude} anchor="bottom">
            <div className="flex flex-col items-center">
              <div className="rounded-full bg-primary p-2 shadow-lg transition-transform hover:scale-110">
                <MapPin
                  className="size-5 text-primary-foreground md:size-6"
                  strokeWidth={2.5}
                />
              </div>
              <div className="mt-1 max-w-[150px] truncate rounded bg-background px-2 py-1 text-xs font-medium shadow-md md:max-w-[200px]">
                {businessName}
              </div>
            </div>
          </Marker>
        </Map>
      </div>
    </div>
  )
}
