import { Language, VenueCategory } from "src/common/types"

export interface IVenueCreate {
  language: Language
  name: string
  description: string | null
  venueCategory: VenueCategory | null
  country: string
  city: string
  district: string
  details: string
  latitude: number | null
  longitude: number | null
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
