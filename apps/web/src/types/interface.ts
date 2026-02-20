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
}

export interface IAuthResponse {
  accessToken: string
  user: IUserPublicResponse
}

export interface LanguageSelectProps {
  label?: string
  value: string
  onChange: (value: string) => void
  tr: (key: string) => string // 언어변역
}
