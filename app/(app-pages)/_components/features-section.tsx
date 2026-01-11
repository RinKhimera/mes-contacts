import { CheckCircle2, MapPin, Shield, Star, Zap } from "lucide-react"

const features = [
  {
    icon: Shield,
    title: "Entreprises vérifiées",
    description:
      "Chaque professionnel est vérifié pour garantir qualité et fiabilité.",
    stat: "100%",
    statLabel: "Vérifiés",
  },
  {
    icon: Star,
    title: "Avis authentiques",
    description:
      "Des évaluations réelles de clients pour vous guider dans vos choix.",
    stat: "50K+",
    statLabel: "Avis",
  },
  {
    icon: Zap,
    title: "Résultats instantanés",
    description:
      "Trouvez rapidement le bon professionnel grâce à notre recherche optimisée.",
    stat: "< 1s",
    statLabel: "Temps de recherche",
  },
  {
    icon: CheckCircle2,
    title: "100% gratuit",
    description:
      "Recherchez et contactez des professionnels sans aucun frais caché.",
    stat: "0$",
    statLabel: "Pour les utilisateurs",
  },
]

const stats = [
  { value: "1,000+", label: "Entreprises inscrites", icon: "🏢" },
  { value: "5,000+", label: "Avis vérifiés", icon: "⭐" },
  { value: "13", label: "Provinces et territoires", icon: "🍁" },
]

export function FeaturesSection() {
  return (
    <section className="relative overflow-hidden py-20 md:py-32">
      {/* Background */}
      <div className="absolute inset-0 bg-foreground" />
      <div className="noise-overlay absolute inset-0" />

      <div className="relative container mx-auto px-4">
        {/* Section header */}
        <div className="mb-20 grid gap-8 lg:grid-cols-2 lg:items-end lg:gap-16">
          <div>
            <span className="animate-fade-up mb-4 inline-block font-display text-sm font-semibold tracking-widest text-primary uppercase">
              Pourquoi nous choisir
            </span>
            <h2 className="animate-fade-up font-display text-4xl leading-tight font-bold tracking-tight text-background delay-100 md:text-5xl lg:text-6xl">
              La plateforme de confiance pour trouver les{" "}
              <span className="italic">meilleurs</span> professionnels
            </h2>
          </div>
          <p className="animate-fade-up text-lg text-background/70 delay-200 lg:text-xl">
            Mescontacts.ca connecte les Canadiens avec des professionnels de
            qualité, partout au pays. Simple, rapide et gratuit.
          </p>
        </div>

        {/* Features grid */}
        <div className="mb-20 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div
                key={index}
                className="animate-fade-up group relative rounded-2xl border border-background/10 bg-background/5 p-6 backdrop-blur-sm transition-all duration-300 hover:border-primary/50 hover:bg-background/10"
                style={{ animationDelay: `${200 + index * 100}ms` }}
              >
                {/* Icon */}
                <div className="mb-6 inline-flex rounded-xl bg-primary/20 p-3 text-primary">
                  <Icon className="h-6 w-6" />
                </div>

                {/* Stat */}
                <div className="mb-4">
                  <div className="font-display text-4xl font-bold text-background">
                    {feature.stat}
                  </div>
                  <div className="text-sm text-background/50">
                    {feature.statLabel}
                  </div>
                </div>

                {/* Content */}
                <h3 className="mb-2 font-display text-lg font-semibold text-background">
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed text-background/60">
                  {feature.description}
                </p>
              </div>
            )
          })}
        </div>

        {/* Bottom stats bar */}
        <div className="animate-fade-up rounded-2xl border border-background/10 bg-background/5 p-8 backdrop-blur-sm delay-600">
          <div className="grid gap-8 sm:grid-cols-3">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="flex items-center gap-4 sm:justify-center"
              >
                <span className="text-4xl">{stat.icon}</span>
                <div>
                  <div className="font-display text-3xl font-bold text-primary md:text-4xl">
                    {stat.value}
                  </div>
                  <div className="text-sm text-background/60">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trust indicators */}
        <div className="animate-fade-up mt-12 flex flex-wrap items-center justify-center gap-6 text-center delay-700">
          <div className="flex items-center gap-2 text-background/50">
            <MapPin className="h-4 w-4" />
            <span className="text-sm">Partout au Canada</span>
          </div>
          <div className="h-4 w-px bg-background/20" />
          <div className="flex items-center gap-2 text-background/50">
            <Shield className="h-4 w-4" />
            <span className="text-sm">Données sécurisées</span>
          </div>
          <div className="h-4 w-px bg-background/20" />
          <div className="flex items-center gap-2 text-background/50">
            <Star className="h-4 w-4" />
            <span className="text-sm">Avis vérifiés</span>
          </div>
        </div>
      </div>
    </section>
  )
}
