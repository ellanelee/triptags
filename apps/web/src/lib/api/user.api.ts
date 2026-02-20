import {
  LanguageDto,
} from "@triptags/shared"
import apiClient from "./api.client"

export const userApi = {
  updateLanguage: async (data: LanguageDto) => {
    const response = await apiClient.patch("users/language", data)
    console.log(response.data)
    return response.data
  },
}
