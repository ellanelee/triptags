import { RegionType } from "@/types/types"
import apiClient from "./api.client"

export const regionApi = {
  create: async (data: RegionType) => {
    const response = await apiClient.post("regions", data)
  },

  //지역명 가져오기
  getRegionHierarchical: async (regionId: string) => {
    const response = await apiClient.get(`regions/${regionId}/hierarchy`)
    if (!response.data.success) {
      throw new Error(
        response.data.message ?? response.data.error ?? "조회 실패",
      )
    }
    console.log(response.data)
    return response.data.data ?? ""
  },

  //국가Code로 regionId가져오기
  getCountryIdByCode: async (code: string) => {
    const response = await apiClient.get(`regions/id`, {
      params: { code },
    })
    if (!response.data.success) {
      throw new Error(
        response.data.message ?? response.data.error ?? "조회 실패",
      )
    }
    console.log(response.data)
    return response.data.data
  },

  //regionId로 1단계 하단의 region가져오기
  getSubRegion: async (regionId: string) => {
    const response = await apiClient.get(`regions/${regionId}/sub`, {
      params: { regionId },
    })
    if (!response.data.success) {
      throw new Error(
        response.data.message ?? response.data.error ?? "조회 실패",
      )
    }
    console.log(response.data)
    return response.data.data
  },
}
