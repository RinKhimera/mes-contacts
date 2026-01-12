import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, FileText } from "lucide-react"
import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Conditions d'utilisation - Mescontacts.ca",
  description:
    "Consultez les conditions d'utilisation de Mescontacts.ca, votre annuaire d'affaires au Québec.",
}

export default function ConditionsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">
          Accueil
        </Link>
        <span>/</span>
        <span className="font-medium text-foreground">
          Conditions d&apos;utilisation
        </span>
      </nav>

      {/* En-tête */}
      <div className="mb-8">
        <div className="mb-4 flex items-center gap-3">
          <div className="rounded-lg bg-primary/10 p-3">
            <FileText className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            Conditions d&apos;utilisation
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
            <CardTitle>1. Acceptation des conditions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              En accédant et en utilisant Mescontacts.ca, vous acceptez
              d&apos;être lié par les présentes conditions d&apos;utilisation.
              Si vous n&apos;acceptez pas ces conditions, veuillez ne pas
              utiliser notre plateforme.
            </p>
            <p>
              Mescontacts.ca est un annuaire d&apos;affaires permettant aux
              entreprises du Québec de publier leurs informations de contact et
              services.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>2. Utilisation du service</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>Vous vous engagez à :</p>
            <ul className="list-inside list-disc space-y-2 pl-4">
              <li>
                Fournir des informations exactes et à jour lors de la création
                d&apos;une annonce
              </li>
              <li>Ne pas publier de contenu frauduleux, trompeur ou illégal</li>
              <li>
                Respecter les droits de propriété intellectuelle d&apos;autrui
              </li>
              <li>
                Ne pas utiliser la plateforme à des fins de spam ou de
                harcèlement
              </li>
              <li>
                Maintenir la confidentialité de vos identifiants de connexion
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>3. Création et publication d&apos;annonces</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              La publication d&apos;une annonce sur Mescontacts.ca nécessite un
              paiement unique. Les annonces publiées restent actives
              indéfiniment, sauf demande de suppression de votre part.
            </p>
            <p>Nous nous réservons le droit de :</p>
            <ul className="list-inside list-disc space-y-2 pl-4">
              <li>
                Refuser ou retirer toute annonce qui ne respecte pas nos
                directives
              </li>
              <li>
                Modifier ou supprimer du contenu inapproprié ou non conforme
              </li>
              <li>Suspendre ou fermer des comptes en cas d&apos;abus</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>4. Paiements et remboursements</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              Les paiements sont traités de manière sécurisée via Stripe. Tous
              les frais sont en dollars canadiens (CAD).
            </p>
            <p>
              Les paiements pour la publication d&apos;annonces ne sont
              généralement pas remboursables, sauf dans les cas suivants :
            </p>
            <ul className="list-inside list-disc space-y-2 pl-4">
              <li>
                Erreur technique empêchant la publication de l&apos;annonce
              </li>
              <li>Double facturation accidentelle</li>
              <li>
                Demande de remboursement dans les 48 heures suivant le paiement
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>5. Propriété intellectuelle</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              Le contenu publié par les utilisateurs (textes, images, logos)
              reste la propriété de leurs auteurs respectifs.
            </p>
            <p>
              En publiant du contenu sur Mescontacts.ca, vous nous accordez une
              licence non exclusive pour afficher, distribuer et promouvoir ce
              contenu dans le cadre de notre service.
            </p>
            <p>
              La marque Mescontacts.ca, son logo, son design et son code sont
              protégés par les lois sur la propriété intellectuelle.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>6. Limitation de responsabilité</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              Mescontacts.ca est fourni &quot;tel quel&quot; sans garantie
              d&apos;aucune sorte. Nous ne sommes pas responsables :
            </p>
            <ul className="list-inside list-disc space-y-2 pl-4">
              <li>
                De l&apos;exactitude des informations publiées par les
                utilisateurs
              </li>
              <li>Des transactions ou interactions entre utilisateurs</li>
              <li>
                Des dommages résultant de l&apos;utilisation ou de
                l&apos;impossibilité d&apos;utiliser le service
              </li>
              <li>De la perte de données ou d&apos;interruption de service</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>7. Modification des conditions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              Nous nous réservons le droit de modifier ces conditions à tout
              moment. Les modifications entreront en vigueur dès leur
              publication sur cette page.
            </p>
            <p>
              Il est de votre responsabilité de consulter régulièrement ces
              conditions pour rester informé des changements.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>8. Droit applicable</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              Ces conditions sont régies par les lois de la province de Québec
              et les lois du Canada applicables. Tout litige sera soumis à la
              compétence exclusive des tribunaux du Québec.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>9. Contact</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              Pour toute question concernant ces conditions d&apos;utilisation,
              veuillez nous contacter à :
            </p>
            <p className="font-medium text-foreground">
              contact@mescontacts.ca
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
