import { LanguageDto, UserAddressDto } from "@triptags/shared"
import apiClient from "./api.client"

export const userApi = {
  getMyProfile: async (userId: string) => {
    const response = await apiClient.get(`users/${userId}/profile`)
    if (!response.data.success) {
      throw new Error(
        response.data.message ?? response.data.error ?? "조회 실패",
      )
    }
    console.log(response.data)
    return response.data.data ?? ""
  },

  updateLanguage: async (data: LanguageDto) => {
    const response = await apiClient.patch("users/language", data)
    if (!response.data.success) {
      throw new Error(
        response.data.message ?? response.data.error ?? "조회 실패",
      )
    }
    console.log(response.data)
    return response.data
  },

  updateAddress: async (data: UserAddressDto) => {
    const response = await apiClient.post("users/address", data)
    if (!response.data.success) {
      throw new Error(
        response.data.message ?? response.data.error ?? "조회 실패",
      )
    }
    console.log(response.data)
    return response.data.data
  },
}
