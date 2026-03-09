import type { RegisterDto, LoginDto, ApiResponse } from "@triptags/shared"
import apiClient from "./api.client"

export const authApi = {
  register: async (data: RegisterDto) => {
    const response = await apiClient.post<ApiResponse<null>>(
      "auth/register",
      data,
    )
    console.log(response.data)
    return response.data
  },

  login: async (data: LoginDto) => {
    const response = await apiClient.post("auth/login", data, {
      withCredentials: true,
    })
    console.log(response.data.data)
    return response.data.data
  },

  logout: () => {},

  getCurrentUser: () => {},
}
