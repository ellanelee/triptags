import { I18nText, UserRole, VisitPurpose } from "src/common/types"

export interface IUserReview {
  id: string
  contents: string
  rating: number
  reviewHelpful: number
  createdAt: Date
}

export interface ReviewForm {
  rating: number
  contents: I18nText
  authorRole: UserRole | null
  reviewDetail: ReviewDetailForm
}

export interface ReviewDetailForm {
  tasteRating: number
  serviceRating: number
  priceRating: number
  visitDate: Date | null
  visitPurpose: VisitPurpose
}
