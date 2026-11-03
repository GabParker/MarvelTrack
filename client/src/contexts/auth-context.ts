import { createContext } from 'react'
import type { AuthUser } from '../utils/authApi'

export interface AuthContextValue {
  user: AuthUser | null
  isLoading: boolean
  isAuthenticated: boolean
  register: (
    name: string,
    email: string,
    password: string,
    avatar?: string,
  ) => Promise<void>
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
  updateProfile: (updates: {
    name?: string
    avatar?: string
  }) => Promise<void>
}

export const AuthContext = createContext<
  AuthContextValue | undefined
>(undefined)