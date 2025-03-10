// import { CitiesProps } from "@/types"
// import cities from "cities.json"

// export const citiesByProvinces = (provinceCode: string) => {
//   const typedCities: CitiesProps = cities as CitiesProps

//   const provinceMap: { [key: string]: string } = {
//     AB: "01",
//     BC: "02",
//     MB: "03",
//     NB: "04",
//     NL: "05",
//     NS: "07",
//     ON: "08",
//     PE: "09",
//     QC: "10",
//     SK: "11",
//     NT: "13",
//     NU: "14",
//     YT: "12",
//   }

//   const adminCode = provinceMap[provinceCode]

//   if (adminCode) {
//     // Étape 1 : Filtrer par code province et pays
//     const filteredCities = typedCities.filter(
//       (city) => city.country === "CA" && city.admin1 === adminCode,
//     )

//     // Étape 2 : Éliminer les doublons en utilisant un `Set`
//     const seen = new Set<string>()
//     const uniqueCities = filteredCities.filter((city) => {
//       if (seen.has(city.name)) {
//         return false // Déjà rencontré, on l'exclut
//       }
//       seen.add(city.name)
//       return true // Première occurrence, on la garde
//     })

//     // Étape 3 : Trier les villes par ordre alphabétique
//     uniqueCities.sort((a, b) => a.name.localeCompare(b.name))

//     return uniqueCities
//   }

//   return []
// }
