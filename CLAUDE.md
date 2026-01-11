# CLAUDE.md - Mescontacts.ca

## Projet

Plateforme d'annuaire d'entreprises et services au Canada (mescontacts.ca). Permet aux utilisateurs de publier des annonces de services professionnels avec géolocalisation et recherche avancée. Les annonces sont créées et gérées par des administrateurs.

## Stack Technique

- **Framework**: Next.js 16.1.1 (App Router, Turbopack)
- **Language**: TypeScript 5 (strict mode)
- **Backend**: Convex (real-time database, mutations, queries, cron jobs)
- **Auth**: Clerk (middleware, webhooks, rôles ADMIN/USER)
- **Paiements**: Manuels par ADMIN (enregistrement dans Convex)
- **Maps**: Mapbox GL + Search API
- **UI**: shadcn/ui + Radix UI + TailwindCSS 4
- **Forms**: React Hook Form + Zod
- **Médias**: Bunny CDN (URLs externes, multi-médias par annonce)

## Commandes

```bash
# Développement
npm run dev          # Démarre Next.js + Convex en parallèle
npx convex dev       # Convex seul (si besoin)

# Build & Lint
npm run build        # Build production
npm run lint         # ESLint

# Formatage
npx prettier --write .
```

## Structure du Projet

```
/app
├── (app-pages)/     # Pages publiques (accueil, recherche, annonces)
├── (dashboard)/     # Pages protégées (dashboard, mes annonces, compte)
├── (auth)/          # Pages d'authentification Clerk
└── api/             # Routes API (webhooks)

/components
├── ui/              # Composants shadcn/ui (32 composants)
├── dashboard/       # Composants dashboard
├── post/            # Formulaires d'annonces
└── shared/          # Header, Footer, composants partagés

/convex              # Backend Convex
├── schema.ts        # Schéma de données (7 tables)
├── lib/
│   ├── auth.ts      # Helpers: getCurrentUser, requireAuth, requireAdmin
│   └── validation.ts # Validation XOR ownership, utilitaires
├── posts.ts         # CRUD annonces (admin-only)
├── users.ts         # Sync Clerk → Convex
├── organizations.ts # CRUD organisations
├── organizationMembers.ts # Gestion membres
├── media.ts         # CRUD médias Bunny CDN
├── payments.ts      # Enregistrement paiements manuels
├── statusHistory.ts # Audit log des changements de statut
└── crons.ts         # Job quotidien d'expiration

/schemas             # Schémas Zod de validation
/constants           # Constantes (catégories, provinces, menus)
/hooks               # Hooks React personnalisés
/lib                 # Utilitaires
```

## Schéma de Données Convex

### Tables (7)

| Table | Description |
|-------|-------------|
| `users` | Utilisateurs synchronisés depuis Clerk |
| `organizations` | Entreprises/groupes |
| `organizationMembers` | Table de jonction user ↔ organisation |
| `posts` | Annonces de services |
| `media` | Fichiers médias (images, vidéos, documents) |
| `payments` | Paiements manuels enregistrés |
| `statusHistory` | Audit log des changements de statut |

### Enums Exportés (convex/schema.ts)

```typescript
// Rôles
userRole: "ADMIN" | "USER"
orgMemberRole: "OWNER" | "MEMBER"

// Statuts
postStatus: "DRAFT" | "PUBLISHED" | "EXPIRED" | "DISABLED"
paymentStatus: "PENDING" | "COMPLETED" | "REFUNDED"

// Types
mediaType: "IMAGE" | "VIDEO" | "DOCUMENT"
paymentMethod: "CASH" | "E_TRANSFER" | "VIREMENT" | "CARD" | "OTHER"
```

### Ownership XOR

Un post appartient soit à un utilisateur, soit à une organisation, **jamais les deux** :

```typescript
// convex/lib/validation.ts
validatePostOwnership(userId?, organizationId?)
// Lance une erreur si les deux sont définis ou si aucun n'est défini
```

### System Fields Convex

Convex ajoute automatiquement à tous les documents :
- `_id` : Identifiant unique
- `_creationTime` : Timestamp de création (ms depuis Unix epoch)

**Ne pas créer de champs `createdAt`** - utiliser `_creationTime` à la place.

## Conventions de Code

### TypeScript
- Mode strict activé
- Imports avec alias `@/*` pour la racine
- Types explicites pour les props de composants

### Composants React
- Server Components par défaut
- `"use client"` uniquement si nécessaire (hooks, interactivité)
- `"use server"` pour les Server Actions

### Styling
- TailwindCSS utility-first
- Dark mode supporté via `next-themes`
- Classes responsive: `hidden md:flex`, `flex md:hidden`

### Formulaires
- React Hook Form avec Zod resolver
- Validation: téléphones canadiens, codes postaux CA
- Pattern: `schemas/post.ts` pour les schémas

### Données Convex
- Queries pour lecture (`useQuery`)
- Mutations pour écriture (`useMutation`)
- Toujours vérifier les permissions avec `requireAdmin()` ou `requireAuth()`

## Patterns Importants

### Authentification

```typescript
// convex/lib/auth.ts
import { getCurrentUser, requireAuth, requireAdmin } from "./lib/auth"

// Obtenir l'utilisateur courant (peut être null)
const user = await getCurrentUser(ctx)

// Exiger une authentification (lance erreur si non connecté)
const user = await requireAuth(ctx)

// Exiger un admin (lance erreur si non admin)
const admin = await requireAdmin(ctx)
```

### Annonces (Posts)

- **Création** : ADMIN uniquement via `posts.create()`
- **Ownership** : `userId` XOR `organizationId`
- **Lifecycle** : DRAFT → PUBLISHED → EXPIRED → DISABLED
- **Publication** : Automatique lors de l'enregistrement d'un paiement
- **Expiration** : Cron job quotidien à 5h UTC (00h EST)

```typescript
// Cycle de vie d'un post
1. Admin crée le post → status: DRAFT
2. Admin enregistre un paiement → status: PUBLISHED, expiresAt calculé
3. Cron job détecte expiration → status: EXPIRED
4. Admin peut désactiver manuellement → status: DISABLED
```

### Paiements Manuels

```typescript
// convex/payments.ts
payments.record({
  postId,
  amount: 5000,        // En cents (5000 = 50.00 CAD)
  method: "E_TRANSFER",
  durationDays: 30,    // Durée de publication
  notes: "Optionnel"
})
// → Enregistre le paiement
// → Publie automatiquement le post
// → Calcule expiresAt
// → Log dans statusHistory
```

### Organisations

```typescript
// OWNER peut tout faire sur son organisation
// MEMBER a un accès en lecture seule
// Un user peut être membre de plusieurs organisations
```

### Médias (Bunny CDN)

```typescript
// Les URLs sont stockées directement (pas d'upload via Convex)
media.create({
  postId,
  url: "https://cdn.bunny.net/...",
  type: "IMAGE",
  altText: "Description",
  order: 0
})
```

### Audit Log

Chaque changement de statut d'un post est automatiquement loggé dans `statusHistory` :

```typescript
{
  postId,
  previousStatus: "DRAFT",
  newStatus: "PUBLISHED",
  changedBy: adminId,
  reason: "Paiement 50.00 CAD - 30 jours",
  _creationTime: timestamp
}
```

### Gestion d'erreurs
- Composant `error.tsx` global
- Toast notifications via Sonner
- Skeleton loaders pour les états de chargement

## Variables d'Environnement Requises

```env
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

# Convex
NEXT_PUBLIC_CONVEX_URL=

# Mapbox
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=

# Bunny CDN (pour upload médias)
BUNNY_API_KEY=
BUNNY_STORAGE_ZONE=
BUNNY_CDN_URL=
```

## Règles de Développement

1. **Pas de console.log** en production
2. **Vérifier les permissions** avec `requireAdmin()` pour les mutations sensibles
3. **Valider côté serveur** toutes les entrées utilisateur
4. **Ownership XOR** : un post a `userId` OU `organizationId`, jamais les deux
5. **Imports triés** : tiers → context → utils → hooks → components
6. **Commits** : messages clairs en anglais
7. **Utiliser `_creationTime`** au lieu de créer des champs `createdAt`

## Index Convex (37 total)

Les index principaux pour les requêtes fréquentes :

| Table | Index | Usage |
|-------|-------|-------|
| posts | `by_status` | Liste par statut |
| posts | `by_category_province_city` | Recherche géolocalisée |
| posts | `by_status_expiresAt` | Cron job expiration |
| payments | `by_postId` | Historique paiements d'un post |
| statusHistory | `by_postId` | Audit log d'un post |
| organizations | `by_ownerId` | Organisations d'un user |
| organizationMembers | `by_userId` | Memberships d'un user |

## Dépendances Clés

- `convex` : Backend as a service, API réactive
- `@clerk/nextjs` : Auth middleware et composants
- `sonner` : Toast notifications
- `cmdk` : Command menu (Cmd+K)
- `date-fns` : Manipulation de dates
- `lucide-react` : Icônes

## Déploiement

- **Hébergement** : Vercel
- **Base de données** : Convex Cloud
- **Médias** : Bunny CDN
- **Domaine** : mescontacts.ca
