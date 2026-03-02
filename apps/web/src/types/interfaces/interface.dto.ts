import { IUserPublicResponse } from "@triptags/shared"

export interface IAuthState {
  token: string | null
  user: IUserPublicResponse | null
  isAuthenticated: boolean
  hydrated: boolean
  setUser: (user: IUserPublicResponse | null) => void
  setAuth: (token: string, user: IUserPublicResponse) => void
  clearAuth: () => void
  setHydrated: (v: boolean) => void
  logout: () => Promise<void>
}

export interface IAuthResponse {
  accessToken: string
  user: IUserPublicResponse
}
