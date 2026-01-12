import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  ArrowLeft,
  Heart,
  Info,
  MapPin,
  Target,
  TrendingUp,
  Users,
} from "lucide-react"
import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "À propos - Mescontacts.ca",
  description:
    "Découvrez Mescontacts.ca, l'annuaire d'affaires qui connecte les entreprises québécoises avec leurs clients.",
}

export default function AProposPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">
          Accueil
        </Link>
        <span>/</span>
        <span className="font-medium text-foreground">À propos</span>
      </nav>

      {/* En-tête */}
      <div className="mb-8">
        <div className="mb-4 flex items-center gap-3">
          <div className="rounded-lg bg-primary/10 p-3">
            <Info className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            À propos de Mescontacts.ca
          </h1>
        </div>
        <p className="text-lg text-muted-foreground">
          L&apos;annuaire d&apos;affaires qui connecte les entreprises
          québécoises avec leurs clients
        </p>
      </div>

      {/* Contenu */}
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Notre histoire */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-primary" />
              Notre histoire
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              Mescontacts.ca est né d&apos;une vision simple mais puissante :
              faciliter la découverte et la mise en relation entre les
              entreprises québécoises et leurs clients potentiels.
            </p>
            <p>
              Dans un monde de plus en plus numérique, nous avons constaté que
              de nombreuses petites et moyennes entreprises du Québec avaient du
              mal à se faire connaître en ligne. Les grandes plateformes
              internationales ne répondaient pas toujours aux besoins
              spécifiques de notre marché local.
            </p>
            <p>
              C&apos;est pourquoi nous avons créé Mescontacts.ca - une
              plateforme 100% québécoise, pensée pour les entreprises d&apos;ici
              et leurs clients.
            </p>
          </CardContent>
        </Card>

        {/* Notre mission */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Notre mission
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              Notre mission est de{" "}
              <strong className="text-foreground">
                rendre visible et accessible
              </strong>{" "}
              chaque entreprise québécoise, quelle que soit sa taille.
            </p>
            <p>Nous nous engageons à :</p>
            <ul className="list-inside list-disc space-y-2 pl-4">
              <li>
                Offrir une plateforme simple et abordable pour publier des
                annonces d&apos;entreprise
              </li>
              <li>
                Faciliter la recherche d&apos;entreprises locales par catégorie,
                ville ou région
              </li>
              <li>
                Maintenir un annuaire de qualité avec des informations à jour et
                vérifiées
              </li>
              <li>
                Soutenir l&apos;économie locale en favorisant les commerces de
                proximité
              </li>
              <li>
                Fournir une expérience utilisateur optimale, tant pour les
                entreprises que pour les consommateurs
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Nos valeurs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Nos valeurs
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-muted-foreground">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <h4 className="font-semibold text-foreground">
                  🤝 Accessibilité
                </h4>
                <p className="text-sm">
                  Nous croyons que chaque entreprise mérite d&apos;être visible,
                  peu importe sa taille ou son budget.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-foreground">🎯 Simplicité</h4>
                <p className="text-sm">
                  Notre plateforme est conçue pour être intuitive et facile à
                  utiliser, sans complications inutiles.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-foreground">🛡️ Fiabilité</h4>
                <p className="text-sm">
                  Nous maintenons des standards élevés pour assurer la qualité
                  et l&apos;exactitude des informations.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-foreground">🌱 Local</h4>
                <p className="text-sm">
                  Nous sommes fiers de soutenir l&apos;économie québécoise et de
                  promouvoir l&apos;achat local.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-foreground">🔐 Confiance</h4>
                <p className="text-sm">
                  La protection de vos données et le respect de votre vie privée
                  sont nos priorités.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-foreground">💡 Innovation</h4>
                <p className="text-sm">
                  Nous améliorons constamment notre plateforme pour répondre aux
                  besoins évolutifs de nos utilisateurs.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Ce qui nous distingue */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Ce qui nous distingue
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <ul className="space-y-3">
              <li className="flex gap-3">
                <span className="text-primary">✓</span>
                <div>
                  <strong className="text-foreground">
                    Plateforme 100% québécoise
                  </strong>{" "}
                  - Conçue spécifiquement pour le marché québécois avec un
                  support en français
                </div>
              </li>
              <li className="flex gap-3">
                <span className="text-primary">✓</span>
                <div>
                  <strong className="text-foreground">
                    Géolocalisation précise
                  </strong>{" "}
                  - Trouvez facilement des entreprises près de chez vous grâce à
                  notre système de cartes interactives
                </div>
              </li>
              <li className="flex gap-3">
                <span className="text-primary">✓</span>
                <div>
                  <strong className="text-foreground">
                    Publication permanente
                  </strong>{" "}
                  - Un seul paiement pour une annonce qui reste active
                  indéfiniment
                </div>
              </li>
              <li className="flex gap-3">
                <span className="text-primary">✓</span>
                <div>
                  <strong className="text-foreground">
                    Interface moderne et responsive
                  </strong>{" "}
                  - Accessible sur tous les appareils : ordinateur, tablette,
                  mobile
                </div>
              </li>
              <li className="flex gap-3">
                <span className="text-primary">✓</span>
                <div>
                  <strong className="text-foreground">Recherche avancée</strong>{" "}
                  - Filtrez par catégorie, ville, province pour trouver
                  exactement ce que vous cherchez
                </div>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Pour les entreprises */}
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              Pourquoi choisir Mescontacts.ca pour votre entreprise ?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <h4 className="font-semibold text-foreground">
                  📈 Augmentez votre visibilité
                </h4>
                <p className="text-sm">
                  Soyez trouvé par des milliers de clients potentiels qui
                  cherchent vos services.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-foreground">
                  💰 Tarif unique et abordable
                </h4>
                <p className="text-sm">
                  Un seul paiement, aucun frais récurrent. Votre annonce reste
                  active aussi longtemps que vous le souhaitez.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-foreground">
                  ⚡ Publication instantanée
                </h4>
                <p className="text-sm">
                  Créez votre annonce en quelques minutes et commencez à
                  recevoir des contacts immédiatement.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-foreground">
                  🎨 Contrôle total
                </h4>
                <p className="text-sm">
                  Modifiez vos informations à tout moment depuis votre tableau
                  de bord personnel.
                </p>
              </div>
            </div>

            <div className="pt-4">
              <Button asChild size="lg" className="w-full sm:w-auto">
                <Link href="/dashboard">Publier mon annonce →</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Notre engagement */}
        <Card>
          <CardHeader>
            <CardTitle>Notre engagement envers vous</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              Que vous soyez une entreprise cherchant à se faire connaître ou un
              consommateur à la recherche de services locaux, nous nous
              engageons à :
            </p>
            <ul className="list-inside list-disc space-y-2 pl-4">
              <li>Maintenir une plateforme fiable et performante 24/7</li>
              <li>
                Protéger vos données personnelles avec les plus hauts standards
                de sécurité
              </li>
              <li>
                Offrir un support client réactif et francophone pour répondre à
                vos questions
              </li>
              <li>
                Améliorer continuellement nos services en fonction de vos
                retours
              </li>
              <li>
                Promouvoir l&apos;économie locale et les commerces de proximité
              </li>
            </ul>
          </CardContent>
        </Card>

        <Separator />

        {/* Call to action */}
        <div className="rounded-lg border bg-muted/50 p-6 text-center">
          <h3 className="mb-3 text-xl font-semibold">
            Prêt à faire partie de la communauté ?
          </h3>
          <p className="mb-6 text-muted-foreground">
            Rejoignez des centaines d&apos;entreprises québécoises qui font
            confiance à Mescontacts.ca
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button asChild size="lg">
              <Link href="/dashboard">Créer mon annonce</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/recherche">Explorer les annonces</Link>
            </Button>
          </div>
        </div>

        <Separator />

        <div className="flex justify-center pt-4">
          <Button asChild variant="outline" size="lg">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour à l&apos;accueil
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
