import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Cookie } from "lucide-react"
import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Politique des cookies - Mescontacts.ca",
  description:
    "Découvrez comment Mescontacts.ca utilise les cookies et technologies similaires pour améliorer votre expérience.",
}

export default function PolitiqueCookiesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">
          Accueil
        </Link>
        <span>/</span>
        <span className="font-medium text-foreground">
          Politique des cookies
        </span>
      </nav>

      {/* En-tête */}
      <div className="mb-8">
        <div className="mb-4 flex items-center gap-3">
          <div className="rounded-lg bg-primary/10 p-3">
            <Cookie className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            Politique des cookies
          </h1>
        </div>
        <p className="text-muted-foreground">
          Dernière mise à jour : 2 octobre 2025
        </p>
      </div>

      {/* Contenu */}
      <div className="mx-auto max-w-4xl space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Qu&apos;est-ce qu&apos;un cookie ?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              Un cookie est un petit fichier texte stocké sur votre appareil
              (ordinateur, tablette, smartphone) lorsque vous visitez un site
              web. Les cookies permettent au site de mémoriser vos actions et
              préférences sur une période donnée.
            </p>
            <p>
              Mescontacts.ca utilise des cookies et des technologies similaires
              pour améliorer votre expérience, assurer la sécurité et analyser
              l&apos;utilisation de notre plateforme.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Types de cookies que nous utilisons</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-muted-foreground">
            <div className="space-y-3">
              <h4 className="font-semibold text-foreground">
                1. Cookies strictement nécessaires
              </h4>
              <p>
                Ces cookies sont essentiels au fonctionnement du site. Ils vous
                permettent de naviguer sur le site et d&apos;utiliser ses
                fonctionnalités.
              </p>
              <ul className="list-inside list-disc space-y-1 pl-4">
                <li>
                  <strong>Authentification (Clerk)</strong> : Maintient votre
                  session utilisateur connectée
                </li>
                <li>
                  <strong>Sécurité</strong> : Protection contre les attaques
                  CSRF et autres menaces
                </li>
                <li>
                  <strong>Préférences de base</strong> : Mémorisation de vos
                  choix essentiels
                </li>
              </ul>
              <p className="text-sm italic">
                Ces cookies ne peuvent pas être désactivés car ils sont
                nécessaires au fonctionnement du site.
              </p>
            </div>

            <Separator />

            <div className="space-y-3">
              <h4 className="font-semibold text-foreground">
                2. Cookies de préférence
              </h4>
              <p>
                Ces cookies permettent au site de mémoriser vos préférences et
                de personnaliser votre expérience.
              </p>
              <ul className="list-inside list-disc space-y-1 pl-4">
                <li>
                  <strong>Thème</strong> : Mémorisation de votre choix de thème
                  (clair/sombre)
                </li>
                <li>
                  <strong>Langue</strong> : Préférence linguistique
                </li>
                <li>
                  <strong>Paramètres d&apos;affichage</strong> : Configuration
                  de l&apos;interface
                </li>
              </ul>
            </div>

            <Separator />

            <div className="space-y-3">
              <h4 className="font-semibold text-foreground">
                3. Cookies de performance et d&apos;analyse
              </h4>
              <p>
                Ces cookies nous aident à comprendre comment les visiteurs
                utilisent notre site pour l&apos;améliorer.
              </p>
              <ul className="list-inside list-disc space-y-1 pl-4">
                <li>
                  <strong>Analyse d&apos;audience</strong> : Nombre de
                  visiteurs, pages vues, durée des visites
                </li>
                <li>
                  <strong>Comportement utilisateur</strong> : Comment vous
                  naviguez sur le site
                </li>
                <li>
                  <strong>Performance</strong> : Vitesse de chargement, erreurs
                  techniques
                </li>
              </ul>
              <p className="text-sm">
                Les données collectées sont anonymisées et utilisées uniquement
                à des fins statistiques.
              </p>
            </div>

            <Separator />

            <div className="space-y-3">
              <h4 className="font-semibold text-foreground">
                4. Cookies de fonctionnalité
              </h4>
              <p>
                Ces cookies proviennent de services tiers intégrés à notre
                plateforme.
              </p>
              <ul className="list-inside list-disc space-y-1 pl-4">
                <li>
                  <strong>Mapbox</strong> : Pour afficher les cartes
                  interactives et la géolocalisation
                </li>
                <li>
                  <strong>Stripe</strong> : Pour le traitement sécurisé des
                  paiements
                </li>
                <li>
                  <strong>UploadThing</strong> : Pour la gestion des
                  téléchargements d&apos;images
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Durée de conservation des cookies</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              Les cookies que nous utilisons ont différentes durées de vie :
            </p>
            <ul className="list-inside list-disc space-y-2 pl-4">
              <li>
                <strong>Cookies de session</strong> : Supprimés automatiquement
                lorsque vous fermez votre navigateur
              </li>
              <li>
                <strong>Cookies persistants</strong> : Conservés pendant une
                durée déterminée (de quelques jours à plusieurs mois) selon leur
                fonction
              </li>
            </ul>
            <div className="rounded-lg bg-muted p-4">
              <p className="text-sm">
                <strong className="text-foreground">Exemple :</strong> Le cookie
                d&apos;authentification Clerk reste actif pendant 7 jours
                d&apos;inactivité, tandis que votre préférence de thème est
                conservée pendant 1 an.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cookies tiers</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              Nous utilisons des services tiers qui peuvent déposer leurs
              propres cookies sur votre appareil :
            </p>
            <ul className="list-inside list-disc space-y-2 pl-4">
              <li>
                <strong>Clerk</strong> (clerk.com) - Authentification et gestion
                des comptes
              </li>
              <li>
                <strong>Stripe</strong> (stripe.com) - Traitement des paiements
              </li>
              <li>
                <strong>Mapbox</strong> (mapbox.com) - Services de cartographie
              </li>
              <li>
                <strong>Convex</strong> (convex.dev) - Backend et base de
                données
              </li>
            </ul>
            <p>
              Ces services ont leurs propres politiques de cookies. Nous vous
              encourageons à les consulter pour comprendre comment ils traitent
              vos données.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Comment gérer vos cookies</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              Vous pouvez contrôler et gérer les cookies de plusieurs façons :
            </p>

            <div className="space-y-3">
              <h4 className="font-semibold text-foreground">
                Paramètres du navigateur
              </h4>
              <p>
                La plupart des navigateurs vous permettent de gérer vos
                préférences en matière de cookies :
              </p>
              <ul className="list-inside list-disc space-y-1 pl-4">
                <li>Bloquer tous les cookies</li>
                <li>Accepter uniquement les cookies de première partie</li>
                <li>Supprimer les cookies existants</li>
                <li>
                  Recevoir une notification avant qu&apos;un cookie ne soit
                  stocké
                </li>
              </ul>

              <div className="rounded-lg bg-muted p-4">
                <p className="mb-2 text-sm font-medium text-foreground">
                  Guides par navigateur :
                </p>
                <ul className="space-y-1 text-sm">
                  <li>
                    <strong>Chrome :</strong> Paramètres → Confidentialité et
                    sécurité → Cookies
                  </li>
                  <li>
                    <strong>Firefox :</strong> Paramètres → Vie privée et
                    sécurité → Cookies
                  </li>
                  <li>
                    <strong>Safari :</strong> Préférences → Confidentialité →
                    Cookies
                  </li>
                  <li>
                    <strong>Edge :</strong> Paramètres → Confidentialité →
                    Cookies
                  </li>
                </ul>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-foreground">Conséquences</h4>
              <p>
                Si vous désactivez certains cookies, certaines fonctionnalités
                du site peuvent ne pas fonctionner correctement :
              </p>
              <ul className="list-inside list-disc space-y-1 pl-4">
                <li>Impossibilité de rester connecté à votre compte</li>
                <li>Perte de vos préférences personnalisées</li>
                <li>Problèmes d&apos;affichage des cartes</li>
                <li>Difficultés lors des paiements</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Technologies similaires</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              En plus des cookies, nous utilisons d&apos;autres technologies
              pour améliorer votre expérience :
            </p>
            <ul className="list-inside list-disc space-y-2 pl-4">
              <li>
                <strong>Local Storage</strong> : Stockage local de données dans
                votre navigateur pour améliorer les performances
              </li>
              <li>
                <strong>Session Storage</strong> : Stockage temporaire de
                données pendant votre session
              </li>
              <li>
                <strong>Service Workers</strong> : Pour permettre certaines
                fonctionnalités hors ligne
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Mises à jour de cette politique</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              Nous pouvons mettre à jour cette politique des cookies de temps à
              autre pour refléter les changements dans nos pratiques ou pour
              d&apos;autres raisons opérationnelles, légales ou réglementaires.
            </p>
            <p>
              Nous vous encourageons à consulter régulièrement cette page pour
              rester informé de notre utilisation des cookies.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              Pour toute question concernant notre utilisation des cookies,
              contactez-nous à :
            </p>
            <p className="font-medium text-foreground">
              cookies@mescontacts.ca
            </p>
            <p>
              Pour en savoir plus sur vos droits en matière de protection des
              données, consultez notre{" "}
              <Link
                href="/politique-confidentialite"
                className="font-medium text-primary hover:underline"
              >
                Politique de confidentialité
              </Link>
              .
            </p>
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
