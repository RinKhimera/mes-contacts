"use client"

import { frFR } from "@clerk/localizations"
import { ClerkProvider, useAuth } from "@clerk/nextjs"
import { ConvexReactClient } from "convex/react"
import { ConvexProviderWithClerk } from "convex/react-clerk"
import { useTheme } from "next-themes"
import { ReactNode, useEffect, useState } from "react"
import { getClerkAppearance } from "@/lib/clerk-theme"

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!)

function ClerkProviderWithTheme({ children }: { children: ReactNode }) {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Éviter les problèmes d'hydratation
  useEffect(() => {
    setMounted(true)
  }, [])

  // Utiliser le thème dark par défaut pendant le SSR
  const appearance = getClerkAppearance(mounted ? resolvedTheme : "dark")

  return (
    <ClerkProvider
      localization={frFR}
      appearance={appearance}
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!}
    >
      {children}
    </ClerkProvider>
  )
}

export default function ConvexClientProvider({
  children,
}: {
  children: ReactNode
}) {
  return (
    <ClerkProviderWithTheme>
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        {children}
      </ConvexProviderWithClerk>
    </ClerkProviderWithTheme>
  )
}
