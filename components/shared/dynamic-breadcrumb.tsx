"use client"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { data } from "@/constants"
import { usePathname } from "next/navigation"
import React from "react"

// Fonction pour obtenir le titre à partir du chemin
const getTitleFromPath = (path: string): string => {
  // Tableau de bord est la section parent pour tous les chemins /dashboard/*
  if (path === "dashboard") return "Tableau de bord"
  if (path === "account") return "Compte"

  // Recherche dans la navigation principale
  for (const section of data.navMain) {
    for (const item of section.items) {
      // Nettoyer l'URL pour extraire le dernier segment
      const lastSegment = item.url.split("/").pop()
      if (lastSegment === path) {
        return item.title
      }
    }
  }

  // Si aucun titre trouvé, formater le segment de chemin par défaut
  return path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, " ")
}

export function DynamicBreadcrumb() {
  const pathname = usePathname()

  // Extraire les segments de l'URL
  const segments = pathname
    .split("/")
    .filter((segment) => segment !== "")
    .filter((segment) => !segment.startsWith("(")) // Ignorer les segments comme (dashboard)
    .map((segment) => ({
      name: getTitleFromPath(segment),
      path: segment,
    }))

  // Si nous sommes à la racine
  if (segments.length === 0) {
    return (
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>Tableau de bord</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    )
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {segments.map((segment, index) => (
          <React.Fragment key={segment.path}>
            {index > 0 && <BreadcrumbSeparator />}
            <BreadcrumbItem>
              {index === segments.length - 1 ? (
                <BreadcrumbPage>{segment.name}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink
                  href={`/${segments
                    .slice(0, index + 1)
                    .map((s) => s.path)
                    .join("/")}`}
                >
                  {segment.name}
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
