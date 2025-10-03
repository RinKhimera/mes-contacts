import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  CreditCard,
  Edit,
  FileText,
  HelpCircle,
  Image as ImageIcon,
  LogIn,
  Mail,
  Search,
  Settings,
  Trash2,
  Upload,
  UserPlus,
} from "lucide-react"
import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Aide et guides - Mescontacts.ca",
  description:
    "Guides d'utilisation et documentation complète pour vous aider à utiliser Mescontacts.ca efficacement.",
}

export default function AidePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">
          Accueil
        </Link>
        <span>/</span>
        <span className="font-medium text-foreground">Aide</span>
      </nav>

      {/* En-tête */}
      <div className="mb-8">
        <div className="mb-4 flex items-center gap-3">
          <div className="rounded-lg bg-primary/10 p-3">
            <BookOpen className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            Centre d&apos;aide
          </h1>
        </div>
        <p className="text-lg text-muted-foreground">
          Guides et tutoriels pour utiliser Mescontacts.ca efficacement
        </p>
      </div>

      {/* Liens rapides */}
      <div className="mx-auto mb-8 max-w-4xl">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Button
            asChild
            variant="outline"
            className="h-auto flex-col gap-2 p-4"
          >
            <Link href="/faq">
              <HelpCircle className="h-6 w-6 text-primary" />
              <span className="font-semibold">FAQ</span>
              <span className="text-xs text-muted-foreground">
                Questions fréquentes
              </span>
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            className="h-auto flex-col gap-2 p-4"
          >
            <Link href="/contact">
              <Mail className="h-6 w-6 text-primary" />
              <span className="font-semibold">Contact</span>
              <span className="text-xs text-muted-foreground">Nous écrire</span>
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            className="h-auto flex-col gap-2 p-4"
          >
            <Link href="/a-propos">
              <FileText className="h-6 w-6 text-primary" />
              <span className="font-semibold">À propos</span>
              <span className="text-xs text-muted-foreground">
                En savoir plus
              </span>
            </Link>
          </Button>
        </div>
      </div>

      {/* Contenu */}
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Démarrage */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-primary" />
              1. Démarrer avec Mescontacts.ca
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <h3 className="flex items-center gap-2 font-semibold">
                <LogIn className="h-4 w-4 text-primary" />
                Créer un compte
              </h3>
              <ol className="list-inside list-decimal space-y-2 pl-4 text-sm text-muted-foreground">
                <li>
                  Cliquez sur le bouton &quot;Se connecter&quot; dans le menu
                  principal
                </li>
                <li>Sélectionnez &quot;S&apos;inscrire&quot;</li>
                <li>
                  Entrez votre adresse courriel et créez un mot de passe
                  sécurisé
                </li>
                <li>
                  Vérifiez votre boîte de réception pour confirmer votre adresse
                  courriel
                </li>
                <li>Connectez-vous avec vos nouveaux identifiants</li>
              </ol>
              <div className="rounded-lg bg-primary/10 p-3 text-sm">
                <p className="font-medium text-foreground">💡 Conseil :</p>
                <p className="text-muted-foreground">
                  Utilisez un mot de passe fort contenant des lettres, chiffres
                  et caractères spéciaux pour protéger votre compte.
                </p>
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <h3 className="flex items-center gap-2 font-semibold">
                <Search className="h-4 w-4 text-primary" />
                Rechercher des entreprises
              </h3>
              <ol className="list-inside list-decimal space-y-2 pl-4 text-sm text-muted-foreground">
                <li>Accédez à la page &quot;Recherche&quot; depuis le menu</li>
                <li>
                  Utilisez la barre de recherche pour entrer un nom
                  d&apos;entreprise, catégorie, ou mot-clé
                </li>
                <li>
                  Filtrez par catégorie, province ou ville pour affiner vos
                  résultats
                </li>
                <li>
                  Cliquez sur une carte d&apos;annonce pour voir tous les
                  détails
                </li>
                <li>
                  Utilisez la carte interactive pour visualiser les emplacements
                </li>
              </ol>
            </div>
          </CardContent>
        </Card>

        {/* Créer une annonce */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Edit className="h-5 w-5 text-primary" />
              2. Créer et publier une annonce
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <h3 className="flex items-center gap-2 font-semibold">
                <FileText className="h-4 w-4 text-primary" />
                Étapes de création
              </h3>
              <ol className="list-inside list-decimal space-y-2 pl-4 text-sm text-muted-foreground">
                <li>Connectez-vous à votre compte</li>
                <li>
                  Accédez à votre tableau de bord en cliquant sur votre avatar
                </li>
                <li>Cliquez sur le bouton &quot;Créer une annonce&quot;</li>
                <li>
                  Remplissez le formulaire avec les informations requises :
                </li>
              </ol>

              <div className="ml-8 space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <div>
                    <strong className="text-foreground">
                      Nom de l&apos;entreprise
                    </strong>
                    <p className="text-muted-foreground">
                      Le nom officiel de votre entreprise
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <div>
                    <strong className="text-foreground">Catégorie</strong>
                    <p className="text-muted-foreground">
                      Choisissez la catégorie qui correspond le mieux à votre
                      activité
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <div>
                    <strong className="text-foreground">
                      Adresse complète
                    </strong>
                    <p className="text-muted-foreground">
                      Utilisez l&apos;autocomplétion pour une adresse précise
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <div>
                    <strong className="text-foreground">
                      Téléphone et courriel
                    </strong>
                    <p className="text-muted-foreground">
                      Coordonnées de contact pour vos clients
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <div>
                    <strong className="text-foreground">
                      Description (optionnel)
                    </strong>
                    <p className="text-muted-foreground">
                      Décrivez vos services et ce qui vous distingue
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <div>
                    <strong className="text-foreground">
                      Image (optionnel)
                    </strong>
                    <p className="text-muted-foreground">
                      Logo ou photo de votre entreprise
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <h3 className="flex items-center gap-2 font-semibold">
                <ImageIcon className="h-4 w-4 text-primary" />
                Ajouter une image
              </h3>
              <ol className="list-inside list-decimal space-y-2 pl-4 text-sm text-muted-foreground">
                <li>
                  Cliquez sur la zone de téléchargement dans le formulaire
                </li>
                <li>
                  Sélectionnez une image depuis votre ordinateur (formats
                  acceptés : JPG, PNG, WebP)
                </li>
                <li>Attendez que l&apos;image soit téléchargée</li>
                <li>L&apos;image apparaîtra en prévisualisation</li>
              </ol>
              <div className="rounded-lg bg-primary/10 p-3 text-sm">
                <p className="font-medium text-foreground">💡 Conseil :</p>
                <p className="text-muted-foreground">
                  Utilisez une image de haute qualité et au format horizontal
                  (ratio 16:9) pour un meilleur rendu.
                </p>
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <h3 className="flex items-center gap-2 font-semibold">
                <Upload className="h-4 w-4 text-primary" />
                Sauvegarder et publier
              </h3>
              <ul className="list-inside list-disc space-y-2 pl-4 text-sm text-muted-foreground">
                <li>
                  <strong className="text-foreground">
                    Sauvegarder en brouillon :
                  </strong>{" "}
                  Cliquez sur &quot;Sauvegarder&quot; pour enregistrer votre
                  annonce sans la publier
                </li>
                <li>
                  <strong className="text-foreground">Publier :</strong> Cliquez
                  sur &quot;Publier&quot; pour rendre votre annonce visible
                  publiquement (paiement requis)
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Paiement */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" />
              3. Processus de paiement
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ol className="list-inside list-decimal space-y-2 text-sm text-muted-foreground">
              <li>
                Après avoir cliqué sur &quot;Publier&quot;, vous serez redirigé
                vers la page de paiement sécurisée Stripe
              </li>
              <li>
                Entrez les informations de votre carte bancaire (Visa,
                Mastercard, American Express)
              </li>
              <li>Vérifiez le montant et confirmez le paiement</li>
              <li>
                Une fois le paiement réussi, vous serez redirigé vers votre
                tableau de bord
              </li>
              <li>
                Votre annonce est maintenant publiée et visible par tous les
                utilisateurs
              </li>
              <li>
                Vous recevrez une facture par courriel à l&apos;adresse de votre
                compte
              </li>
            </ol>

            <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
              <p className="mb-2 font-semibold text-foreground">
                🔒 Paiement 100% sécurisé
              </p>
              <p className="text-sm text-muted-foreground">
                Toutes les transactions sont traitées par Stripe, leader mondial
                du paiement en ligne. Nous ne stockons aucune information de
                carte bancaire sur nos serveurs.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Gérer les annonces */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-primary" />
              4. Gérer vos annonces
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <h3 className="flex items-center gap-2 font-semibold">
                <Edit className="h-4 w-4 text-primary" />
                Modifier une annonce
              </h3>
              <ol className="list-inside list-decimal space-y-2 pl-4 text-sm text-muted-foreground">
                <li>Accédez à votre tableau de bord</li>
                <li>Trouvez l&apos;annonce que vous souhaitez modifier</li>
                <li>Cliquez sur le bouton &quot;Modifier&quot;</li>
                <li>Effectuez vos modifications</li>
                <li>
                  Cliquez sur &quot;Sauvegarder&quot; pour enregistrer les
                  changements
                </li>
              </ol>
              <p className="text-sm text-muted-foreground">
                Les modifications sont appliquées instantanément et sans frais
                supplémentaires.
              </p>
            </div>

            <Separator />

            <div className="space-y-3">
              <h3 className="flex items-center gap-2 font-semibold">
                <Trash2 className="h-4 w-4 text-primary" />
                Supprimer une annonce
              </h3>
              <ol className="list-inside list-decimal space-y-2 pl-4 text-sm text-muted-foreground">
                <li>Accédez à votre tableau de bord</li>
                <li>Trouvez l&apos;annonce que vous souhaitez supprimer</li>
                <li>Cliquez sur le bouton &quot;Supprimer&quot;</li>
                <li>Confirmez la suppression dans la boîte de dialogue</li>
              </ol>
              <div className="rounded-lg bg-destructive/10 p-3 text-sm">
                <p className="font-medium text-destructive">⚠️ Attention :</p>
                <p className="text-muted-foreground">
                  La suppression d&apos;une annonce est définitive et
                  irréversible. Toutes les données seront perdues.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Conseils et bonnes pratiques */}
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              Conseils pour optimiser votre annonce
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <ul className="space-y-2">
              <li className="flex gap-2">
                <span className="text-primary">✓</span>
                <span>
                  <strong className="text-foreground">
                    Image de qualité :
                  </strong>{" "}
                  Utilisez une photo professionnelle de votre logo ou de votre
                  établissement
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">✓</span>
                <span>
                  <strong className="text-foreground">
                    Description détaillée :
                  </strong>{" "}
                  Expliquez clairement vos services et ce qui vous rend unique
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">✓</span>
                <span>
                  <strong className="text-foreground">
                    Informations à jour :
                  </strong>{" "}
                  Vérifiez régulièrement que vos coordonnées sont correctes
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">✓</span>
                <span>
                  <strong className="text-foreground">
                    Catégorie appropriée :
                  </strong>{" "}
                  Choisissez la catégorie la plus pertinente pour être
                  facilement trouvé
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">✓</span>
                <span>
                  <strong className="text-foreground">Adresse précise :</strong>{" "}
                  Utilisez l&apos;autocomplétion pour garantir une localisation
                  exacte sur la carte
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Separator />

        {/* Contact support */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-primary" />
              Besoin d&apos;aide supplémentaire ?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Si vous n&apos;avez pas trouvé la réponse à votre question dans ce
              guide, notre équipe de support est là pour vous aider.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild>
                <Link href="/contact">
                  <Mail className="mr-2 h-4 w-4" />
                  Nous contacter
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/faq">Consulter la FAQ →</Link>
              </Button>
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
