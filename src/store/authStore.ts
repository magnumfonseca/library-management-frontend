import { create } from 'zustand'
import type { User } from '@/types'
import { TOKEN_KEY } from '@/api/client'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  setUser: (user: User | null) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  logout: () => {
    localStorage.removeItem(TOKEN_KEY)
    set({ user: null, isAuthenticated: false })
  },
}))
