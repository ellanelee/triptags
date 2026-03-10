import { I18nText } from "src/common/types"

export interface IVenueDetailResponse {
  id: string
  phoneNumber: string | null
  priceRange: string | null
  subCategory: string | null
  websiteUrl: string | null
  workHour: unknown
  description: I18nText | null
  venueId: string
}
