export type CitiesProps = {
  name: string // Nom de la ville
  lat: string // Latitude sous forme de chaîne
  lng: string // Longitude sous forme de chaîne
  country: string // Code pays ISO (ex: "AD" pour Andorre)
  admin1: string // Code administratif de premier niveau (province/état)
  admin2: string // Code administratif de second niveau (district/commune), peut être vide
}[]

export type PostProps = {
  id: string
  authorId?: string
  businessName?: string | null
  businessImageUrl?: string | null
  category: string
  description?: string | null
  services?: string | null
  phone: string
  email: string
  website?: string | null
  address: string
  province: string
  city: string
  postalCode: string
}
