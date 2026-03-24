import { IPaginatedResponse } from "src/common/interface"
import { I18nText, Language, VenueCategory } from "src/common/types"

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
  googlePlaceId: string | null 
}

export interface IVenueSearchFilters {
  search?: string
  city?: string
  district?: string
  category?: VenueCategory
  tags?: string[]
  rating?: number
  sortBy?: SortBy
}

export type SortBy = "rating" | "reviews" | "recent" | "distance"
