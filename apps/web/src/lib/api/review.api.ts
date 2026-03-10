import apiClient from "./api.client"

export const reviewApi = {
  //   create: async (data: ) => {
  //     const response = await apiClient.post("regions", data)
  //   },

  getReview: async (userId: string) => {
    const response = await apiClient.get(`reviews`)
    if (!response.data.success) {
      throw new Error(
        response.data.message ?? response.data.error ?? "조회 실패",
      )
    }
    console.log(response.data)
    return response.data.data ?? ""
  },

  getReviewByVenueId: async (venueId: string) => {
    const response = await apiClient.get(`reveiws/${venueId}`)
    if (!response.data.success) {
      throw new Error(
        response.data.message ?? response.data.error ?? "조회 실패",
      )
    }
    console.log(response.data)
    return response.data.data
  },
}
