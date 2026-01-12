"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, HelpCircle, Mail, Search } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

const faqCategories = [
  {
    category: "Général",
    icon: "🏠",
    questions: [
      {
        q: "Qu'est-ce que Mescontacts.ca ?",
        a: "Mescontacts.ca est un annuaire d'affaires en ligne conçu spécifiquement pour les entreprises québécoises. Notre plateforme permet aux entreprises de publier leurs informations de contact et services, et aux consommateurs de trouver facilement des entreprises locales par catégorie, ville ou région.",
      },
      {
        q: "Le service est-il gratuit ?",
        a: "La consultation de l'annuaire est entièrement gratuite pour tous les utilisateurs. Pour publier une annonce d'entreprise, un paiement unique est requis. Votre annonce reste ensuite active indéfiniment sans frais récurrents.",
      },
      {
        q: "Qui peut utiliser Mescontacts.ca ?",
        a: "Mescontacts.ca est ouvert à toutes les entreprises québécoises, peu importe leur taille ou leur secteur d'activité. Les consommateurs peuvent également utiliser gratuitement notre plateforme pour rechercher des entreprises locales.",
      },
      {
        q: "Dois-je créer un compte pour consulter les annonces ?",
        a: "Non, vous pouvez consulter et rechercher des annonces sans créer de compte. Cependant, un compte est nécessaire pour publier et gérer vos propres annonces d'entreprise.",
      },
    ],
  },
  {
    category: "Création d'annonce",
    icon: "✏️",
    questions: [
      {
        q: "Comment créer une annonce pour mon entreprise ?",
        a: "1) Créez un compte ou connectez-vous\n2) Accédez à votre tableau de bord\n3) Cliquez sur 'Créer une annonce'\n4) Remplissez le formulaire avec les informations de votre entreprise\n5) Ajoutez une image (optionnel)\n6) Sauvegardez votre annonce en brouillon ou publiez-la directement après le paiement",
      },
      {
        q: "Quelles informations dois-je fournir ?",
        a: "Informations obligatoires : nom de l'entreprise, catégorie, adresse complète, numéro de téléphone, et courriel. Informations optionnelles : site web, description de l'entreprise, et image/logo.",
      },
      {
        q: "Puis-je ajouter plusieurs annonces pour différentes entreprises ?",
        a: "Oui, vous pouvez créer et gérer plusieurs annonces depuis le même compte utilisateur. Chaque annonce nécessite un paiement séparé.",
      },
      {
        q: "Combien de temps faut-il pour créer une annonce ?",
        a: "La création d'une annonce prend généralement entre 5 et 10 minutes. Une fois le paiement effectué, votre annonce est publiée instantanément et visible par tous les utilisateurs.",
      },
      {
        q: "Puis-je sauvegarder mon annonce sans la publier ?",
        a: "Oui, vous pouvez sauvegarder votre annonce en brouillon et la publier plus tard. Les brouillons sont accessibles depuis votre tableau de bord.",
      },
    ],
  },
  {
    category: "Paiement",
    icon: "💳",
    questions: [
      {
        q: "Combien coûte la publication d'une annonce ?",
        a: "Le prix exact est affiché lors du processus de publication. Il s'agit d'un paiement unique, sans frais récurrents. Votre annonce reste active aussi longtemps que vous le souhaitez.",
      },
      {
        q: "Quels modes de paiement acceptez-vous ?",
        a: "Nous acceptons toutes les principales cartes de crédit et de débit (Visa, Mastercard, American Express) via notre partenaire de paiement sécurisé Stripe.",
      },
      {
        q: "Le paiement est-il sécurisé ?",
        a: "Oui, tous les paiements sont traités de manière sécurisée par Stripe, leader mondial du paiement en ligne. Nous ne stockons aucune information de carte bancaire sur nos serveurs.",
      },
      {
        q: "Puis-je obtenir un remboursement ?",
        a: "Les remboursements sont possibles dans les cas suivants : erreur technique empêchant la publication, double facturation accidentelle, ou demande dans les 48 heures suivant le paiement. Contactez notre support pour toute demande de remboursement.",
      },
      {
        q: "Recevrai-je une facture ?",
        a: "Oui, une facture électronique vous est automatiquement envoyée par courriel après chaque paiement réussi.",
      },
    ],
  },
  {
    category: "Gestion d'annonce",
    icon: "⚙️",
    questions: [
      {
        q: "Comment modifier mon annonce ?",
        a: "Connectez-vous à votre compte, accédez à votre tableau de bord, trouvez l'annonce que vous souhaitez modifier, cliquez sur 'Modifier', effectuez vos changements, et sauvegardez.",
      },
      {
        q: "Puis-je changer l'image de mon annonce ?",
        a: "Oui, vous pouvez modifier l'image de votre annonce à tout moment depuis votre tableau de bord. Téléchargez simplement une nouvelle image et sauvegardez les modifications.",
      },
      {
        q: "Comment supprimer mon annonce ?",
        a: "Depuis votre tableau de bord, trouvez l'annonce à supprimer et cliquez sur le bouton 'Supprimer'. Cette action est irréversible, alors assurez-vous de votre choix avant de confirmer.",
      },
      {
        q: "Puis-je mettre mon annonce en pause temporairement ?",
        a: "Oui, vous pouvez changer le statut de votre annonce à 'Brouillon' pour la rendre invisible publiquement. Vous pouvez la réactiver à tout moment sans frais supplémentaires.",
      },
      {
        q: "Combien de temps mon annonce reste-t-elle active ?",
        a: "Votre annonce reste active indéfiniment après publication, sans frais récurrents. Vous pouvez la modifier ou la supprimer à tout moment.",
      },
    ],
  },
  {
    category: "Recherche",
    icon: "🔍",
    questions: [
      {
        q: "Comment rechercher une entreprise ?",
        a: "Utilisez la barre de recherche sur la page d'accueil ou la page de recherche. Vous pouvez rechercher par nom d'entreprise, catégorie, ville, ou province. Les filtres avancés vous permettent d'affiner vos résultats.",
      },
      {
        q: "Puis-je rechercher par localisation ?",
        a: "Oui, vous pouvez filtrer les résultats par ville et province. Notre système de géolocalisation vous permet également de voir les entreprises sur une carte interactive.",
      },
      {
        q: "Les résultats de recherche sont-ils à jour ?",
        a: "Oui, les résultats de recherche affichent uniquement les annonces actives et publiées. Les informations sont celles fournies et maintenues à jour par les entreprises elles-mêmes.",
      },
      {
        q: "Combien d'annonces puis-je voir par page ?",
        a: "Les résultats de recherche affichent plusieurs annonces par page avec un système de pagination pour faciliter la navigation.",
      },
    ],
  },
  {
    category: "Compte et sécurité",
    icon: "🔐",
    questions: [
      {
        q: "Comment créer un compte ?",
        a: "Cliquez sur 'Se connecter' dans le menu principal, puis sur 'S'inscrire'. Vous pouvez créer un compte avec votre adresse courriel ou via un fournisseur d'authentification externe.",
      },
      {
        q: "Mes données sont-elles sécurisées ?",
        a: "Oui, nous prenons la sécurité très au sérieux. Toutes les données sont chiffrées, stockées de manière sécurisée, et nous nous conformons aux lois canadiennes sur la protection de la vie privée (LPRPDE et Loi 25 du Québec).",
      },
      {
        q: "Comment changer mon mot de passe ?",
        a: "Accédez à votre page de compte depuis le menu utilisateur, puis cliquez sur 'Paramètres de sécurité' pour modifier votre mot de passe.",
      },
      {
        q: "Puis-je supprimer mon compte ?",
        a: "Oui, vous pouvez supprimer votre compte à tout moment depuis les paramètres de votre compte. Cette action supprimera toutes vos annonces et données personnelles de manière permanente.",
      },
      {
        q: "J'ai oublié mon mot de passe, que faire ?",
        a: "Cliquez sur 'Mot de passe oublié' sur la page de connexion. Suivez les instructions pour réinitialiser votre mot de passe via courriel.",
      },
    ],
  },
  {
    category: "Support technique",
    icon: "🛠️",
    questions: [
      {
        q: "J'ai un problème technique, comment obtenir de l'aide ?",
        a: "Contactez notre support technique à support@mescontacts.ca en décrivant votre problème en détail. Incluez des captures d'écran si possible. Nous répondons généralement dans les 24-48 heures.",
      },
      {
        q: "Le site ne fonctionne pas correctement, que faire ?",
        a: "Essayez d'abord de vider le cache de votre navigateur et de vous reconnecter. Si le problème persiste, contactez notre support technique avec les détails de votre navigateur et du problème rencontré.",
      },
      {
        q: "Mon paiement n'a pas fonctionné, que faire ?",
        a: "Vérifiez d'abord que votre carte est valide et possède les fonds nécessaires. Si le problème persiste, contactez support@mescontacts.ca avec votre numéro de transaction si disponible.",
      },
      {
        q: "Puis-je utiliser Mescontacts.ca sur mobile ?",
        a: "Oui, notre site est entièrement responsive et fonctionne parfaitement sur tous les appareils : ordinateurs, tablettes et smartphones.",
      },
    ],
  },
]

export default function FAQPage() {
  const [searchTerm, setSearchTerm] = useState("")

  // Filtrer les questions en fonction de la recherche
  const filteredCategories = faqCategories
    .map((category) => ({
      ...category,
      questions: category.questions.filter(
        (item) =>
          item.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.a.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    }))
    .filter((category) => category.questions.length > 0)

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">
          Accueil
        </Link>
        <span>/</span>
        <span className="font-medium text-foreground">FAQ</span>
      </nav>

      {/* En-tête */}
      <div className="mb-8">
        <div className="mb-4 flex items-center gap-3">
          <div className="rounded-lg bg-primary/10 p-3">
            <HelpCircle className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            Foire aux questions (FAQ)
          </h1>
        </div>
        <p className="text-lg text-muted-foreground">
          Trouvez rapidement des réponses à vos questions les plus fréquentes
        </p>
      </div>

      {/* Barre de recherche */}
      <div className="mx-auto mb-8 max-w-2xl">
        <div className="relative">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Rechercher dans la FAQ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Contenu */}
      <div className="mx-auto max-w-4xl space-y-6">
        {filteredCategories.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">
                Aucune question trouvée pour &quot;{searchTerm}&quot;
              </p>
              <Button
                variant="link"
                onClick={() => setSearchTerm("")}
                className="mt-2"
              >
                Effacer la recherche
              </Button>
            </CardContent>
          </Card>
        ) : (
          filteredCategories.map((category, categoryIndex) => (
            <Card key={categoryIndex}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl">{category.icon}</span>
                  {category.category}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {category.questions.map((item, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger className="text-left hover:no-underline">
                        {item.q}
                      </AccordionTrigger>
                      <AccordionContent className="whitespace-pre-line text-muted-foreground">
                        {item.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          ))
        )}

        <Separator />

        {/* Contact support */}
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-primary" />
              Vous ne trouvez pas votre réponse ?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Notre équipe de support est là pour vous aider. N&apos;hésitez pas
              à nous contacter si vous avez d&apos;autres questions.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild>
                <Link href="/contact">
                  <Mail className="mr-2 h-4 w-4" />
                  Nous contacter
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/aide">Consulter l&apos;aide →</Link>
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
