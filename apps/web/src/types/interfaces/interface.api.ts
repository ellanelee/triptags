import type {
  I18nText,
  IPaginatedResponse,
  IVenueDetailResponse,
  UserRole,
  VenueCategory,
} from "@triptags/shared"

export interface IVenueRegion {
  id: string
  name: string
  level: number
  parentId?: string | null
  parent?: IVenueRegion | null
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

export interface IReviewsMetric {
  count: number, 
  averageRating: number, 
}

export interface IReviewResult {
  total: IReviewsMetric
  local: IReviewsMetric
  normal: IReviewsMetric
}

export interface IGetVenueBase {
  id: string
  name: I18nText | null
  venueCategory: VenueCategory
  longitude: number
  latitude: number
  detailedAddress?: string
  rating?: number
  reviewCount?: number
  region: IVenueRegion
  venueDetail?: IVenueDetailResponse
  venueImages: IVenueImage[]
  venueStats: IVenueStats
  reviewSummary: IReviewResult
}

export type IGetVenueAllResponse = IPaginatedResponse<IGetVenueBase>

export interface IGetReviewByVenueAll {
  id: string
  rating: number
  contents: Record<string, string>
  authorRole: UserRole
  localVerificationId: string | null
  likeCount: number
  createdAt: Date
  updatedAt: Date
  deletedAt: Date | null
  venueId: string
  userId: string
  user: {
    nickname: string
  }
}

export type IGetReviewByVenueAllResponse =
  IPaginatedResponse<IGetReviewByVenueAll>
