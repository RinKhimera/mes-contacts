"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MapPin, Search } from "lucide-react"
import { useState } from "react"

export function Hero() {
  const [service, setService] = useState("")
  const [location, setLocation] = useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implémenter la logique de recherche
    console.log("Recherche:", { service, location })
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background">
      <div className="bg-grid-slate-200/50 dark:bg-grid-slate-800/50 absolute inset-0 [mask-image:linear-gradient(0deg,transparent,black)]" />

      <div className="relative container mx-auto px-4 py-16 md:py-24 lg:py-32">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center rounded-full border bg-background px-4 py-1.5 text-sm font-medium shadow-sm">
            <span className="mr-2">🇨🇦</span>
            L&apos;annuaire québécois de confiance
          </div>

          {/* Titre principal */}
          <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            Trouvez les{" "}
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              meilleurs services
            </span>{" "}
            près de chez vous
          </h1>

          {/* Sous-titre */}
          <p className="mb-10 text-lg text-muted-foreground md:text-xl">
            Des milliers d&apos;entreprises et de professionnels vérifiés au
            Québec et partout au Canada. Trouvez exactement ce dont vous avez
            besoin.
          </p>

          {/* Barre de recherche */}
          <form
            onSubmit={handleSearch}
            className="mx-auto mb-8 max-w-3xl rounded-xl border bg-background p-2 shadow-2xl shadow-primary/10"
          >
            <div className="flex flex-col gap-2 md:flex-row">
              {/* Champ Service */}
              <div className="relative flex flex-1 items-center">
                <Search className="absolute left-3 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Plombier, électricien, courtier..."
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  className="h-14 border-0 pl-10 text-base focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              </div>

              {/* Séparateur */}
              <div className="hidden h-14 w-px bg-border md:block" />

              {/* Champ Localisation */}
              <div className="relative flex flex-1 items-center">
                <MapPin className="absolute left-3 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Ville ou code postal"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="h-14 border-0 pl-10 text-base focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              </div>

              {/* Bouton de recherche */}
              <Button type="submit" size="lg" className="h-14 px-8 text-base">
                <Search className="mr-2 h-5 w-5" />
                Rechercher
              </Button>
            </div>
          </form>

          {/* Tags populaires */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="text-sm text-muted-foreground">Populaire:</span>
            {[
              "Plombier",
              "Électricien",
              "Courtier immobilier",
              "Assurance",
            ].map((tag) => (
              <button
                key={tag}
                type="button"
                className="rounded-full bg-muted px-4 py-1.5 text-sm font-medium transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Effet de vague en bas */}
      <div className="absolute right-0 bottom-0 left-0">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full"
        >
          <path
            d="M0 0L60 10C120 20 240 40 360 46.7C480 53 600 47 720 43.3C840 40 960 40 1080 46.7C1200 53 1320 67 1380 73.3L1440 80V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V0Z"
            className="fill-background"
          />
        </svg>
      </div>
    </section>
  )
}
