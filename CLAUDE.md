# CLAUDE.md - Mescontacts.ca

Annuaire d'entreprises et services au Canada. Les annonces sont créées et gérées exclusivement par des administrateurs.

## Stack

Next.js 16 (App Router) · TypeScript · Convex (backend temps réel) · Clerk (auth) · Bunny CDN (médias) · TailwindCSS 4 · shadcn/ui

## Commandes

```bash
npm run dev           # Next.js + Convex en parallèle
npm run build-check   # TypeScript + ESLint (avant commit)
npm run test          # Vitest
```

## Structure

```
app/
├── (app-pages)/      # Pages publiques
├── (admin)/admin/    # Dashboard admin (ADMIN only)
└── api/              # Webhooks Clerk

convex/
├── schema.ts         # Tables et enums (source de vérité)
├── lib/auth.ts       # getCurrentUser, requireAuth, requireAdmin
├── lib/validation.ts # validatePostOwnership (XOR logic)
└── posts.ts          # CRUD annonces

components/
├── ui/               # shadcn/ui
├── admin/            # Composants admin
└── shared/           # Header, Footer, uploads

schemas/              # Validation Zod (posts, organizations)
hooks/                # useBunnyUpload, useMapbox, etc.
```

## Règles Critiques

**IMPORTANT - Ownership XOR** : Un post appartient à `userId` OU `organizationId`, jamais les deux. Voir `convex/lib/validation.ts:validatePostOwnership()`.

**IMPORTANT - Montants en cents** : Tous les montants sont stockés en cents (5000 = 50.00 CAD). Utiliser `toDollars()` / `toCents()` de `convex/lib/validation.ts`.

**IMPORTANT - Pas de `createdAt`** : Convex fournit `_creationTime` automatiquement sur tous les documents.

**IMPORTANT - Permissions** : Toutes les mutations sensibles doivent appeler `requireAdmin(ctx)` de `convex/lib/auth.ts`.

## Cycle de Vie des Annonces

```
DRAFT → PUBLISHED → EXPIRED → DISABLED
         ↑ paiement    ↑ cron 5h UTC
```

1. Admin crée le post → `DRAFT`
2. Admin enregistre un paiement → `PUBLISHED` + `expiresAt` calculé
3. Cron job quotidien → `EXPIRED` si dépassé
4. Admin peut désactiver → `DISABLED`

## Patterns Convex

```typescript
// Auth - convex/lib/auth.ts
const user = await getCurrentUser(ctx)  // null si non connecté
const user = await requireAuth(ctx)      // erreur si non connecté
const admin = await requireAdmin(ctx)    // erreur si non admin

// Queries et Mutations
const posts = useQuery(api.posts.list, { status: "PUBLISHED" })
const createPost = useMutation(api.posts.create)
```

## Upload Médias

Hook `useBunnyUpload` pour tous les uploads vers Bunny CDN :

```typescript
const { uploadPostMedia, uploadOrgLogo, uploadAvatar } = useBunnyUpload()
await uploadPostMedia(file, postId, imageIndex)
```

Structure stockage : `posts/{postId}/`, `organizations/{orgId}/`, `avatars/{userId}/`

## Tests

```bash
npm run test              # Tous les tests
npm run test:coverage     # Avec couverture
```

- Tests unitaires : `tests/schemas/` (validation Zod)
- Tests backend : `tests/convex/` (queries/mutations avec convex-test)

## Gotchas

- Clerk synchronise les users vers Convex via webhook (`convex/http.ts`)
- Les enums sont dans `convex/schema.ts` (postStatus, paymentMethod, etc.)
- Utiliser `<Image>` de Next.js, pas `<img>` natif
- Variables underscore `_foo` pour les variables intentionnellement non utilisées
