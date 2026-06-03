import type {
  I18nText,
  IPaginatedResponse,
  IVenueDetailResponse,
  UserRole,
  VenueCategory,
} from "@triptags/shared"

//Region
export interface IVenueRegion {
  id: string
  name: string
  level: number
  parentId?: string | null
  parent?: IVenueRegion | null
}

//Statistics
export interface IVenueStats {
  id: string
  localRatingAvg: number
  ratingAvg: number
  reviewCount: number
  venueId: string
}

//Reviews
export interface IReviewsMetric {
  count: number
  averageRating: number
}

export interface IReviewResult {
  total: IReviewsMetric
  local: IReviewsMetric
  normal: IReviewsMetric
}

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
  _count: {
    reviewHelpfuls: number
  }
}

export type IGetReviewByVenueAllResponse =
  IPaginatedResponse<IGetReviewByVenueAll>

//Venues의 기본정보 받아오기
export interface IGetVenueBase {
  id: string
  name: I18nText | null
  description?: I18nText
  venueCategory: VenueCategory
  detailedAddress?: string
  longitude: number
  latitude: number
  createdBy: string
  googlePlaceId: string
  reviewCount?: number
  region: IVenueRegion
  venueDetail?: IVenueDetailResponse
  venueImages: IVenueImage[]
  venueStats: IVenueStats
  reviewSummary: IReviewResult
}

export type IGetVenueAllResponse = IPaginatedResponse<IGetVenueBase>

export interface IVenueImage {
  id: string
  imageUrl: string
  isThumbnail: boolean
}
