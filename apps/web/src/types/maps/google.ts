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
  country: string
  city: string
  district: string
  details: string
  postalCode: string
  formattedAddress: string 
}