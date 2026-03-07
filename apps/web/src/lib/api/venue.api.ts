import type {
  IGetVenueAllResponse,
  IPaginationMeta,
  VenuePaginationDto,
} from "@triptags/shared"
import apiClient from "./api.client"

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
}
