export const menuItems = [
  // { href: "/", label: "mc.ca" },
  // { href: "/my-contacts", label: "Ma liste de contacts" },
  { href: "/dashboard/new-post", label: "Nouvelle annonce" },
  { href: "/dashboard", label: "Mon tableau de bord" },
  { href: "/login", label: "Connexion" },
  // { href: "/about", label: "A Propos" },
]

export const navItems = [
  { href: "#", label: "Recherche de personnes" },
  { href: "/dashboard/new-post", label: "Faire une annonce" },
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
      title: "Tableau de bord",
      url: "#",
      isActive: true,
      items: [
        {
          title: "Mes annonces",
          url: "/dashboard/my-posts",
        },
        {
          title: "Nouvelle annonce",
          url: "/dashboard/new-post",
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
        // {
        //   title: "Billing",
        //   url: "#",
        // },
        // {
        //   title: "Limits",
        //   url: "#",
        // },
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
