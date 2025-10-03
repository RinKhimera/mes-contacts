import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Suspense } from "react"
import { SearchFilters } from "./_components/search-filters"
import { SearchResults } from "./_components/search-results"

const SearchResultsSkeleton = () => {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {[...Array(6)].map((_, i) => (
        <Card key={i} className="overflow-hidden">
          <Skeleton className="aspect-video w-full" />
          <CardContent className="space-y-3 p-4">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

const SearchFiltersSkeleton = () => {
  return (
    <div className="rounded-lg border bg-card p-6 shadow-sm">
      <Skeleton className="mb-4 h-6 w-48" />
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  )
}

const RecherchePage = () => {
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
            <Suspense fallback={<SearchFiltersSkeleton />}>
              <SearchFilters />
            </Suspense>
          </div>
        </aside>

        {/* Résultats */}
        <main className="lg:col-span-8 xl:col-span-9">
          <Suspense fallback={<SearchResultsSkeleton />}>
            <SearchResults />
          </Suspense>
        </main>
      </div>
    </div>
  )
}

export default RecherchePage
