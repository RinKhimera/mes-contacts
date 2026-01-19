<p align="center">
  <h1 align="center">Mescontacts.ca</h1>
  <p align="center">
    Annuaire d'entreprises et services au Canada
    <br />
    <a href="https://mescontacts.ca"><strong>Voir le site »</strong></a>
    <br />
    <br />
    <a href="https://mescontacts.ca/recherche">Rechercher</a>
    ·
    <a href="https://github.com/your-username/mes-contacts/issues">Signaler un bug</a>
  </p>
</p>

## À propos

Mescontacts.ca est un annuaire québécois permettant aux utilisateurs de trouver facilement des entreprises et services de confiance près de chez eux. Les annonces sont créées et gérées exclusivement par des administrateurs pour garantir la qualité du contenu.

### Fonctionnalités

- Recherche par catégorie, ville et province
- Fiches détaillées avec coordonnées, description et photos
- Carte interactive (Mapbox) pour localiser les services
- Système d'administration complet pour gérer les annonces
- Authentification sécurisée avec Clerk
- Upload de médias via Bunny CDN

## Technologies

| Frontend | Backend | Infrastructure |
|----------|---------|----------------|
| [Next.js 16](https://nextjs.org/) (App Router) | [Convex](https://convex.dev/) (temps réel) | [Vercel](https://vercel.com/) |
| [React 19](https://react.dev/) | [Clerk](https://clerk.com/) (auth) | [Bunny CDN](https://bunny.net/) |
| [TypeScript](https://www.typescriptlang.org/) | [Zod](https://zod.dev/) (validation) | [Sentry](https://sentry.io/) |
| [TailwindCSS 4](https://tailwindcss.com/) | | |
| [shadcn/ui](https://ui.shadcn.com/) | | |
| [Mapbox GL](https://www.mapbox.com/) | | |

## Démarrage rapide

### Prérequis

- Node.js 20+
- npm ou pnpm
- Compte [Convex](https://convex.dev/)
- Compte [Clerk](https://clerk.com/)
- Token API [Mapbox](https://www.mapbox.com/)
- (Optionnel) Compte [Bunny CDN](https://bunny.net/)

### Installation

1. **Cloner le repo**
   ```bash
   git clone https://github.com/your-username/mes-contacts.git
   cd mes-contacts
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Configurer les variables d'environnement**
   ```bash
   cp .env.example .env.local
   ```

4. **Configurer Convex**
   ```bash
   npx convex dev
   ```

5. **Lancer le serveur de développement**
   ```bash
   npm run dev
   ```

   Ouvrir [http://localhost:3000](http://localhost:3000)

### Variables d'environnement

```env
# Convex
CONVEX_DEPLOYMENT=
NEXT_PUBLIC_CONVEX_URL=

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
CLERK_WEBHOOK_SECRET=

# Mapbox
NEXT_PUBLIC_MAPBOX_TOKEN=

# Bunny CDN (optionnel)
BUNNY_API_KEY=
BUNNY_STORAGE_ZONE=
BUNNY_STORAGE_PASSWORD=
NEXT_PUBLIC_BUNNY_CDN_URL=

# Sentry (optionnel)
SENTRY_AUTH_TOKEN=
NEXT_PUBLIC_SENTRY_DSN=
```

## Scripts

| Commande | Description |
|----------|-------------|
| `npm run dev` | Démarre Next.js + Convex en mode développement |
| `npm run build` | Build de production |
| `npm run build-check` | Vérifie TypeScript + ESLint (avant commit) |
| `npm run test` | Lance les tests avec Vitest |
| `npm run test:coverage` | Tests avec rapport de couverture |
| `npm run lint` | Vérifie le linting |
| `npm run fix-lint` | Corrige automatiquement le linting |

## Structure du projet

```
mes-contacts/
├── app/
│   ├── (app-pages)/        # Pages publiques (accueil, recherche, annonces)
│   ├── (admin)/admin/      # Dashboard admin (ADMIN only)
│   └── api/                # Webhooks (Clerk)
│
├── convex/
│   ├── schema.ts           # Schéma de la DB (source de vérité)
│   ├── lib/                # Auth, validation, helpers
│   └── *.ts                # Queries et mutations
│
├── components/
│   ├── ui/                 # Composants shadcn/ui
│   ├── admin/              # Composants admin
│   └── shared/             # Header, Footer, uploads, etc.
│
├── schemas/                # Schémas Zod (validation formulaires)
├── hooks/                  # Hooks personnalisés
├── constants/              # Catégories, provinces, etc.
└── tests/                  # Tests Vitest
```

## Catégories de services

- Plombier
- Électricien
- Homme à tout faire
- REEE (Régime Enregistré d'Épargne-Études)
- Courtier Hypothécaire
- Courtier Immobilier
- Assurance
- Association Communautaire
- Tutorat
- Psychothérapie

## Contribution

Les contributions sont les bienvenues !

1. Fork le projet
2. Créer une branche (`git checkout -b feature/nouvelle-fonctionnalite`)
3. Commit les changements (`git commit -m 'Ajouter nouvelle fonctionnalité'`)
4. Push la branche (`git push origin feature/nouvelle-fonctionnalite`)
5. Ouvrir une Pull Request

Assurez-vous de lancer `npm run build-check` avant de soumettre.

## Licence

Distribué sous licence MIT. Voir `LICENSE` pour plus d'informations.

## Contact

**Mescontacts.ca**

- Site web : [https://mescontacts.ca](https://mescontacts.ca)
- GitHub : [https://github.com/your-username/mes-contacts](https://github.com/your-username/mes-contacts)

---

<p align="center">
  Fait avec ❤️ au Québec
</p>
