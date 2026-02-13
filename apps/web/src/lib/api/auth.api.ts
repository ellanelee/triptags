import { RegisterDto, LoginDto } from "@triptags/shared"
import apiClient from "./api.client"

export const authApi = {
  register: async (data: RegisterDto) => {},

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
