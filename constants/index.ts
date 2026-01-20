export const menuItems = [
  { href: "/recherche", label: "Rechercher" },
  { href: "/login", label: "Connexion" },
]

export const navItems = [
  { href: "/recherche", label: "Recherche de services" },
  { href: "/a-propos", label: "À propos" },
]

export const listComponents: {
  title: string
  href: string
  description: string
}[] = [
  {
    title: "Plombier",
    href: "/",
    description:
      "Professionnel spécialisé dans l'installation, la réparation et l'entretien des systèmes de plomberie.",
  },
  {
    title: "Electricien",
    href: "/",
    description:
      "Expert dans l'installation, la maintenance et la réparation des systèmes électriques.",
  },
  {
    title: "Homme à tout faire",
    href: "/",
    description:
      "Personne polyvalente capable de réaliser divers travaux de bricolage et de maintenance.",
  },
  {
    title: "Courtier Hypothécaire",
    href: "/",
    description:
      "Spécialiste qui aide les clients à obtenir les meilleurs prêts hypothécaires adaptés à leurs besoins.",
  },
  {
    title: "Courtier Immobilier",
    href: "/",
    description:
      "Professionnel chargé de faciliter l'achat, la vente ou la location de biens immobiliers.",
  },
  {
    title: "Assurance",
    href: "/",
    description:
      "Service offrant une protection financière contre divers risques et imprévus.",
  },
  {
    title: "Association Communautaire",
    href: "/",
    description:
      "Organisation locale visant à améliorer la qualité de vie et à promouvoir le bien-être de la communauté.",
  },
  {
    title: "Voir la liste complète",
    href: "/",
    description:
      "Accéder à la liste détaillée et complète des éléments ou options disponibles.",
  },
]

export const provinces = [
  { label: "Alberta", value: "AB" },
  { label: "Colombie-Britannique", value: "BC" },
  { label: "Manitoba", value: "MB" },
  { label: "Nouveau-Brunswick", value: "NB" },
  { label: "Terre-Neuve-et-Labrador", value: "NL" },
  { label: "Nouvelle-Écosse", value: "NS" },
  { label: "Ontario", value: "ON" },
  { label: "Île-du-Prince-Édouard", value: "PE" },
  { label: "Québec", value: "QC" },
  { label: "Saskatchewan", value: "SK" },
  { label: "Territoires du Nord-Ouest", value: "NT" },
  { label: "Nunavut", value: "NU" },
  { label: "Yukon", value: "YT" },
]

export const categoriesServices = [
  "Plombier",
  "Electricien",
  "Homme à tout faire",
  "Régime Enregistré d'Épargne-Études (REEE)",
  "Courtier Hypothécaire",
  "Courtier Immobilier",
  "Assurance",
  "Association Communautaire",
  "Tutorat",
  "Psychothérapie",
]

export const data = {
  teams: [
    {
      name: "Acme Inc",
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Administration",
      url: "#",
      isActive: true,
      items: [
        {
          title: "Tableau de bord",
          url: "/admin",
        },
        {
          title: "Organisations",
          url: "/admin/organisations",
        },
        {
          title: "Annonces",
          url: "/admin/annonces",
        },
        {
          title: "Paiements",
          url: "/admin/paiements",
        },
      ],
    },
    {
      title: "Paramètres",
      url: "#",
      items: [
        {
          title: "Compte",
          url: "/account",
        },
        {
          title: "Sécurité",
          url: "/account/security",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
    },
    {
      name: "Sales & Marketing",
      url: "#",
    },
    {
      name: "Travel",
      url: "#",
    },
  ],
}
