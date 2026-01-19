"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { Loader } from "lucide-react"
import { useCurrentUser } from "@/hooks/use-current-user"

export default function AuthCallbackPage() {
  const router = useRouter()
  const { currentUser, isLoading, isAuthenticated } = useCurrentUser()
  const [hasRedirected, setHasRedirected] = useState(false)
  const [retryCount, setRetryCount] = useState(0)

  // Pattern sync pendant le rendu (pas de useEffect)
  if (!isLoading && !hasRedirected) {
    if (!isAuthenticated) {
      setHasRedirected(true)
      router.replace("/auth/sign-in")
    } else if (currentUser === null && retryCount < 3) {
      // Webhook pas encore traité, retry
      setTimeout(() => setRetryCount((c) => c + 1), 500)
    } else if (currentUser) {
      setHasRedirected(true)
      router.replace(currentUser.role === "ADMIN" ? "/admin" : "/")
    } else {
      // Fallback après retries
      setHasRedirected(true)
      router.replace("/")
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center">
        <Loader className="mx-auto h-8 w-8 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Redirection en cours...</p>
      </div>
    </div>
  )
}
