const API_BASE_URL = 'http://localhost:3001/api/auth'

export interface AuthUser {
  id: string
  name: string
  email: string
  avatar: string
}

interface AuthResponse {
  message?: string
  user?: AuthUser
}

async function authRequest(
  endpoint: string,
  method: 'GET' | 'POST' | 'PATCH',
  body?: Record<string, string>,
): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method,
    credentials: 'include',
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  })

  const data = (await response.json()) as AuthResponse

  if (!response.ok) {
    throw new Error(data.message || 'Ocurrió un error de autenticación.')
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
  return authRequest('/signin', 'POST', {
    email,
    password,
  })
}

export async function getCurrentUser(): Promise<AuthUser> {
  const data = await authRequest('/me', 'GET')

  if (!data.user) {
    throw new Error('No se pudo recuperar la información del usuario.')
  }

  return data.user
}

export async function updateCurrentUser(
  updates: { name?: string; avatar?: string },
): Promise<AuthUser> {
  const data = await authRequest('/me', 'PATCH', updates)

  if (!data.user) {
    throw new Error('No se pudo actualizar la información del usuario.')
  }

  return data.user
}

export async function signout(): Promise<void> {
  await authRequest('/signout', 'POST')
}
