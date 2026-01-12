import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Shield } from "lucide-react"
import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Politique de confidentialité - Mescontacts.ca",
  description:
    "Découvrez comment Mescontacts.ca protège vos données personnelles et respecte votre vie privée.",
}

export default function PolitiqueConfidentialitePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">
          Accueil
        </Link>
        <span>/</span>
        <span className="font-medium text-foreground">
          Politique de confidentialité
        </span>
      </nav>

      {/* En-tête */}
      <div className="mb-8">
        <div className="mb-4 flex items-center gap-3">
          <div className="rounded-lg bg-primary/10 p-3">
            <Shield className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            Politique de confidentialité
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
            <CardTitle>Introduction</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              Chez Mescontacts.ca, nous prenons la protection de vos données
              personnelles très au sérieux. Cette politique de confidentialité
              explique comment nous collectons, utilisons, partageons et
              protégeons vos informations.
            </p>
            <p>
              Nous nous conformons aux lois canadiennes sur la protection de la
              vie privée, notamment la Loi sur la protection des renseignements
              personnels et les documents électroniques (LPRPDE) et la Loi 25 du
              Québec.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>1. Informations que nous collectons</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              Nous collectons différents types d&apos;informations selon votre
              utilisation de notre plateforme :
            </p>

            <div className="space-y-3">
              <div>
                <h4 className="mb-2 font-semibold text-foreground">
                  Informations de compte
                </h4>
                <ul className="list-inside list-disc space-y-1 pl-4">
                  <li>Nom complet</li>
                  <li>Adresse courriel</li>
                  <li>
                    Informations d&apos;authentification (gérées par Clerk)
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="mb-2 font-semibold text-foreground">
                  Informations d&apos;annonce
                </h4>
                <ul className="list-inside list-disc space-y-1 pl-4">
                  <li>Nom de l&apos;entreprise</li>
                  <li>Catégorie d&apos;activité</li>
                  <li>Adresse complète (rue, ville, province, code postal)</li>
                  <li>Numéro de téléphone</li>
                  <li>Adresse courriel</li>
                  <li>Site web (optionnel)</li>
                  <li>Description de l&apos;entreprise</li>
                  <li>Images/logos (optionnel)</li>
                  <li>Coordonnées géographiques (longitude, latitude)</li>
                </ul>
              </div>

              <div>
                <h4 className="mb-2 font-semibold text-foreground">
                  Informations de paiement
                </h4>
                <ul className="list-inside list-disc space-y-1 pl-4">
                  <li>
                    Informations de transaction (traitées par Stripe - nous ne
                    stockons pas vos données bancaires)
                  </li>
                  <li>Historique des paiements</li>
                </ul>
              </div>

              <div>
                <h4 className="mb-2 font-semibold text-foreground">
                  Données techniques
                </h4>
                <ul className="list-inside list-disc space-y-1 pl-4">
                  <li>Adresse IP</li>
                  <li>Type de navigateur et version</li>
                  <li>Pages visitées et temps passé</li>
                  <li>Données de cookies (voir notre politique des cookies)</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>2. Comment nous utilisons vos informations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>Nous utilisons vos données pour :</p>
            <ul className="list-inside list-disc space-y-2 pl-4">
              <li>Créer et gérer votre compte utilisateur</li>
              <li>Publier et afficher vos annonces d&apos;entreprise</li>
              <li>Traiter les paiements et prévenir la fraude</li>
              <li>
                Vous envoyer des notifications importantes concernant votre
                compte
              </li>
              <li>Améliorer et optimiser notre plateforme</li>
              <li>Fournir un support client</li>
              <li>Respecter nos obligations légales</li>
              <li>
                Analyser l&apos;utilisation du site pour améliorer
                l&apos;expérience utilisateur
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>3. Partage de vos informations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              Les informations de votre annonce d&apos;entreprise (nom, adresse,
              téléphone, courriel, site web, description) sont publiquement
              visibles sur notre plateforme - c&apos;est le but d&apos;un
              annuaire d&apos;affaires.
            </p>
            <p>Nous partageons certaines données avec :</p>
            <ul className="list-inside list-disc space-y-2 pl-4">
              <li>
                <strong>Clerk</strong> - Pour l&apos;authentification et la
                gestion des comptes
              </li>
              <li>
                <strong>Convex</strong> - Pour le stockage sécurisé des données
              </li>
              <li>
                <strong>Stripe</strong> - Pour le traitement des paiements
              </li>
              <li>
                <strong>UploadThing</strong> - Pour le stockage des images
              </li>
              <li>
                <strong>Mapbox</strong> - Pour la géolocalisation et les cartes
              </li>
            </ul>
            <p>
              Nous ne vendons jamais vos données personnelles à des tiers. Nous
              ne partageons vos informations qu&apos;avec les fournisseurs de
              services nécessaires au fonctionnement de la plateforme.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>4. Sécurité des données</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              Nous mettons en œuvre des mesures de sécurité techniques et
              organisationnelles pour protéger vos données :
            </p>
            <ul className="list-inside list-disc space-y-2 pl-4">
              <li>Chiffrement SSL/TLS pour toutes les transmissions</li>
              <li>
                Authentification sécurisée via Clerk (avec authentification à
                deux facteurs disponible)
              </li>
              <li>Stockage sécurisé des données avec Convex</li>
              <li>Sauvegardes régulières</li>
              <li>Accès restreint aux données personnelles</li>
              <li>Surveillance et détection des intrusions</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>5. Vos droits</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              Conformément aux lois canadiennes sur la protection de la vie
              privée, vous avez le droit de :
            </p>
            <ul className="list-inside list-disc space-y-2 pl-4">
              <li>
                <strong>Accéder</strong> à vos données personnelles
              </li>
              <li>
                <strong>Corriger</strong> des informations inexactes
              </li>
              <li>
                <strong>Supprimer</strong> votre compte et vos données
              </li>
              <li>
                <strong>Retirer votre consentement</strong> au traitement de vos
                données
              </li>
              <li>
                <strong>Exporter</strong> vos données dans un format portable
              </li>
              <li>
                <strong>Vous opposer</strong> au traitement de vos données dans
                certaines circonstances
              </li>
              <li>
                <strong>Déposer une plainte</strong> auprès du Commissariat à la
                protection de la vie privée du Canada
              </li>
            </ul>
            <p>
              Pour exercer ces droits, contactez-nous à{" "}
              <span className="font-medium text-foreground">
                confidentialite@mescontacts.ca
              </span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>6. Conservation des données</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>Nous conservons vos données aussi longtemps que :</p>
            <ul className="list-inside list-disc space-y-2 pl-4">
              <li>Votre compte est actif</li>
              <li>Nécessaire pour fournir nos services</li>
              <li>
                Requis par la loi (ex: obligations fiscales et comptables)
              </li>
            </ul>
            <p>
              Lorsque vous supprimez votre compte, nous supprimons vos données
              personnelles dans un délai de 30 jours, sauf si nous sommes
              légalement tenus de les conserver plus longtemps.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>7. Transferts internationaux</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              Certains de nos fournisseurs de services peuvent stocker ou
              traiter vos données en dehors du Canada (notamment aux
              États-Unis). Nous nous assurons que ces transferts respectent les
              exigences légales canadiennes en matière de protection des
              données.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>8. Mineurs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              Notre service est destiné aux entreprises et aux professionnels.
              Nous ne collectons pas sciemment d&apos;informations personnelles
              auprès de personnes de moins de 18 ans.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>9. Modifications de cette politique</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              Nous pouvons modifier cette politique de confidentialité de temps
              à autre. Nous vous informerons de tout changement important par
              courriel et/ou via une notification sur la plateforme.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>10. Contact</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              Pour toute question concernant cette politique de confidentialité
              ou pour exercer vos droits :
            </p>
            <div className="space-y-1">
              <p className="font-medium text-foreground">
                Courriel : confidentialite@mescontacts.ca
              </p>
              <p className="font-medium text-foreground">
                Responsable de la protection des données : Mescontacts.ca
              </p>
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
