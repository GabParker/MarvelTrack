import type { AuthUser } from '../types/User'

const API_URL = import.meta.env.VITE_API_URL

if (!API_URL) {
  throw new Error('Falta configurar VITE_API_URL.')
}

const API_BASE_URL = `${API_URL.replace(/\/$/, '')}/api/auth`
const TOKEN_KEY = 'marveltrack_token'

interface AuthResponse {
  message?: string
  token?: string
  user?: AuthUser
}

async function authRequest(
  endpoint: string,
  method: 'GET' | 'POST' | 'PATCH',
  body?: Record<string, string | undefined>,
): Promise<AuthResponse> {
  const token = localStorage.getItem(TOKEN_KEY)

  const headers: Record<string, string> = {}

  if (body) {
    headers['Content-Type'] = 'application/json'
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })

  const data = (await response.json()) as AuthResponse

  // Eliminar el token cuando una ruta protegida rechaza la autenticación.
  if (
    response.status === 401 &&
    endpoint !== '/signin' &&
    endpoint !== '/signup'
  ) {
    localStorage.removeItem(TOKEN_KEY)
  }

  if (!response.ok) {
    throw new Error(
      data.message || 'Ocurrió un error de autenticación.',
    )
  }

  return data
}

export async function signup(
  name: string,
  email: string,
  password: string,
  avatar = '',
): Promise<AuthResponse> {
  return authRequest('/signup', 'POST', {
    name,
    email,
    password,
    avatar,
  })
}

export async function signin(
  email: string,
  password: string,
): Promise<AuthResponse> {
  const data = await authRequest('/signin', 'POST', {
    email,
    password,
  })

  if (!data.token) {
    throw new Error('El servidor no devolvió un token de autenticación.')
  }

  localStorage.setItem(TOKEN_KEY, data.token)

  return data
}

export async function getCurrentUser(): Promise<AuthUser> {
  const data = await authRequest('/me', 'GET')

  if (!data.user) {
    throw new Error(
      'No se pudo recuperar la información del usuario.',
    )
  }

  return data.user
}

export async function updateCurrentUser(
  updates: { name?: string; avatar?: string },
): Promise<AuthUser> {
  const data = await authRequest('/me', 'PATCH', updates)

  if (!data.user) {
    throw new Error(
      'No se pudo actualizar la información del usuario.',
    )
  }

  return data.user
}

export async function signout(): Promise<void> {
  try {
    await authRequest('/signout', 'POST')
  } finally {
    localStorage.removeItem(TOKEN_KEY)
  }
}
