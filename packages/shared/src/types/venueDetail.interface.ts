import { I18nText } from "src/common/types"

export interface IVenueDetailInput {
  phoneNumber?: string
  priceRange?: string
  subCategory?: string
  websiteUrl?: string
  workHour?: string
}

export interface IVenueDetailResponse {
  id: string
  phoneNumber: string | null
  priceRange: string | null
  subCategory: string | null
  websiteUrl: string | null
  workHour: I18nText | null
  description: I18nText | null
  venueId: string
}
