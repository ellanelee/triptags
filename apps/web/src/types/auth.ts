import { IUserPublicResponse } from "@triptags/shared"

export interface IAuthState {
  token: string | null
  user: IUserPublicResponse | null
  isAuthenticated: boolean
  setUser: (user: IUserPublicResponse | null) => void
  setAuth: (token: string, user: IUserPublicResponse) => void
  clearAuth: () => void
}

export interface IAuthResponse {
  accessToken: string
  user: IUserPublicResponse
}
