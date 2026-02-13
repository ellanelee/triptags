import { IUserPublicResponse, User, UserRole } from "@triptags/shared"

export interface IAuthState {
  token: string | null
  user: User | null
  isAuthenticated: boolean
  setUser: (user: User | null) => void
  setAuth: (token: string, user: User) => void
  clearAuth: () => void
}

export interface IAuthResponse {
  accessToken: string
  refreshToken: string
  user: IUserPublicResponse
}
