import { VenueCategory } from "src/common/types"

export interface IVenueRegion {
  id: string
  name: string
  level: number
}

export interface IVenueDetail {
  id: string
  description: any
  address: string
  phoneNumber: string
  priceRange: string
  websiteUrl: string
  work_hour: string
}

export interface IVenueImage{
  id: string
  url: string
}
export interface IGetVenueAll {
  id: string
  name: Record<string,string>
  venueCategory: VenueCategory
  detailedAddress?: string
  rating?: number
  reviewCount?: number
  region: IVenueRegion
  venueDetail?: IVenueDetail
  venueImages: IVenueImage[]  
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
