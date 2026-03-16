import {
  ReviewCreateWithDetailDto,
  ReviewPaginationDto,
} from "@triptags/shared"
import apiClient from "./api.client"

export const reviewApi = {
  getReview: async (userId: string) => {
    const response = await apiClient.get(`/reviews`)
    if (!response.data.success) {
      throw new Error(
        response.data.message ?? response.data.error ?? "조회 실패",
      )
    }
    console.log(response.data)
    return response.data.data ?? ""
  },

  getReviewByVenueId: async (venueId: string, pageDto: ReviewPaginationDto) => {
    const response = await apiClient.get(`/reviews/${venueId}`, {
      params: pageDto,
    })
    if (!response.data.success) {
      throw new Error(
        response.data.message ?? response.data.error ?? "조회 실패",
      )
    }
    console.log(response.data)
    return response.data.data
  },

  createReview: async (
    venueId: string,
    createDto: ReviewCreateWithDetailDto,
  ) => {
    const response = await apiClient.post(`/reviews/${venueId}`, createDto)
    if (!response.data.success) {
      throw new Error(
        response.data.message ?? response.data.error ?? "조회 실패",
      )
    }
    console.log(response.data)
    return response.data.data
  },
}
