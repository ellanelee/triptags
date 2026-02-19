import { IAuthState } from "@/types/interface"
import { create } from "zustand"
import { persist } from "zustand/middleware"

export const useAuthStore = create<IAuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      setUser: (user) => set({ user }),
      setAuth: (token, user) => set({ token, user, isAuthenticated: !!user }),
      clearAuth: () => set({ token: null, user: null }),
    }),
    { name: "auth_storage" },
  ),
)
