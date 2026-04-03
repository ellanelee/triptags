export interface IGooglePlaceInfo {
  googlePlaceId: string
  googleName: string
  googleAddress: string
  googleTypes: string[]
  googleRating: number | undefined
  googleUrl: string
}

export interface IParsedGeocodeAddress {
  countryCode: string
  countryName: string
  city: string
  district: string
  details: string
  placeId?: string
}
