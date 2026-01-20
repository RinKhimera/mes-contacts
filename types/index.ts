interface MapboxGeometry {
  type: string
  coordinates: [number, number]
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
