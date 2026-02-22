import { RegionType } from "@/types/types"
import apiClient from "./api.client"
import { count } from "console"

export const regionApi = {
  create: async (data: RegionType) => {
    const response = await apiClient.post("regions/region", data)
  },

  getRegionName: async (regionId: string) => {
    const response = await apiClient.get(`regions/${regionId}`)
    if (!response.data.success) {
      throw new Error(
        response.data.message ?? response.data.error ?? "조회 실패",
      )
    }
    console.log(response.data)
    return response.data.data ?? ""
  },

  getCountryIdByCode: async (countryName: string) => {
    const response = await apiClient.get(`regions/region`, {
      params: { countryName },
    })
    if (!response.data.success) {
      throw new Error(
        response.data.message ?? response.data.error ?? "조회 실패",
      )
    }
    console.log(response.data)
    return response.data.data
  },

  getSubRegion: async (regionId: string) => {
    const response = await apiClient.get("regions/regions", {
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
