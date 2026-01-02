"use client"

import Map, { Marker } from "react-map-gl/mapbox"
import "mapbox-gl/dist/mapbox-gl.css"
import { MapPin } from "lucide-react"
import { useLayoutEffect, useState } from "react"

type PostLocationProps = {
  longitude: number | undefined
  latitude: number | undefined
}

function getDimensionsFromWidth(width: number) {
  if (width < 768) {
    return { width: width - 32, height: 400 }
  } else if (width < 1024) {
    return { width: width - 64, height: 500 }
  } else {
    return { width: 600, height: 400 }
  }
}

export const PostLocation = ({ longitude, latitude }: PostLocationProps) => {
  const [dimensions, setDimensions] = useState({ width: 600, height: 400 })
  const [viewState, setViewState] = useState({
    latitude,
    longitude,
    zoom: 14,
  })

  useLayoutEffect(() => {
    const updateDimensions = () => {
      setDimensions(getDimensionsFromWidth(window.innerWidth))
    }
    updateDimensions()
    window.addEventListener("resize", updateDimensions)
    return () => window.removeEventListener("resize", updateDimensions)
  }, [])

  if (!longitude || !latitude) {
    return null
  }

  const boundsPadding = 0.08

  const maxBounds = [
    longitude - boundsPadding, // West
    latitude - boundsPadding, // South
    longitude + boundsPadding, // East
    latitude + boundsPadding, // North
  ] as [number, number, number, number]

  return (
    <Map
      mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || ""}
      {...viewState}
      onMove={(evt) => setViewState(evt.viewState)}
      style={{
        width: dimensions.width,
        height: dimensions.height,
        maxWidth: "100%",
      }}
      minZoom={12}
      maxZoom={20}
      maxBounds={maxBounds}
      dragRotate={false}
      mapStyle="mapbox://styles/mapbox/streets-v12"
    >
      <Marker longitude={longitude} latitude={latitude}>
        <MapPin strokeWidth={3} color="red" />
      </Marker>
    </Map>
  )
}
