import { IAuthState } from "@/types/interface"
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
    }),
    {
      name: "auth_storage",
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true)
      },
    },
  ),
)
