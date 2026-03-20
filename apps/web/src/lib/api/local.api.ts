import type {
  ILocalVerification,
  LocalVerificationCreateDto,
} from "@triptags/shared"
import apiClient from "./api.client"

export const localApi = {
  getLocalVerification: async (
    venueId: string,
    data: LocalVerificationCreateDto,
  ) : Promise<ILocalVerification> => {
    const response = await apiClient.post(`local_verification/${venueId}`, data)
    if (!response.data.success) {
      throw new Error(
        response.data.message ?? response.data.error ?? "조회 실패",
      )
    }
    console.log(response.data)
    return response.data.data
  },
}
