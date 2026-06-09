import type { IRegisterInput, ILoginInput, ApiResponse } from "@triptags/shared"
import apiClient from "./api.client"

export const authApi = {
  register: async (data: IRegisterInput) => {
    const response = await apiClient.post<ApiResponse<null>>(
      "auth/register",
      data,
    )
    console.log(response.data)
    return response.data
  },

  login: async (data: ILoginInput) => {
    const response = await apiClient.post("auth/login", data, {
      withCredentials: true,
    })
    console.log(response.data.data)
    return response.data.data
  },

  logout: () => {},

  getCurrentUser: () => {},
}
