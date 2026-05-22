import { I18nText, Language, SortBy, VenueCategory } from "src/common/types"

export interface IVenueCreate {
  language: Language
  name: string
  description: string
  venueCategory: VenueCategory | null
  country: string
  city: string
  district: string
  details: string
  latitude: number | null
  longitude: number | null
  venueImage? : string[] 
  googlePlaceId?: string
}

export interface IVenueCreateInput {
  language: Language
  name: string
  description?: string
  venueCategory?: VenueCategory
  country: string
  city: string
  district: string
  details: string
  latitude?: number
  longitude?: number
  googlePlaceId?: string
  venueImage?: string[]
}

export interface IVenueUpdateInput {
  name: I18nText
  description?: I18nText
  venueCategory?: VenueCategory

  country: string
  city: string
  district: string
  details: string

  latitude?: number
  longitude?: number

  googlePlaceId?: string
  venueImage?: string[]
}

export interface IVenuePaginationInput {
  page?: number
  items?: number

  category?: VenueCategory
  search?: string

  country?: string
  city?: string
  district?: string

  rating?: number
  sortBy?: SortBy
}

export interface IVenueSearchFilters {
  search?: string
  country?: string
  city?: string
  district?: string
  category?: VenueCategory | null
  tags?: string[]
  rating?: number
  sortBy?: SortBy
}

export interface IVenueAdminUpdateInput {
  language: Language
  name: string
  description: string
  venueCategory: VenueCategory | null
  country: string
  city: string
  district: string
  details: string
  latitude: number | null
  longitude: number | null
  googlePlaceId?: string
  phoneNumber?: string
  priceRange?: string
  websiteUrl?: string
  workHour?: string
  venueImage?: IVenueImage[]
}

export interface IVenueAdminUpdate {
  name: I18nText
  description: I18nText
  venueCategory: VenueCategory | null
  country: string
  city: string
  district: string
  details: string
  latitude: number | null
  longitude: number | null
  googlePlaceId?: string
  venueImage?: string[]
}

export interface IVenueCreatorUpdate {
  name?: I18nText
  description?: I18nText
  venueImage?: string[]
}

export interface IVenueDetailUpdateInput {
  phoneNumber?: string
  priceRange?: string
  websiteUrl?: string
  workHour?: string
}

export interface IVenueImage {
  id: string
  imageUrl: string
  isThumbnail: boolean
}
