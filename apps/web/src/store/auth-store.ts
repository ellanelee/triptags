import apiClient from "@/lib/api/api.client"
import { IAuthState } from "@/types/interfaces/interface.dto"
import { create } from "zustand"
import { persist } from "zustand/middleware"

export const useAuthStore = create<IAuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      hydrated: false,
      setHydrated: (v) => set({ hydrated: v }),
      setUser: (user) => set({ user }),

      setAuth: (token, user) => set({ token, user, isAuthenticated: !!token }),
      clearAuth: () => set({ token: null, user: null, isAuthenticated: false }),
      logout: async () => {
        const token = get().token
        try {
          await apiClient.post("auth/logout")
        } catch (error) {
          console.error("Logout error", error)
        }
        set({ user: null, isAuthenticated: false, token: null })
        localStorage.removeItem("auth_storage")
        localStorage.removeItem("accessToken")
      },
    }),
    {
      name: "auth_storage",
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true)
      },
    },
  ),
)
