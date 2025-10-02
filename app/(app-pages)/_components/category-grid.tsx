import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { categoriesServices } from "@/constants"
import {
  Briefcase,
  Building2,
  Hammer,
  Home,
  Lightbulb,
  Shield,
  Users,
  Wrench,
} from "lucide-react"
import Link from "next/link"

// Mapper les catégories avec des icônes appropriées
const categoryIcons: Record<string, React.ReactNode> = {
  Plombier: <Wrench className="h-8 w-8" />,
  Electricien: <Lightbulb className="h-8 w-8" />,
  "Homme à tout faire": <Hammer className="h-8 w-8" />,
  "Régime Enregistré d'Épargne-Études (REEE)": (
    <Briefcase className="h-8 w-8" />
  ),
  "Courtier Hypothécaire": <Home className="h-8 w-8" />,
  "Courtier Immobilier": <Building2 className="h-8 w-8" />,
  Assurance: <Shield className="h-8 w-8" />,
  "Association Communautaire": <Users className="h-8 w-8" />,
}

const categoryDescriptions: Record<string, string> = {
  Plombier: "Installation, réparation et entretien de plomberie",
  Electricien: "Services électriques résidentiels et commerciaux",
  "Homme à tout faire": "Travaux de bricolage et maintenance générale",
  "Régime Enregistré d'Épargne-Études (REEE)":
    "Planification financière pour l'éducation",
  "Courtier Hypothécaire": "Financement et prêts hypothécaires",
  "Courtier Immobilier": "Achat, vente et location de propriétés",
  Assurance: "Protection et couverture d'assurance",
  "Association Communautaire": "Services et organisations communautaires",
}

export function CategoryGrid() {
  return (
    <section className="container mx-auto px-4 py-16 md:py-24">
      <div className="mb-12 text-center">
        <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
          Catégories populaires
        </h2>
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
          Explorez nos catégories les plus recherchées pour trouver rapidement
          les services dont vous avez besoin
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {categoriesServices.map((category) => (
          <Link
            key={category}
            href={`/services/${encodeURIComponent(category)}`}
          >
            <Card className="group h-full transition-all duration-300 hover:border-primary hover:shadow-lg hover:shadow-primary/10">
              <CardHeader>
                <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  {categoryIcons[category] || <Briefcase className="h-8 w-8" />}
                </div>
                <CardTitle className="line-clamp-2 text-xl">
                  {category}
                </CardTitle>
                <CardDescription className="line-clamp-2">
                  {categoryDescriptions[category] ||
                    "Services professionnels de qualité"}
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-12 text-center">
        <Link
          href="/categories"
          className="inline-flex items-center text-lg font-medium text-primary hover:underline"
        >
          Voir toutes les catégories
          <svg
            className="ml-2 h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 8l4 4m0 0l-4 4m4-4H3"
            />
          </svg>
        </Link>
      </div>
    </section>
  )
}
