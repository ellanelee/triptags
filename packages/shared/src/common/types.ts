export type Language = "ko" | "en" | "ja" | "zh" | "es" | "fr" | "de"

export type Provider = "GOOGLE" | "KAKAO" | "NAVER" | "LOCAL"

export type UserRole = "USER" | "USER_LOCAL" | "BUSINESS" | "ADMIN"

export type I18nText = Partial<Record<Language, string>>

export type PointType =
  | "REVIEW_WRITE"
  | "VENUE_CREATE"
  | "HELPFUL_RECEIVED"
  | "LOCAL_VERIFIED"

export type VerificationMethod = "ADDRESS" | "GPS" | "ACTIVITY"

export type VenueCategory =
  | "RESTAURANT"
  | "CAFE"
  | "HOTEL"
  | "STREET_FOOD"
  | "BAR"
  | "ATTRACTION"
  | "ACTIVITY"
  | "SHOPPING"
  | "NATURE"
  | "CULTURE"

export type VisitPurpose =
  | "solo"
  | "couple"
  | "family"
  | "friends"
  | "business"
  | ""

export type SortBy = "rating" | "reviews" | "recent" | "distance"

export type ReviewFilterType = "ALL" | "LOCAL" | "USER"
