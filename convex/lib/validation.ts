import { Id } from "../_generated/dataModel"

/**
 * Valide que le post a exactement un propriétaire (userId XOR organizationId)
 * @throws Error si les deux sont définis ou si aucun n'est défini
 */
export function validatePostOwnership(
  userId?: Id<"users">,
  organizationId?: Id<"organizations">
): void {
  const hasUser = userId !== undefined
  const hasOrg = organizationId !== undefined

  if (hasUser && hasOrg) {
    throw new Error(
      "Un post ne peut pas appartenir à un utilisateur ET une organisation en même temps"
    )
  }

  if (!hasUser && !hasOrg) {
    throw new Error(
      "Un post doit appartenir soit à un utilisateur, soit à une organisation"
    )
  }
}

/**
 * Convertit un montant en dollars vers des cents
 * @example toCents(50.00) => 5000
 */
export function toCents(dollars: number): number {
  return Math.round(dollars * 100)
}

/**
 * Convertit un montant en cents vers des dollars
 * @example toDollars(5000) => 50.00
 */
export function toDollars(cents: number): number {
  return cents / 100
}

/**
 * Valide que la durée de publication est d'au moins 1 jour
 * @throws Error si durationDays < 1
 */
export function validateDurationDays(durationDays: number): void {
  if (durationDays < 1) {
    throw new Error("La durée de publication doit être d'au moins 1 jour")
  }
}

/**
 * Calcule la date d'expiration à partir de maintenant
 * @param durationDays Nombre de jours de publication
 * @returns Timestamp d'expiration
 */
export function calculateExpiresAt(durationDays: number): number {
  return Date.now() + durationDays * 24 * 60 * 60 * 1000
}
