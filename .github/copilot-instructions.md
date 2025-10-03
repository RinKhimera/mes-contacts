# Copilot Instructions - Mescontacts.ca

## Project Overview

A Next.js 15 business directory platform (French-Canadian) allowing users to create and publish business listings with geolocation, payment integration, and authentication.

**Tech Stack:**

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS 4
- **Backend**: Convex (real-time database & backend-as-a-service)
- **Auth**: Clerk (with French localization via `frFR`)
- **Payment**: Stripe checkout for listing publication
- **UI**: shadcn/ui (Radix UI primitives)
- **Uploads**: UploadThing (images)
- **Maps**: Mapbox (geocoding & address autocomplete)
- **Forms**: React Hook Form + Zod validation

## Architecture Patterns

### Route Organization (Route Groups)

The app uses Next.js route groups to organize pages by layout/auth requirements:

- `(app-pages)` - Public landing pages (no auth)
- `(auth)` - Clerk authentication pages (sign-in, sign-up)
- `(dashboard)` - Protected user dashboard area
- Middleware in `middleware.ts` handles auth redirects: authenticated users → `/dashboard`, unauthenticated → sign-in

### Data Flow: Convex-First Architecture

All database operations go through Convex queries/mutations - **never direct database access**:

```typescript
// ✅ Correct: Use Convex hooks in client components
const posts = useQuery(api.posts.getCurrentUserPosts)
const createPost = useMutation(api.posts.createPost)

// ❌ Wrong: No direct DB or ORM
```

**Key Convex Files:**

- `convex/schema.ts` - Database schema (users, posts with geo objects)
- `convex/posts.ts` - Post CRUD operations
- `convex/users.ts` - User management with Clerk sync via webhooks
- `convex/http.ts` - Webhook handler for Clerk user lifecycle events

### Authentication Integration

Uses **Convex + Clerk** integration pattern:

1. Clerk manages auth UI/sessions (`@clerk/nextjs`)
2. Webhook at `/api/convex/clerk` syncs user data to Convex DB
3. Convex mutations validate auth via `ctx.auth.getUserIdentity()`
4. Provider setup: `ConvexProviderWithClerk` wraps `ClerkProvider` in `providers/convex-client-provider.tsx`

```typescript
// Typical Convex mutation auth check
const identity = await ctx.auth.getUserIdentity()
if (!identity) throw new Error("Unauthorized")
const user = await ctx.db
  .query("users")
  .withIndex("by_tokenIdentifier", (q) =>
    q.eq("tokenIdentifier", identity.tokenIdentifier),
  )
  .unique()
```

### Form Patterns

All forms use React Hook Form + Zod with shadcn/ui form components:

- Schema definitions in `schemas/` (e.g., `schemas/post.ts`)
- Custom transforms in schemas (e.g., capitalize first letter, format phone numbers)
- Use `@hookform/resolvers/zod` for validation integration
- See `components/post/post-form.tsx` for comprehensive example with file uploads

### Geolocation Flow

Uses Mapbox Search API for address autocomplete:

1. `@mapbox/search-js-react` `<AddressAutofill>` component captures input
2. On selection, extracts coordinates, city, province, postal code from response
3. Stores as flat fields + optional `geo` object with longitude/latitude in Convex schema

### Payment Integration (Stripe)

Post publication requires payment:

1. User creates post (status: `DRAFT`)
2. Clicking "Publish" triggers `checkoutHandler` in `server/actions/checkout.ts`
3. Creates Stripe checkout session with `postId` in metadata
4. Webhook (not shown) updates post status to `PUBLISHED` on success
5. Check `components/dashboard/checkout-button.tsx` for client-side implementation

## Development Workflows

### Key Commands

```bash
npm run dev            # Start dev server with Turbopack
npm run build-check    # Run type-check + lint before commit
npm run fix-lint       # Auto-fix ESLint issues
```

### Component Organization

- `components/ui/` - shadcn/ui primitives (button, form, card, etc.) - **avoid editing directly**
- `components/shared/` - App-wide shared components (header, theme provider, breadcrumbs)
- `components/dashboard/` - Dashboard-specific components
- `components/post/` - Post-related forms and displays
- **Page-specific components**: Each page should have its own `_components/` folder in the page directory
  - Example: `app/(app-pages)/page.tsx` → `app/(app-pages)/_components/hero.tsx`
  - Example: `app/(dashboard)/dashboard/page.tsx` → `app/(dashboard)/dashboard/_components/stats-card.tsx`
- Use `cn()` from `lib/utils.ts` for conditional class merging with Tailwind
- `components/post/` - Post-related forms and displays

### Data Querying Conventions

- **Client components**: Use Convex `useQuery`/`useMutation` hooks
- **Server components**: Use Convex's server-side query methods (not shown in this codebase yet)
- Index queries by common filters (e.g., `by_status`, `by_category`, `by_authorId`)

### File Upload Pattern

UploadThing integration in `utils/uploadthing.ts` + `app/api/uploadthing/core.ts`:

1. Define file router with auth middleware (Clerk `userId` check)
2. Client uses `useUploadThing` hook with lifecycle callbacks
3. Upload happens before form submission, URL stored in form data
4. Configure allowed domains in `next.config.ts` `images.remotePatterns`

### State Management

- **Forms**: React Hook Form local state
- **Server state**: Convex queries (auto-reactive, no manual refetch)
- **UI state**: React useState/useTransition for loading states
- **Theme**: next-themes provider in `components/shared/theme-provider.tsx`

## Coding Conventions

### TypeScript

- Strict mode enabled
- Use Convex generated types: `Doc<"posts">`, `Id<"posts">` from `convex/_generated/dataModel`
- Import Convex API: `import { api } from "@/convex/_generated/api"`
- **Function declarations**: Always use arrow functions with `const`, never use `function` keyword

  ```typescript
  // ✅ Correct
  const myFunction = () => {}
  const MyComponent = () => <div>...</div>

  // ❌ Wrong
  function myFunction() {}
  function MyComponent() { return <div>...</div> }
  ```

### Styling

- Tailwind CSS 4 utility-first approach
- Use shadcn/ui component variants (CVA) for consistent styling
- Responsive: mobile-first with `sm:`, `md:`, `lg:` breakpoints
- Dark mode support via `next-themes` (class-based strategy)

### Localization

- UI text in **French** (Canada) - see `frFR` in Clerk config
- Error messages in French - check `schemas/post.ts` for examples
- Use French naming: `businessName`, `province`, `postalCode`

### Environment Variables Required

```env
NEXT_PUBLIC_CONVEX_URL=            # Convex deployment URL
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY= # Clerk public key
CLERK_SECRET_KEY=                  # Clerk secret
CLERK_WEBHOOK_SECRET=              # For Clerk webhooks
UPLOADTHING_TOKEN=                 # UploadThing API
STRIPE_SECRET_KEY=                 # Stripe API
STRIPE_PRICE_ID=                   # Price ID for listing publication
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=   # Mapbox geocoding
```

## Common Tasks

### Adding a New Post Field

1. Update `convex/schema.ts` posts table definition
2. Add field to `schemas/post.ts` Zod schema with validation
3. Update `convex/posts.ts` mutation args and insert/update logic
4. Add form field in `components/post/post-form.tsx`

### Creating Protected Routes

Add route matcher to `middleware.ts` `isProtectedRoute` array - middleware auto-protects via Clerk.

### Adding Status Filters

Use Convex indexes - define in schema, query with `.withIndex()`:

```typescript
// In schema: .index("by_category", ["category"])
// In query:
await ctx.db
  .query("posts")
  .withIndex("by_category", (q) => q.eq("category", categoryName))
  .collect()
```

### Implementing Search

For full-text search, use Convex search indexes (define in schema), or filter results client-side for simple cases.
