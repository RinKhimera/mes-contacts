import { z } from "zod"

const requiredString = (
  min: number,
  max: number,
  minMessage: string,
  maxMessage: string,
) =>
  z
    .string()
    .trim()
    .min(min, { message: minMessage })
    .max(max, { message: maxMessage })

const transformCapitalize = (val: string) =>
  val.length > 0 ? val.charAt(0).toUpperCase() + val.slice(1) : val

export const postSchema = z.object({
  name: requiredString(
    1,
    50,
    "Cette entrée est requise.",
    "Le nom de votre entreprise doit comporter au plus 50 caractères.",
  ).transform(transformCapitalize),
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
    .transform(
      (val) => `(${val.slice(0, 3)}) ${val.slice(3, 6)}-${val.slice(6)}`,
    ),
  email: z
    .string()
    .trim()
    .email({ message: "Veuillez saisir une adresse courriel valide" }),
  description:
    // requiredString(
    //   1,
    //   500,
    //   "Cette entrée est requise.",
    //   "La description doit comporter au plus 500 caractères.",
    // ).transform(transformCapitalize),
    z
      .string()
      .max(500, {
        message: "La description doit comporter au plus 500 caractères.",
      })
      .optional(),
  address: requiredString(
    1,
    100,
    "Cette entrée est requise.",
    "L'adresse doit comporter au plus 100 caractères.",
  ),
  province: z
    .string({ required_error: "Cette entrée est requise." })
    .max(50, { message: "La province doit comporter au plus 50 caractères." }),
  city: requiredString(
    1,
    50,
    "Cette entrée est requise.",
    "La ville doit comporter au plus 50 caractères.",
  ),
  postalCode: z
    .string()
    .trim()
    .min(1, { message: "Cette entrée est requise." })
    .max(7, { message: "Le code postal doit comporter au plus 7 caractères." })
    .transform((val) => {
      val = val.toUpperCase()
      return val.length > 3 && val[3] !== " "
        ? val.slice(0, 3) + " " + val.slice(3)
        : val
    }),
  category: requiredString(
    1,
    50,
    "Cette entrée est requise.",
    "La catégorie doit comporter au plus 50 caractères.",
  ),
  services: z
    .string()
    .max(500, {
      message: "Le champ doit comporter au plus 500 caractères.",
    })
    .optional(),
})
