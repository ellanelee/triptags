export type Language = "ko" | "en" | "ja" | "zh" | "es" | "fr" | "de"

export type Provider = "GOOGLE" | "KAKAO" | "NAVER" | "LOCAL"

export type UserRole = "USER" | "USER_LOCAL" | "BUSINESS" | "ADMIN"

export type I18nText = Partial<Record<Language, string>>

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
