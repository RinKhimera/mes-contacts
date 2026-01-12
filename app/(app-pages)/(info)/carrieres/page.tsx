import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  ArrowLeft,
  Briefcase,
  CheckCircle2,
  Heart,
  Mail,
  Rocket,
  TrendingUp,
  Users,
} from "lucide-react"
import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Carrières - Mescontacts.ca",
  description:
    "Rejoignez l'équipe de Mescontacts.ca et contribuez à connecter les entreprises québécoises avec leurs clients.",
}

export default function CarrieresPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">
          Accueil
        </Link>
        <span>/</span>
        <span className="font-medium text-foreground">Carrières</span>
      </nav>

      {/* En-tête */}
      <div className="mb-8">
        <div className="mb-4 flex items-center gap-3">
          <div className="rounded-lg bg-primary/10 p-3">
            <Briefcase className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            Carrières chez Mescontacts.ca
          </h1>
        </div>
        <p className="text-lg text-muted-foreground">
          Rejoignez une équipe passionnée qui transforme la manière dont les
          entreprises québécoises se connectent avec leurs clients
        </p>
      </div>

      {/* Contenu */}
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Pourquoi nous rejoindre */}
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Rocket className="h-5 w-5 text-primary" />
              Pourquoi rejoindre Mescontacts.ca ?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              Chez Mescontacts.ca, nous croyons que notre succès repose sur la
              qualité et la passion de notre équipe. Nous recherchons des
              personnes talentueuses qui partagent notre vision de soutenir
              l&apos;économie locale québécoise.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex gap-3">
                <CheckCircle2 className="h-5 w-5 shrink-0 text-primary" />
                <div>
                  <h4 className="font-semibold text-foreground">
                    Impact significatif
                  </h4>
                  <p className="text-sm">
                    Contribuez directement au succès des entreprises québécoises
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <CheckCircle2 className="h-5 w-5 shrink-0 text-primary" />
                <div>
                  <h4 className="font-semibold text-foreground">
                    Technologies modernes
                  </h4>
                  <p className="text-sm">
                    Travaillez avec Next.js, React, TypeScript, et plus encore
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <CheckCircle2 className="h-5 w-5 shrink-0 text-primary" />
                <div>
                  <h4 className="font-semibold text-foreground">Flexibilité</h4>
                  <p className="text-sm">
                    Télétravail possible et horaires flexibles
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <CheckCircle2 className="h-5 w-5 shrink-0 text-primary" />
                <div>
                  <h4 className="font-semibold text-foreground">Croissance</h4>
                  <p className="text-sm">
                    Opportunités de développement professionnel et de formation
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <CheckCircle2 className="h-5 w-5 shrink-0 text-primary" />
                <div>
                  <h4 className="font-semibold text-foreground">
                    Équipe soudée
                  </h4>
                  <p className="text-sm">
                    Environnement collaboratif et bienveillant
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <CheckCircle2 className="h-5 w-5 shrink-0 text-primary" />
                <div>
                  <h4 className="font-semibold text-foreground">
                    Avantages sociaux
                  </h4>
                  <p className="text-sm">
                    Assurances collectives et REER collectif
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Postes disponibles */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Postes actuellement disponibles
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Poste 1 */}
            <div className="space-y-3 rounded-lg border p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold">
                    Développeur(se) Full Stack
                  </h3>
                  <div className="mt-1 flex flex-wrap gap-2 text-sm text-muted-foreground">
                    <span className="rounded-full bg-primary/10 px-3 py-1">
                      Temps plein
                    </span>
                    <span className="rounded-full bg-primary/10 px-3 py-1">
                      Hybride / Télétravail
                    </span>
                    <span className="rounded-full bg-primary/10 px-3 py-1">
                      Montréal, QC
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-sm text-muted-foreground">
                Nous recherchons un(e) développeur(se) Full Stack passionné(e)
                pour rejoindre notre équipe. Vous travaillerez sur
                l&apos;amélioration et l&apos;évolution de notre plateforme avec
                Next.js, React, TypeScript, et Convex.
              </p>

              <div className="space-y-2">
                <h4 className="text-sm font-semibold">Responsabilités :</h4>
                <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
                  <li>
                    Développer de nouvelles fonctionnalités pour la plateforme
                  </li>
                  <li>Optimiser les performances et l&apos;UX</li>
                  <li>Collaborer avec l&apos;équipe design et produit</li>
                  <li>Maintenir et améliorer le code existant</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-semibold">Qualifications :</h4>
                <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
                  <li>
                    3+ ans d&apos;expérience en développement web (React,
                    TypeScript)
                  </li>
                  <li>Expérience avec Next.js (un atout majeur)</li>
                  <li>Maîtrise du français et de l&apos;anglais</li>
                  <li>Passion pour le code propre et les bonnes pratiques</li>
                </ul>
              </div>

              <Button asChild className="w-full sm:w-auto">
                <Link href="/contact?subject=Candidature - Développeur Full Stack">
                  <Mail className="mr-2 h-4 w-4" />
                  Postuler
                </Link>
              </Button>
            </div>

            {/* Poste 2 */}
            <div className="space-y-3 rounded-lg border p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold">
                    Spécialiste Marketing Digital
                  </h3>
                  <div className="mt-1 flex flex-wrap gap-2 text-sm text-muted-foreground">
                    <span className="rounded-full bg-primary/10 px-3 py-1">
                      Temps plein
                    </span>
                    <span className="rounded-full bg-primary/10 px-3 py-1">
                      Télétravail
                    </span>
                    <span className="rounded-full bg-primary/10 px-3 py-1">
                      Québec
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-sm text-muted-foreground">
                Rejoignez notre équipe en tant que spécialiste marketing digital
                pour développer notre présence en ligne et attirer de nouvelles
                entreprises sur notre plateforme.
              </p>

              <div className="space-y-2">
                <h4 className="text-sm font-semibold">Responsabilités :</h4>
                <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
                  <li>Développer et exécuter des stratégies marketing</li>
                  <li>Gérer les campagnes publicitaires en ligne</li>
                  <li>Créer du contenu engageant pour les médias sociaux</li>
                  <li>Analyser les performances et optimiser les campagnes</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-semibold">Qualifications :</h4>
                <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
                  <li>2+ ans d&apos;expérience en marketing digital</li>
                  <li>
                    Connaissance des outils (Google Analytics, Meta Ads, etc.)
                  </li>
                  <li>Excellentes compétences rédactionnelles en français</li>
                  <li>Créativité et sens de l&apos;initiative</li>
                </ul>
              </div>

              <Button asChild className="w-full sm:w-auto">
                <Link href="/contact?subject=Candidature - Spécialiste Marketing Digital">
                  <Mail className="mr-2 h-4 w-4" />
                  Postuler
                </Link>
              </Button>
            </div>

            {/* Poste 3 */}
            <div className="space-y-3 rounded-lg border p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold">
                    Agent(e) de Support Client
                  </h3>
                  <div className="mt-1 flex flex-wrap gap-2 text-sm text-muted-foreground">
                    <span className="rounded-full bg-primary/10 px-3 py-1">
                      Temps partiel / Temps plein
                    </span>
                    <span className="rounded-full bg-primary/10 px-3 py-1">
                      Télétravail
                    </span>
                    <span className="rounded-full bg-primary/10 px-3 py-1">
                      Québec
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-sm text-muted-foreground">
                Nous cherchons un(e) agent(e) de support client bilingue pour
                aider nos utilisateurs et assurer une expérience exceptionnelle
                sur notre plateforme.
              </p>

              <div className="space-y-2">
                <h4 className="text-sm font-semibold">Responsabilités :</h4>
                <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
                  <li>Répondre aux questions des utilisateurs par courriel</li>
                  <li>Aider les entreprises à créer et gérer leurs annonces</li>
                  <li>Résoudre les problèmes techniques de base</li>
                  <li>Collecter les retours pour améliorer la plateforme</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-semibold">Qualifications :</h4>
                <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
                  <li>
                    Excellentes compétences en communication (français et
                    anglais)
                  </li>
                  <li>Expérience en service client (un atout)</li>
                  <li>Patience et empathie envers les utilisateurs</li>
                  <li>Capacité à travailler de manière autonome</li>
                </ul>
              </div>

              <Button asChild className="w-full sm:w-auto">
                <Link href="/contact?subject=Candidature - Agent Support Client">
                  <Mail className="mr-2 h-4 w-4" />
                  Postuler
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Culture d'entreprise */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-primary" />
              Notre culture d&apos;entreprise
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              Chez Mescontacts.ca, nous cultivons un environnement où chacun
              peut s&apos;épanouir professionnellement tout en maintenant un
              équilibre vie professionnelle/personnelle.
            </p>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <h4 className="font-semibold text-foreground">🎯 Innovation</h4>
                <p className="text-sm">
                  Nous encourageons la créativité et l&apos;expérimentation
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-foreground">
                  🤝 Collaboration
                </h4>
                <p className="text-sm">
                  Travail d&apos;équipe et communication ouverte
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-foreground">
                  📚 Apprentissage
                </h4>
                <p className="text-sm">
                  Formation continue et développement des compétences
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-foreground">⚖️ Équilibre</h4>
                <p className="text-sm">
                  Horaires flexibles et respect du temps personnel
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-foreground">
                  🌱 Impact local
                </h4>
                <p className="text-sm">
                  Fierté de soutenir l&apos;économie québécoise
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-foreground">
                  🎉 Reconnaissance
                </h4>
                <p className="text-sm">
                  Valorisation des réussites et contributions
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Candidature spontanée */}
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Vous ne trouvez pas le poste idéal ?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              Nous sommes toujours à la recherche de talents exceptionnels.
              N&apos;hésitez pas à nous envoyer votre candidature spontanée si
              vous pensez pouvoir contribuer à notre mission.
            </p>
            <p>
              Envoyez votre CV et une lettre de motivation expliquant comment
              vous pourriez apporter de la valeur à Mescontacts.ca.
            </p>
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link href="/contact?subject=Candidature spontanée">
                <Mail className="mr-2 h-4 w-4" />
                Envoyer une candidature spontanée
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Processus de recrutement */}
        <Card>
          <CardHeader>
            <CardTitle>Notre processus de recrutement</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                  1
                </div>
                <div>
                  <h4 className="font-semibold">Candidature</h4>
                  <p className="text-sm text-muted-foreground">
                    Envoyez votre CV et lettre de motivation via notre
                    formulaire de contact
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                  2
                </div>
                <div>
                  <h4 className="font-semibold">Présélection</h4>
                  <p className="text-sm text-muted-foreground">
                    Notre équipe RH examine votre profil (délai : 1-2 semaines)
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                  3
                </div>
                <div>
                  <h4 className="font-semibold">Entrevue initiale</h4>
                  <p className="text-sm text-muted-foreground">
                    Appel vidéo de 30 minutes pour faire connaissance
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                  4
                </div>
                <div>
                  <h4 className="font-semibold">Test technique / Projet</h4>
                  <p className="text-sm text-muted-foreground">
                    Évaluation de vos compétences (pour postes techniques)
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                  5
                </div>
                <div>
                  <h4 className="font-semibold">Entrevue finale</h4>
                  <p className="text-sm text-muted-foreground">
                    Rencontre avec l&apos;équipe et discussion de l&apos;offre
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                  6
                </div>
                <div>
                  <h4 className="font-semibold">Offre et intégration</h4>
                  <p className="text-sm text-muted-foreground">
                    Bienvenue dans l&apos;équipe! 🎉
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

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
