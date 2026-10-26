import {
  createContext,
  useCallback,
  useContext,
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
import type { AuthUser } from '../utils/authApi'

interface AuthContextValue {
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

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null)
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

      // Iniciar sesión para que el servidor establezca la cookie.
      await apiSignin(email, password)

      // Recuperar el perfil después de establecer la sesión.
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

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth debe utilizarse dentro de AuthProvider.')
  }

  return context
}
