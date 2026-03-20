import { Dispatch, SetStateAction } from "react"

export interface IBasicButtonProps {
  children?: React.ReactNode
  onClick?: () => void | Promise<void>
  type?: "button" | "submit" | "reset"
  className?: string
}

export interface LanguageSelectProps {
  label?: string
  value: string
  onChange: (value: string) => void
  tr: (key: string) => string // 언어변역
}

export interface PageProps {
  groupSize: number
  totalCount: number
  currentPage: number
  totalPage: number
  hasNextPage: boolean
  hasPrevPage: boolean
  onPageChange: (newPage: number) => void
}

export interface ILocalVerificationProps {
  venueId: string
  localVerificationId: string | null
  setLocalVerificationId: Dispatch<SetStateAction<string | null>>
}
