import { Search } from "lucide-react"

export const FirstDashboardCard = () => {
  return (
    <div className="bg-muted/50 @container aspect-video rounded-xl p-2 @[400px]:p-4">
      <div className="flex h-full flex-col">
        {/* Statistiques */}
        <div className="mb-2 @[400px]:mb-4">
          <p className="text-muted-foreground text-xs @[400px]:text-sm">
            Entreprises répertoriées
          </p>
          <h3 className="text-2xl font-bold @[400px]:text-3xl">12,458</h3>
        </div>

        {/* Barre de recherche */}
        <div className="relative mb-3">
          <input
            type="text"
            placeholder="Rechercher une entreprise..."
            className="border-muted bg-background/80 focus:ring-primary w-full rounded-md border p-2 pl-8 text-sm outline-none focus:ring-1"
          />
          <Search className="text-muted-foreground absolute top-2.5 left-2 h-4 w-4" />
        </div>

        {/* Filtres rapides */}
        <div className="mb-1 hidden @[350px]:block">
          <p className="text-muted-foreground mb-1 text-xs">Filtres rapides:</p>
          <div className="flex flex-wrap gap-1">
            <button className="bg-primary/10 text-primary hover:bg-primary/20 rounded px-2 py-0.5 text-xs">
              Restaurants
            </button>
            <button className="bg-primary/10 text-primary hover:bg-primary/20 rounded px-2 py-0.5 text-xs">
              À proximité
            </button>
            <button className="bg-primary/10 text-primary hover:bg-primary/20 rounded px-2 py-0.5 text-xs">
              Bien noté
            </button>
          </div>
        </div>

        {/* Recherches populaires */}
        <div className="mt-auto">
          <p className="text-muted-foreground mb-1 text-xs">
            Recherches populaires:
          </p>
          <div className="flex flex-wrap gap-1">
            <span className="bg-muted/80 rounded px-2 py-0.5 text-xs">
              Restaurant italien
            </span>
            <span className="bg-muted/80 rounded px-2 py-0.5 text-xs">
              Plombier urgence
            </span>
            <span className="bg-muted/80 rounded px-2 py-0.5 text-xs">
              Coiffeur
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
