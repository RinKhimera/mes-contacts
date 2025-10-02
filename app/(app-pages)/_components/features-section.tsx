import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle2, Shield, Star, Zap } from "lucide-react"

const features = [
  {
    icon: <Shield className="h-12 w-12" />,
    title: "Entreprises vérifiées",
    description:
      "Tous les professionnels sont vérifiés pour garantir votre sécurité et votre satisfaction",
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-100 dark:bg-blue-950",
  },
  {
    icon: <Star className="h-12 w-12" />,
    title: "Avis authentiques",
    description:
      "Consultez les évaluations et commentaires réels de clients pour faire le bon choix",
    color: "text-yellow-600 dark:text-yellow-400",
    bgColor: "bg-yellow-100 dark:bg-yellow-950",
  },
  {
    icon: <Zap className="h-12 w-12" />,
    title: "Résultats instantanés",
    description:
      "Trouvez rapidement les services dont vous avez besoin grâce à notre recherche optimisée",
    color: "text-purple-600 dark:text-purple-400",
    bgColor: "bg-purple-100 dark:bg-purple-950",
  },
  {
    icon: <CheckCircle2 className="h-12 w-12" />,
    title: "100% gratuit",
    description:
      "Recherchez et contactez des professionnels sans frais cachés, totalement gratuit",
    color: "text-green-600 dark:text-green-400",
    bgColor: "bg-green-100 dark:bg-green-950",
  },
]

export function FeaturesSection() {
  return (
    <section className="bg-muted/30 py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
            Pourquoi choisir Mescontacts.ca ?
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            La plateforme de confiance pour trouver les meilleurs professionnels
            au Québec et partout au Canada
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="group border-0 bg-background shadow-lg transition-all duration-300 hover:shadow-xl"
            >
              <CardContent className="p-6">
                <div
                  className={`mb-4 inline-flex rounded-xl p-3 ${feature.bgColor} ${feature.color}`}
                >
                  {feature.icon}
                </div>
                <h3 className="mb-2 text-xl font-semibold">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Section statistiques */}
        <div className="mt-16 grid gap-8 text-center sm:grid-cols-3">
          <div>
            <div className="mb-2 text-4xl font-bold text-primary md:text-5xl">
              10,000+
            </div>
            <div className="text-lg text-muted-foreground">
              Entreprises inscrites
            </div>
          </div>
          <div>
            <div className="mb-2 text-4xl font-bold text-primary md:text-5xl">
              50,000+
            </div>
            <div className="text-lg text-muted-foreground">Avis vérifiés</div>
          </div>
          <div>
            <div className="mb-2 text-4xl font-bold text-primary md:text-5xl">
              100%
            </div>
            <div className="text-lg text-muted-foreground">
              Gratuit pour les utilisateurs
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
