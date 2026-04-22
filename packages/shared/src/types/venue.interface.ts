import { Language, VenueCategory } from "src/common/types"

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
  googlePlaceId?: string
}

export interface IVenueSearchFilters {
  search?: string
  city?: string
  district?: string
  category?: VenueCategory | null 
  tags?: string[]
  rating?: number | null
  sortBy?: SortBy
}

export type SortBy = "rating" | "reviews" | "recent" | "distance"
