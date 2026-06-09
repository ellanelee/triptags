import { Language, Provider, UserRole } from "../common/types"

export interface ILanguageInput {
  language: Language
}

export interface IUserAddressInput {
  country: string
  city: string
  district: string
  details: string
  latitude?: number
  longitude?: number
}

export interface IUserIntroductionInput {
  introduction: string
}

export interface IUserResponse {
  id: string
  email: string
  nickname: string
  role: UserRole
  language: string
  profileImage: string | null
  provider: Provider
  providerId: string | null
  isLocal: boolean
  createdAt: Date
  profile: {
    detailedAddress: string | null
    regionId: string | null
    latitude: number | null
    longitude: number | null
    introduction: string
    reviewCount: number
    helpfulCount: number
  } | null
}

export interface IUserPublicResponse {
  id: string
  nickname: string
  profileImage: string | null
  language: string
  role: UserRole
  createdAt: Date
  profile: {
    latitude: number | null
    longitude: number | null
    introduction: string
    reviewCount: number
    helpfulCount: number
  } | null
}

export interface IUserUpdate {
  profileImage?: string | null
  profile?: {
    detailedAddress: string | null
    latitude: number | null
    longitude: number | null
    introduction: string
  } | null
}

export interface IUserNickname {
  nickname: string
}
