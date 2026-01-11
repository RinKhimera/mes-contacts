"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowRight, MapPin, Search, Sparkles } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

export function Hero() {
  const router = useRouter()
  const [service, setService] = useState("")
  const [location, setLocation] = useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()

    const params = new URLSearchParams()
    if (service.trim()) params.set("q", service.trim())
    if (location.trim()) params.set("city", location.trim())

    const queryString = params.toString()
    router.push(`/recherche${queryString ? `?${queryString}` : ""}`)
  }

  const popularSearches = [
    "Plombier",
    "Électricien",
    "Courtier immobilier",
    "Assurance",
  ]

  return (
    <section className="relative min-h-[90vh] overflow-hidden">
      {/* Background layers */}
      <div className="absolute inset-0 topo-pattern" />
      <div className="noise-overlay absolute inset-0" />

      {/* Decorative elements */}
      <div className="absolute top-20 left-[10%] h-72 w-72 rounded-full bg-primary/10 blur-3xl animate-fade-in" />
      <div className="absolute bottom-20 right-[15%] h-96 w-96 rounded-full bg-accent/10 blur-3xl animate-fade-in delay-300" />

      {/* Floating maple leaf accent */}
      <div className="absolute top-32 right-[20%] hidden lg:block animate-float">
        <svg width="48" height="48" viewBox="0 0 24 24" className="text-destructive/20">
          <path fill="currentColor" d="M12 2L9.5 8.5L2 9L7 14L5.5 22L12 18L18.5 22L17 14L22 9L14.5 8.5L12 2Z"/>
        </svg>
      </div>

      <div className="relative container mx-auto px-4 pt-16 pb-24 md:pt-24 md:pb-32 lg:pt-32 lg:pb-40">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
          {/* Left content */}
          <div className="lg:col-span-7 xl:col-span-6">
            {/* Badge */}
            <div className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-border/50 bg-card px-4 py-2 shadow-sm">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-destructive/10">
                <span className="text-sm">🍁</span>
              </span>
              <span className="text-sm font-medium text-muted-foreground">
                L&apos;annuaire canadien de confiance
              </span>
            </div>

            {/* Main headline */}
            <h1 className="animate-fade-up delay-100 mt-8 font-display text-5xl font-bold leading-[1.1] tracking-tight sm:text-6xl md:text-7xl lg:text-[5.5rem]">
              Trouvez les{" "}
              <span className="relative inline-block">
                <span className="text-gradient">meilleurs</span>
                <svg className="absolute -bottom-1 left-0 w-full h-3" viewBox="0 0 200 12" fill="none" preserveAspectRatio="none">
                  <path d="M2 8.5C50 2.5 150 2.5 198 8.5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="text-primary/50"/>
                </svg>
              </span>
              <br className="hidden md:block" />
              professionnels
            </h1>

            {/* Subheadline */}
            <p className="animate-fade-up delay-200 mt-6 max-w-xl text-lg text-muted-foreground md:text-xl">
              Des milliers d&apos;entreprises vérifiées au Québec et partout au Canada.
              Trouvez exactement ce dont vous avez besoin, près de chez vous.
            </p>

            {/* Search form */}
            <form
              onSubmit={handleSearch}
              className="animate-fade-up delay-300 mt-10"
            >
              <div className="glass rounded-2xl border border-border/50 p-2 shadow-xl shadow-primary/5">
                <div className="flex flex-col gap-2 lg:flex-row">
                  {/* Service input */}
                  <div className="relative flex flex-1 items-center">
                    <Search className="absolute left-4 h-5 w-5 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Plombier, électricien, courtier..."
                      value={service}
                      onChange={(e) => setService(e.target.value)}
                      className="h-14 border-0 bg-transparent pl-12 text-base placeholder:text-muted-foreground/60 focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                  </div>

                  {/* Divider */}
                  <div className="hidden h-14 w-px bg-border/50 lg:block" />

                  {/* Location input */}
                  <div className="relative flex flex-1 items-center">
                    <MapPin className="absolute left-4 h-5 w-5 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Ville ou code postal"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="h-14 border-0 bg-transparent pl-12 text-base placeholder:text-muted-foreground/60 focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                  </div>

                  {/* Submit button */}
                  <Button
                    type="submit"
                    size="lg"
                    className="h-14 gap-2 rounded-xl px-8 text-base font-semibold shadow-lg shadow-primary/20 transition-all hover:shadow-xl hover:shadow-primary/30"
                  >
                    Rechercher
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </form>

            {/* Popular searches */}
            <div className="animate-fade-up delay-400 mt-6 flex flex-wrap items-center gap-3">
              <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Sparkles className="h-3.5 w-3.5" />
                Populaire:
              </span>
              {popularSearches.map((tag, index) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => {
                    setService(tag)
                    router.push(`/recherche?q=${encodeURIComponent(tag)}`)
                  }}
                  className="rounded-full border border-border/50 bg-card px-4 py-1.5 text-sm font-medium transition-all hover:border-primary hover:bg-primary hover:text-primary-foreground"
                  style={{ animationDelay: `${400 + index * 50}ms` }}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Right decorative cards */}
          <div className="hidden lg:col-span-5 xl:col-span-6 lg:flex lg:justify-end">
            <div className="relative w-full max-w-md">
              {/* Background card */}
              <div className="animate-slide-right delay-500 absolute -top-4 -left-4 h-64 w-64 rounded-3xl border border-border/30 bg-secondary/50" />

              {/* Main card */}
              <div className="animate-slide-right delay-300 relative rounded-3xl border border-border/50 bg-card p-8 shadow-2xl shadow-foreground/5">
                <div className="mb-6 flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                    <span className="text-2xl">🏠</span>
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-semibold">Marie Tremblay</h3>
                    <p className="text-sm text-muted-foreground">Courtière immobilière</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span className="text-muted-foreground">Montréal, QC</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="h-4 w-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                    <span className="ml-1 text-sm font-medium">5.0</span>
                    <span className="text-sm text-muted-foreground">(127 avis)</span>
                  </div>
                </div>

                <div className="mt-6 flex gap-3">
                  <Button size="sm" className="flex-1 rounded-xl">
                    Contacter
                  </Button>
                  <Button size="sm" variant="outline" className="rounded-xl">
                    Voir profil
                  </Button>
                </div>
              </div>

              {/* Stats floating card */}
              <div className="animate-slide-right delay-700 absolute -right-8 -bottom-8 rounded-2xl border border-border/50 bg-card p-5 shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-display text-2xl font-bold">10K+</div>
                    <div className="text-xs text-muted-foreground">Entreprises inscrites</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute right-0 bottom-0 left-0">
        <svg viewBox="0 0 1440 80" fill="none" className="w-full">
          <path
            d="M0 40L48 36C96 32 192 24 288 26.7C384 30 480 42 576 45.3C672 48 768 44 864 38.7C960 34 1056 28 1152 30.7C1248 34 1344 44 1392 50L1440 56V80H1392C1344 80 1248 80 1152 80C1056 80 960 80 864 80C768 80 672 80 576 80C480 80 384 80 288 80C192 80 96 80 48 80H0V40Z"
            className="fill-background"
          />
        </svg>
      </div>
    </section>
  )
}
