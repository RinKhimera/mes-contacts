import { QueryCtx, MutationCtx } from "../_generated/server"
import { Doc } from "../_generated/dataModel"

/**
 * Récupère l'utilisateur actuellement connecté
 * @returns L'utilisateur ou null si non authentifié
 */
export async function getCurrentUser(
  ctx: QueryCtx | MutationCtx
): Promise<Doc<"users"> | null> {
  const identity = await ctx.auth.getUserIdentity()
  if (!identity) return null

  return await ctx.db
    .query("users")
    .withIndex("by_tokenIdentifier", (q) =>
      q.eq("tokenIdentifier", identity.tokenIdentifier)
    )
    .unique()
}

/**
 * Vérifie que l'utilisateur est authentifié et le retourne
 * @throws Error si non authentifié
 */
export async function requireAuth(
  ctx: QueryCtx | MutationCtx
): Promise<Doc<"users">> {
  const user = await getCurrentUser(ctx)
  if (!user) {
    throw new Error("Authentification requise")
  }
  return user
}

/**
 * Vérifie que l'utilisateur est un administrateur
 * @throws Error si non authentifié ou si pas admin
 */
export async function requireAdmin(
  ctx: QueryCtx | MutationCtx
): Promise<Doc<"users">> {
  const user = await requireAuth(ctx)
  if (user.role !== "ADMIN") {
    throw new Error("Accès réservé aux administrateurs")
  }
  return user
}

/**
 * Vérifie si l'utilisateur actuel est admin (sans throw)
 */
export async function isAdmin(ctx: QueryCtx | MutationCtx): Promise<boolean> {
  const user = await getCurrentUser(ctx)
  return user?.role === "ADMIN"
}
