import { api } from "@/convex/_generated/api"
import { useConvexAuth, useQuery } from "convex/react"

export const useCurrentUser = () => {
  const { isAuthenticated, isLoading: isAuthLoading } = useConvexAuth()

  const currentUser = useQuery(
    api.users.getCurrentUser,
    isAuthenticated ? undefined : "skip",
  )

  return {
    currentUser,
    isLoading: isAuthLoading || (isAuthenticated && currentUser === undefined),
    isAuthenticated,
  }
}
