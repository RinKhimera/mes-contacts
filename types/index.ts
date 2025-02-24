// export type CitiesProps = {
//   name: string
//   lat: string
//   lng: string
//   country: string
//   admin1: string
//   admin2: string
// }[]

interface MapboxContext {
  id: string
  mapbox_id: string
  wikidata?: string
  text_en?: string
  language_en?: string
  text: string
  language?: string
  short_code?: string
}

interface MapboxMatchCode {
  address_number: string
  street: string
  postcode: string
  place: string
  region: string
  locality: string
  country: string
  confidence: string
}

interface MapboxGeometry {
  type: string
  coordinates: [number, number]
}

export interface MapboxFeatureProperties {
  accuracy: string
  place_name: string
  address_number: string
  street: string
  neighborhood: string
  postcode: string
  locality: string
  place: string
  region: string
  region_code: string
  country: string
  country_code: string
  full_address: string
  address_line1: string
  address_line2: string
  address_line3: string
  address_level1: string
  address_level2: string
  address_level3: string
  context: MapboxContext[]
  match_code: MapboxMatchCode
}

export interface MapboxResponse {
  features: Array<{
    properties: {
      full_address: string
      address_level2: string
      region_code: string
      postcode: string
    }
    text_en: string
    matching_text: string
    geometry: MapboxGeometry
  }>
}
