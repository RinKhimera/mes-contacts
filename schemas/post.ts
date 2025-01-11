import { z } from "zod"

export const postSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, {
      message: "Cette entrée est requise.",
    })
    .max(50, {
      message: "Le nom d'affichage doit comporter au plus 50 caractères.",
    })
    .transform((val) => {
      if (val.length > 0) {
        val = val.charAt(0).toUpperCase() + val.slice(1)
      }
      return val
    }),
  phone: z
    .string()
    .regex(/^[2-9][0-9]{2}[2-9][0-9]{2}[0-9]{4}$/, {
      message:
        "Le numéro de téléphone doit être un numéro canadien valide composé uniquement de chiffres.",
    })
    .min(10, {
      message: "Le numéro de téléphone doit comporter au moins 10 caractères.",
    })
    .max(10, {
      message: "Le numéro de téléphone doit comporter au plus 10 caractères.",
    })
    .transform((val) => {
      return `(${val.slice(0, 3)}) ${val.slice(3, 6)}-${val.slice(6)}`
    }),
  email: z
    .string()
    .trim()
    .email({ message: "Veuillez saisir une adresse courriel valide" }),
  description: z
    .string()
    .trim()
    .min(1, {
      message: "Cette entrée est requise.",
    })
    .max(500, {
      message: "La description doit comporter au plus 500 caractères.",
    })
    .transform((val) => {
      if (val.length > 0) {
        val = val.charAt(0).toUpperCase() + val.slice(1)
      }
      return val
    }),
  address: z
    .string()
    .trim()
    .min(1, {
      message: "Cette entrée est requise.",
    })
    .max(100, {
      message: "L'adresse doit comporter au plus 100 caractères.",
    }),
  province: z.string({ required_error: "Cette entrée est requise." }).max(50, {
    message: "La province doit comporter au plus 50 caractères.",
  }),
  city: z
    .string()
    .min(1, {
      message: "Cette entrée est requise.",
    })
    .max(50, {
      message: "La ville doit comporter au plus 50 caractères.",
    }),
  postalCode: z
    .string()
    .trim()
    .min(1, {
      message: "Cette entrée est requise.",
    })
    .max(7, {
      message: "Le code postal doit comporter au plus 7 caractères.",
    })
    .transform((val) => {
      // Convertir en majuscules
      val = val.toUpperCase()
      // Ajouter un espace après les 3 premiers caractères s'il n'y en a pas déjà
      if (val.length > 3 && val[3] !== " ") {
        val = val.slice(0, 3) + " " + val.slice(3)
      }
      return val
    }),

  category: z
    .string()
    .trim()
    .min(1, {
      message: "Cette entrée est requise.",
    })
    .max(50, {
      message: "La catégorie doit comporter au plus 50 caractères.",
    }),

  services: z
    .string()
    .trim()
    .min(1, {
      message: "Cette entrée est requise.",
    })
    .max(500, {
      message: "Les services doivent comporter au plus 500 caractères.",
    })
    .transform((val) => {
      if (val.length > 0) {
        val = val.charAt(0).toUpperCase() + val.slice(1)
      }
      return val
    }),
})
