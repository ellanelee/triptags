import type { IPaginatedResponse, VenueCategory } from "@triptags/shared"

export interface IVenueRegion {
  id: string
  name: string
  level: number
  parentId?: string | null
  parent?: IVenueRegion | null
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

export interface IVenueStats {
  id: string
  localRatingAvg: number
  ratingAvg: number 
  reviewCount: number
  venueId: string
}

export interface IVenueImage {
  id: string
  imageUrl: string
}
export interface IGetVenueAll {
  id: string
  name: Record<string, string>
  venueCategory: VenueCategory
  detailedAddress?: string
  rating?: number
  reviewCount?: number
  region: IVenueRegion
  venueDetail?: IVenueDetail
  venueImages: IVenueImage[]
  venueStats: IVenueStats
}

export type IGetVenueAllResponse = IPaginatedResponse<IGetVenueAll>
