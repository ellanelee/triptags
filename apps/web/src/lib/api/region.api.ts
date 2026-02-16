import { RegionType } from "@/types/types"
import apiClient from "./api.client"

export const regionApi = {
  create: async (data: RegionType) => {
    const response = await apiClient.post("region", data)
  },
}
