"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Mail, MessageSquare, Phone, Send } from "lucide-react"
import Link from "next/link"
import { useState, useTransition } from "react"
import { toast } from "sonner"

export default function ContactPage() {
  const [isPending, startTransition] = useTransition()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    startTransition(() => {
      // Simuler l'envoi du formulaire
      // Dans un vrai cas, vous appelleriez une API ou mutation Convex ici
      setTimeout(() => {
        toast.success("Message envoyé avec succès!", {
          description: "Nous vous répondrons dans les plus brefs délais.",
        })
        setFormData({ name: "", email: "", subject: "", message: "" })
      }, 1000)
    })
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">
          Accueil
        </Link>
        <span>/</span>
        <span className="font-medium text-foreground">Contact</span>
      </nav>

      {/* En-tête */}
      <div className="mb-8">
        <div className="mb-4 flex items-center gap-3">
          <div className="rounded-lg bg-primary/10 p-3">
            <MessageSquare className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            Nous contacter
          </h1>
        </div>
        <p className="text-lg text-muted-foreground">
          Une question ? Une suggestion ? N&apos;hésitez pas à nous écrire !
        </p>
      </div>

      {/* Contenu */}
      <div className="mx-auto max-w-5xl">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Formulaire de contact */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Send className="h-5 w-5 text-primary" />
                  Envoyez-nous un message
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">
                      Nom complet <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Jean Tremblay"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      disabled={isPending}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">
                      Adresse courriel{" "}
                      <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="jean.tremblay@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      disabled={isPending}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">
                      Sujet <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="subject"
                      name="subject"
                      type="text"
                      placeholder="Question sur mon annonce"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      disabled={isPending}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">
                      Message <span className="text-destructive">*</span>
                    </Label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="Décrivez votre demande en détail..."
                      value={formData.message}
                      onChange={handleChange}
                      required
                      disabled={isPending}
                      rows={6}
                      className="resize-none"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    disabled={isPending}
                  >
                    {isPending ? (
                      "Envoi en cours..."
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Envoyer le message
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-muted-foreground">
                    <span className="text-destructive">*</span> Champs
                    obligatoires
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Informations de contact */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-primary" />
                  Coordonnées
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-semibold text-foreground">
                    Support général
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Pour toute question générale sur notre service
                  </p>
                  <a
                    href="mailto:contact@mescontacts.ca"
                    className="flex items-center gap-2 text-primary hover:underline"
                  >
                    <Mail className="h-4 w-4" />
                    contact@mescontacts.ca
                  </a>
                </div>

                <Separator />

                <div className="space-y-2">
                  <h4 className="font-semibold text-foreground">
                    Support technique
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Problèmes techniques, bugs, erreurs
                  </p>
                  <a
                    href="mailto:support@mescontacts.ca"
                    className="flex items-center gap-2 text-primary hover:underline"
                  >
                    <Mail className="h-4 w-4" />
                    support@mescontacts.ca
                  </a>
                </div>

                <Separator />

                <div className="space-y-2">
                  <h4 className="font-semibold text-foreground">
                    Confidentialité et données
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Questions sur vos données personnelles
                  </p>
                  <a
                    href="mailto:confidentialite@mescontacts.ca"
                    className="flex items-center gap-2 text-primary hover:underline"
                  >
                    <Mail className="h-4 w-4" />
                    confidentialite@mescontacts.ca
                  </a>
                </div>

                <Separator />

                <div className="space-y-2">
                  <h4 className="font-semibold text-foreground">
                    Partenariats et affaires
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Opportunités de collaboration
                  </p>
                  <a
                    href="mailto:partenariats@mescontacts.ca"
                    className="flex items-center gap-2 text-primary hover:underline"
                  >
                    <Mail className="h-4 w-4" />
                    partenariats@mescontacts.ca
                  </a>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-primary" />
                  Heures d&apos;ouverture
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Lundi - Vendredi
                  </span>
                  <span className="font-medium">9h00 - 17h00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Samedi</span>
                  <span className="font-medium">10h00 - 14h00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Dimanche</span>
                  <span className="font-medium text-muted-foreground">
                    Fermé
                  </span>
                </div>
                <Separator />
                <p className="text-xs text-muted-foreground">
                  Heures de l&apos;Est (Québec). Nous nous efforçons de répondre
                  à tous les messages dans les 24-48 heures ouvrables.
                </p>
              </CardContent>
            </Card>

            <Card className="border-primary/20 bg-primary/5">
              <CardHeader>
                <CardTitle>Questions fréquentes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <p>
                  Avant de nous contacter, consultez notre section FAQ qui
                  pourrait répondre à vos questions :
                </p>
                <ul className="list-inside list-disc space-y-1 pl-2">
                  <li>Comment créer une annonce ?</li>
                  <li>Comment modifier mon annonce ?</li>
                  <li>Politique de remboursement</li>
                  <li>Comment supprimer mon compte ?</li>
                  <li>Problèmes de paiement</li>
                </ul>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/faq">Consulter la FAQ →</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        <Separator className="my-8" />

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
