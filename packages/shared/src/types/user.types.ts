import { Provider } from "../common/types"

export interface IUserResponse {
  id: string
  email: string
  nickname: string
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
