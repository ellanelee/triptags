import { Dispatch, SetStateAction } from "react"
import { IGetReviewByVenueAll } from "./interface.api"

export interface IBasicButtonProps {
  children?: React.ReactNode
  onClick?: () => void | Promise<void>
  type?: "button" | "submit" | "reset"
  className?: string
}

export interface LanguageSelectProps {
  label?: string
  value: string
  disabled: boolean
  onChange: (value: string) => void
  tr: (key: string) => string // 언어변역
}

export interface PageProps {
  groupSize: number
  totalCount: number
  currentPage: number
  totalPage: number
  onPageChange: (newPage: number) => void
}

export interface ILocalVerificationProps {
  venueId: string
  localVerificationId: string | null
  setLocalVerificationId: Dispatch<SetStateAction<string | null>>
}

//Venue세부 페이지의 Review
export interface ISelectReview {
  userId: string | null
  reviewId: string | null
}

export interface IReviewCardProps {
  review: IGetReviewByVenueAll
  setSelectReview: React.Dispatch<React.SetStateAction<ISelectReview>>
  onEdit: () => void
  onDelete: () => void
}
