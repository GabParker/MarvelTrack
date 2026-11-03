import {
  useCallback,
  useEffect,
  useState,
} from 'react'
import type { ReactNode } from 'react'

import {
  getCurrentUser,
  signin as apiSignin,
  signout as apiSignout,
  signup as apiSignup,
  updateCurrentUser as apiUpdateCurrentUser,
} from '../utils/authApi'

import { AuthContext } from './auth-context'
import type { AuthContextValue } from './auth-context'

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthContextValue['user']>(null)
  const [isLoading, setIsLoading] = useState(true)

  const refreshUser = useCallback(async () => {
    try {
      const currentUser = await getCurrentUser()
      setUser(currentUser)
    } catch {
      setUser(null)
    }
  }, [])

  useEffect(() => {
    let isMounted = true

    async function restoreSession() {
      try {
        const currentUser = await getCurrentUser()

        if (isMounted) {
          setUser(currentUser)
        }
      } catch {
        if (isMounted) {
          setUser(null)
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    void restoreSession()

    return () => {
      isMounted = false
    }
  }, [])

  const register = useCallback(
    async (
      name: string,
      email: string,
      password: string,
      avatar = '',
    ) => {
      await apiSignup(name, email, password, avatar)
      await apiSignin(email, password)

      const currentUser = await getCurrentUser()
      setUser(currentUser)
    },
    [],
  )

  const login = useCallback(async (email: string, password: string) => {
    await apiSignin(email, password)
    const currentUser = await getCurrentUser()
    setUser(currentUser)
  }, [])

  const logout = useCallback(async () => {
    try {
      await apiSignout()
    } finally {
      setUser(null)
    }
  }, [])

  const updateProfile = useCallback(
    async (updates: { name?: string; avatar?: string }) => {
      const updatedUser = await apiUpdateCurrentUser(updates)
      setUser(updatedUser)
    },
    [],
  )

  const value: AuthContextValue = {
    user,
    isLoading,
    isAuthenticated: user !== null,
    register,
    login,
    logout,
    refreshUser,
    updateProfile,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}