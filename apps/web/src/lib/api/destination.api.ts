import { DestinationCreateDto } from "@triptags/shared"
import apiClient from "./api.client"

export const destinationApi = {
  get: async () => {
    const response = await apiClient.get("destination/my")
    console.log(response.data)
    return response.data
  },

  create: async (data: DestinationCreateDto) => {
    const response = await apiClient.post("destination", data)
    console.log(response.data)
    return response.data
  },

  remove: async (regionId: string) => {
    const response = await apiClient.delete("destination", {
      params: { regionId },
    })
  },
}
