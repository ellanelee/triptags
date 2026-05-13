import { IVenueCreate, VenueCategory } from "@triptags/shared"

export type LocaleConfigType = {
  requireTerms: boolean
  requirePrivacy: boolean
  requireAge: boolean
  showMarketing: boolean
  minAge: number
  marketingOptIn: boolean
  legalBasis: string
}

export type RegionType = {
  country: string
  city: string
  district: string
}

export type DestinationWithRegion = {
  id: string
  regionId: string
  priority: number
  region: RegionInfo
}

export type RegionInfo = {
  id: string
  name: string
  level: number
  parent?: RegionInfo | null
}

export type PositionInfo = {
  latitude?: number
  longitude?: number
}

export type IVenueCreatePayload = Omit<
  IVenueCreate,
  "latitude" | "longitude" | "venueCategory"
> & {
  latitude?: number
  longitude?: number
  venueCategory?: VenueCategory
}

export type SelectSearchType = "kakao" | "google"

export type VenuePlaceFormTextNameSpace = "CreateVenuePage" | "VenueUpdatePage"
