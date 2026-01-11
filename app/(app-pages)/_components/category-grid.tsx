import { categoriesServices } from "@/constants"
import {
  Briefcase,
  Building2,
  ChevronRight,
  Hammer,
  Home,
  Lightbulb,
  Shield,
  Users,
  Wrench,
} from "lucide-react"
import Link from "next/link"

const categoryData: Record<
  string,
  { icon: React.ReactNode; color: string; bgColor: string }
> = {
  Plombier: {
    icon: <Wrench className="h-6 w-6" />,
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-100 dark:bg-blue-950",
  },
  Electricien: {
    icon: <Lightbulb className="h-6 w-6" />,
    color: "text-amber-600 dark:text-amber-400",
    bgColor: "bg-amber-100 dark:bg-amber-950",
  },
  "Homme à tout faire": {
    icon: <Hammer className="h-6 w-6" />,
    color: "text-orange-600 dark:text-orange-400",
    bgColor: "bg-orange-100 dark:bg-orange-950",
  },
  "Régime Enregistré d'Épargne-Études (REEE)": {
    icon: <Briefcase className="h-6 w-6" />,
    color: "text-purple-600 dark:text-purple-400",
    bgColor: "bg-purple-100 dark:bg-purple-950",
  },
  "Courtier Hypothécaire": {
    icon: <Home className="h-6 w-6" />,
    color: "text-emerald-600 dark:text-emerald-400",
    bgColor: "bg-emerald-100 dark:bg-emerald-950",
  },
  "Courtier Immobilier": {
    icon: <Building2 className="h-6 w-6" />,
    color: "text-sky-600 dark:text-sky-400",
    bgColor: "bg-sky-100 dark:bg-sky-950",
  },
  Assurance: {
    icon: <Shield className="h-6 w-6" />,
    color: "text-rose-600 dark:text-rose-400",
    bgColor: "bg-rose-100 dark:bg-rose-950",
  },
  "Association Communautaire": {
    icon: <Users className="h-6 w-6" />,
    color: "text-teal-600 dark:text-teal-400",
    bgColor: "bg-teal-100 dark:bg-teal-950",
  },
}

const categoryDescriptions: Record<string, string> = {
  Plombier: "Installation, réparation et entretien",
  Electricien: "Services électriques résidentiels",
  "Homme à tout faire": "Travaux et maintenance générale",
  "Régime Enregistré d'Épargne-Études (REEE)": "Planification financière éducation",
  "Courtier Hypothécaire": "Financement et prêts",
  "Courtier Immobilier": "Achat, vente et location",
  Assurance: "Protection et couverture",
  "Association Communautaire": "Services communautaires",
}

export function CategoryGrid() {
  return (
    <section className="relative overflow-hidden py-20 md:py-28">
      {/* Background accent */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/30 to-background" />

      <div className="relative container mx-auto px-4">
        {/* Section header */}
        <div className="mb-16 max-w-2xl">
          <span className="animate-fade-up mb-4 inline-block font-display text-sm font-semibold uppercase tracking-widest text-primary">
            Catégories
          </span>
          <h2 className="animate-fade-up delay-100 font-display text-4xl font-bold leading-tight tracking-tight md:text-5xl">
            Explorez nos services les plus{" "}
            <span className="text-gradient">populaires</span>
          </h2>
          <p className="animate-fade-up delay-200 mt-4 text-lg text-muted-foreground">
            Trouvez rapidement les professionnels dont vous avez besoin parmi nos
            catégories les plus recherchées.
          </p>
        </div>

        {/* Bento grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:grid-rows-2">
          {categoriesServices.slice(0, 8).map((category, index) => {
            const data = categoryData[category] || {
              icon: <Briefcase className="h-6 w-6" />,
              color: "text-primary",
              bgColor: "bg-primary/10",
            }

            // First two items are larger
            const isLarge = index < 2
            const gridClass = isLarge
              ? "lg:col-span-2 lg:row-span-1"
              : "lg:col-span-1 lg:row-span-1"

            return (
              <Link
                key={category}
                href={`/recherche?category=${encodeURIComponent(category)}`}
                className={`animate-fade-up group relative overflow-hidden rounded-2xl border border-border/50 bg-card p-6 transition-all duration-300 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 ${gridClass}`}
                style={{ animationDelay: `${200 + index * 75}ms` }}
              >
                {/* Background gradient on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                <div className="relative flex h-full flex-col justify-between">
                  <div>
                    {/* Icon */}
                    <div
                      className={`mb-4 inline-flex rounded-xl p-3 ${data.bgColor} ${data.color} transition-transform duration-300 group-hover:scale-110`}
                    >
                      {data.icon}
                    </div>

                    {/* Title */}
                    <h3 className="font-display text-lg font-semibold leading-tight md:text-xl">
                      {category.length > 30 ? "REEE" : category}
                    </h3>

                    {/* Description - only on large cards */}
                    {isLarge && (
                      <p className="mt-2 text-sm text-muted-foreground">
                        {categoryDescriptions[category]}
                      </p>
                    )}
                  </div>

                  {/* Arrow indicator */}
                  <div className="mt-4 flex items-center text-sm font-medium text-primary opacity-0 transition-all duration-300 group-hover:opacity-100">
                    <span>Explorer</span>
                    <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>

                {/* Decorative corner element */}
                <div className="absolute -right-4 -bottom-4 h-24 w-24 rounded-full bg-gradient-to-br from-primary/10 to-transparent opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100" />
              </Link>
            )
          })}
        </div>

        {/* View all link */}
        <div className="animate-fade-up delay-700 mt-12 text-center">
          <Link
            href="/recherche"
            className="group inline-flex items-center gap-2 font-display text-lg font-semibold text-foreground transition-colors hover:text-primary"
          >
            <span>Voir toutes les catégories</span>
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 transition-all group-hover:bg-primary group-hover:text-primary-foreground">
              <ChevronRight className="h-4 w-4" />
            </span>
          </Link>
        </div>
      </div>
    </section>
  )
}
