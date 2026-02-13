import { RegisterDto, LoginDto } from "@triptags/shared"
import apiClient from "./api.client"

export const authApi = {
  register: async (data: RegisterDto) => {},

  login: async (data: LoginDto) => {
    const response = await apiClient.post("auth/login", data)
    console.log(response)
    return response.data
  },

  logout: () => {},

  getCurrentUser: () => {},
}
