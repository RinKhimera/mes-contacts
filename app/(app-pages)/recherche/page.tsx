import { SearchFilters } from "./_components/search-filters"
import { SearchResults } from "./_components/search-results"

export default function RecherchePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* En-tête */}
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold tracking-tight md:text-4xl">
          Recherche d&apos;entreprises et services
        </h1>
        <p className="text-lg text-muted-foreground">
          Trouvez les meilleurs professionnels près de chez vous
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Filtres - Sidebar sur desktop */}
        <aside className="lg:col-span-4 xl:col-span-3">
          <div className="lg:sticky lg:top-20">
            <SearchFilters />
          </div>
        </aside>

        {/* Résultats */}
        <main className="lg:col-span-8 xl:col-span-9">
          <SearchResults />
        </main>
      </div>
    </div>
  )
}
