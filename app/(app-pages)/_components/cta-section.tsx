import { Button } from "@/components/ui/button"
import { ArrowRight, Building2, CheckCircle, Sparkles } from "lucide-react"
import Link from "next/link"

const benefits = [
  "Profil professionnel en quelques minutes",
  "Visible auprès de milliers de clients",
  "Avis et crédibilité renforcée",
  "Gestion facile de vos annonces",
]

export function CTASection() {
  return (
    <section className="relative overflow-hidden py-20 md:py-32">
      {/* Background pattern */}
      <div className="topo-pattern absolute inset-0" />

      <div className="relative container mx-auto px-4">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-20">
          {/* Left content */}
          <div>
            <div className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">
                Pour les entreprises
              </span>
            </div>

            <h2 className="animate-fade-up mt-8 font-display text-4xl leading-tight font-bold tracking-tight delay-100 md:text-5xl lg:text-6xl">
              Développez votre{" "}
              <span className="relative inline-block">
                <span className="text-gradient">clientèle</span>
                <svg
                  className="absolute -bottom-1 left-0 h-3 w-full"
                  viewBox="0 0 200 12"
                  fill="none"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M2 8.5C50 2.5 150 2.5 198 8.5"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    className="text-primary/50"
                  />
                </svg>
              </span>{" "}
              dès aujourd&apos;hui
            </h2>

            <p className="animate-fade-up mt-6 text-lg text-muted-foreground delay-200 md:text-xl">
              Rejoignez des milliers d&apos;entreprises qui font confiance à
              Mescontacts.ca pour accroître leur visibilité et attirer de
              nouveaux clients.
            </p>

            {/* Benefits list */}
            <ul className="animate-fade-up mt-8 space-y-4 delay-300">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/10">
                    <CheckCircle className="h-4 w-4 text-accent" />
                  </span>
                  <span className="text-foreground/80">{benefit}</span>
                </li>
              ))}
            </ul>

            {/* CTA buttons */}
            <div className="animate-fade-up mt-10 flex flex-col gap-4 delay-400 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="h-14 gap-2 rounded-xl px-8 text-base font-semibold shadow-lg shadow-primary/20"
              >
                <Link href="/contact">
                  <Building2 className="h-5 w-5" />
                  Publier une annonce
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="h-14 rounded-xl px-8 text-base font-semibold"
              >
                <Link href="/a-propos">En savoir plus</Link>
              </Button>
            </div>
          </div>

          {/* Right side - Stats cards */}
          <div className="relative">
            {/* Decorative background */}
            <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-primary/5 via-accent/5 to-transparent blur-3xl" />

            <div className="relative grid gap-4 sm:grid-cols-2">
              {/* Main stat card */}
              <div className="animate-slide-right col-span-2 rounded-2xl border border-border/50 bg-card p-8 shadow-xl delay-300">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-display text-5xl font-bold text-primary md:text-6xl">
                      2M+
                    </div>
                    <div className="mt-2 text-muted-foreground">
                      Visites mensuelles sur la plateforme
                    </div>
                  </div>
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                    <svg
                      className="h-8 w-8 text-primary"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Secondary stat cards */}
              <div className="animate-slide-right rounded-2xl border border-border/50 bg-card p-6 shadow-lg delay-500">
                <div className="mb-2 font-display text-3xl font-bold">95%</div>
                <div className="text-sm text-muted-foreground">
                  Taux de satisfaction client
                </div>
                <div className="mt-4 flex">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className="h-5 w-5 text-primary"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>

              <div className="animate-slide-right rounded-2xl border border-border/50 bg-card p-6 shadow-lg delay-700">
                <div className="mb-2 font-display text-3xl font-bold">24/7</div>
                <div className="text-sm text-muted-foreground">
                  Support disponible
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <span className="relative flex h-3 w-3">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75"></span>
                    <span className="relative inline-flex h-3 w-3 rounded-full bg-accent"></span>
                  </span>
                  <span className="text-sm text-accent">En ligne</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
