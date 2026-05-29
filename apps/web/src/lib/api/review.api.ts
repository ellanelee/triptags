import {
  IReviewCreateWithDetailInput,
  IReviewPaginationInput,
} from "@triptags/shared"
import apiClient from "./api.client"

export const reviewApi = {
  //UserId를 기준 Review
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

  //VenueId기준 Review조회 (페이지)
  getReviewByVenueId: async (
    venueId: string,
    pageDto: IReviewPaginationInput,
  ) => {
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

  //개별 Review조회 (페이지)
  getReviewById: async (reviewId: string) => {
    const response = await apiClient.get(`/reviews/${venueId}`)
    if (!response.data.success) {
      throw new Error(
        response.data.message ?? response.data.error ?? "조회 실패",
      )
    }
    console.log(response.data)
    return response.data.data
  },

  //Venue기준 Review생성
  createReview: async (
    venueId: string,
    createDto: IReviewCreateWithDetailInput,
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

  deleteReview: async (reviewId: string) => {
    await apiClient.delete(`/reviews/${reviewId}`)
  },
}
