import { DestinationCreateDto } from "@triptags/shared"
import apiClient from "./api.client"

export const destinationApi = {
  get: async () => {
    const response = await apiClient.get("destination/my", {
      withCredentials: true,
    })
    console.log(response.data)
    return response.data
  },

  getInfo: async () => {
    const response = await apiClient.get("destination/info", {
      withCredentials: true,
    })
    console.log(response.data)
    if (!response.data.success) {
      throw new Error(
        response.data.message ?? response.data.error ?? "조회 실패",
      )
    }
    return response.data.data ?? []
  },

  create: async (data: DestinationCreateDto) => {
    const response = await apiClient.post("destination", data)
    console.log(response.data)
    return response.data
  },

  remove: async (destinationId: string) => {
    const response = await apiClient.delete(`destination/${destinationId}`)
  },
}
