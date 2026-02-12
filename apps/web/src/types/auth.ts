import { User } from "@triptags/shared"

export interface IAuthState {
  token: string | null
  user: User | null
  isAuthenticated: () => boolean
  setAuth: (token: string, user: User) => void
  clearAuth: () => void
}
