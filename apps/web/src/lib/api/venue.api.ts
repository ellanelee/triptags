import type { VenuePaginationDto } from "@triptags/shared"
import apiClient from "./api.client"
import {
  IGetVenueAll,
  IGetVenueAllResponse,
} from "@/types/interfaces/interface.api"

export const venueApi = {
  getAllVenue: async (
    paginationDto: VenuePaginationDto,
  ): Promise<IGetVenueAllResponse> => {
    const response = await apiClient.get(`venues/all`, {
      params: paginationDto,
    })
    if (!response.data.success) {
      throw new Error(
        response.data.message ?? response.data.error ?? "조회 실패",
      )
    }
    console.log(response.data.data)
    return response.data.data as IGetVenueAllResponse
  },

  getVenueById: async (venueId: string): Promise<IGetVenueAll> => {
    const response = await apiClient.get(`venues/${venueId}`)
    if (!response.data.success) {
      throw new Error(
        response.data.message ?? response.data.error ?? "조회 실패",
      )
    }
    console.log(response.data.data)
    return response.data.data
  },

  getVenueDetail: async (venueId: string) => {
    const response = await apiClient.get(`venueDetail/${venueId}`)
    if (!response.data.success) {
      throw new Error(
        response.data.message ?? response.data.error ?? "조회 실패",
      )
    }
    console.log(response.data.data)
    return response.data.data
  },
}
