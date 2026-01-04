import { Provider, UserRole } from "../common/types"

export interface IUserResponse {
  id: string
  email: string
  nickname: string
  role: UserRole
  profileImage: string | null
  provider: Provider
  providerId: string | null
  isLocal: boolean
  createdAt: Date
  profile: {
    detailedAddress: string | null
    latitude: number | null
    longitude: number | null
    introduction: string
    reviewCount: number
    helpfulCount: number
  } | null
}

export interface IUserPublicResponse {
  nickname: string
  profileImage: string | null
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
  profileImage: string | null
  profile: {
    detailedAddress: string | null
    latitude: number | null
    longitude: number | null
    introduction: string
  } | null
}

export interface IUserNickname {
  nickname: string
}
