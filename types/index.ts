export type CitiesProps = {
  name: string // Nom de la ville
  lat: string // Latitude sous forme de chaîne
  lng: string // Longitude sous forme de chaîne
  country: string // Code pays ISO (ex: "AD" pour Andorre)
  admin1: string // Code administratif de premier niveau (province/état)
  admin2: string // Code administratif de second niveau (district/commune), peut être vide
}[]
