import { Button } from "@/components/ui/button"
import { ArrowRight, Building2, TrendingUp } from "lucide-react"
import Link from "next/link"

export function CTASection() {
  return (
    <section className="container mx-auto px-4 py-16 md:py-24">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-primary/80 p-8 md:p-12 lg:p-16">
        {/* Motifs de fond */}
        <div className="absolute top-0 right-0 h-full w-1/2 opacity-10">
          <div className="absolute top-10 right-10 h-32 w-32 rounded-full border-4 border-white"></div>
          <div className="absolute right-32 bottom-20 h-48 w-48 rounded-full border-4 border-white"></div>
          <Building2 className="absolute right-10 bottom-10 h-64 w-64 text-white" />
        </div>

        <div className="relative z-10 grid gap-12 lg:grid-cols-2 lg:items-center">
          {/* Contenu gauche */}
          <div className="text-white">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl lg:text-5xl">
              Vous êtes une entreprise ?
            </h2>
            <p className="mb-6 text-lg text-primary-foreground/90 md:text-xl">
              Rejoignez des milliers d&apos;entreprises qui font confiance à
              Mescontacts.ca pour développer leur clientèle et accroître leur
              visibilité.
            </p>

            <ul className="mb-8 space-y-3">
              {[
                "Créez votre profil professionnel en quelques minutes",
                "Soyez visible auprès de milliers de clients potentiels",
                "Recevez des avis et augmentez votre crédibilité",
                "Gérez facilement vos informations et vos annonces",
              ].map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="mt-1 rounded-full bg-white/20 p-1">
                    <ArrowRight className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-primary-foreground/90">{item}</span>
                </li>
              ))}
            </ul>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Button
                asChild
                size="lg"
                variant="secondary"
                className="text-base font-semibold shadow-xl"
              >
                <Link href="/dashboard/new-post">
                  <Building2 className="mr-2 h-5 w-5" />
                  Créer mon annonce
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-2 border-white bg-transparent text-base font-semibold text-white hover:bg-white hover:text-primary"
              >
                <Link href="/dashboard">
                  <TrendingUp className="mr-2 h-5 w-5" />
                  En savoir plus
                </Link>
              </Button>
            </div>
          </div>

          {/* Statistiques droite */}
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="rounded-2xl bg-white/10 p-6 backdrop-blur-sm">
              <div className="mb-2 text-4xl font-bold text-white">2M+</div>
              <div className="text-primary-foreground/80">
                Visites mensuelles
              </div>
            </div>
            <div className="rounded-2xl bg-white/10 p-6 backdrop-blur-sm">
              <div className="mb-2 text-4xl font-bold text-white">95%</div>
              <div className="text-primary-foreground/80">
                Taux de satisfaction
              </div>
            </div>
            <div className="rounded-2xl bg-white/10 p-6 backdrop-blur-sm">
              <div className="mb-2 text-4xl font-bold text-white">24/7</div>
              <div className="text-primary-foreground/80">
                Support disponible
              </div>
            </div>
            <div className="rounded-2xl bg-white/10 p-6 backdrop-blur-sm">
              <div className="mb-2 text-4xl font-bold text-white">
                <span className="text-3xl">🇨🇦</span>
              </div>
              <div className="text-primary-foreground/80">
                Partout au Canada
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
