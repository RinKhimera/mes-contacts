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

// Mapping des chemins info vers leurs titres
const infoPageTitles: Record<string, string> = {
  "aide": "Aide",
  "a-propos": "À propos",
  "carrieres": "Carrières",
  "faq": "FAQ",
  "contact": "Contact",
  "conditions-utilisation": "Conditions d'utilisation",
  "politique-confidentialite": "Politique de confidentialité",
  "politique-cookies": "Politique des cookies",
}

// Fonction pour obtenir le titre à partir du chemin
const getTitleFromPath = (path: string): string => {
  // Admin dashboard
  if (path === "admin") return "Administration"
  if (path === "organisations") return "Organisations"
  if (path === "annonces") return "Annonces"
  if (path === "paiements") return "Paiements"
  if (path === "utilisateurs") return "Utilisateurs"
  if (path === "account") return "Compte"

  // Vérifier les pages info
  if (infoPageTitles[path]) {
    return infoPageTitles[path]
  }

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

  // Vérifier si c'est une page info (pas dans le dashboard)
  const isInfoPage = segments.length > 0 && infoPageTitles[segments[0].path]

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {/* Ajouter "Accueil" pour les pages info */}
        {isInfoPage && (
          <>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Accueil</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
          </>
        )}
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
