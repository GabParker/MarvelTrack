import type { Character } from '../types/Character'

const API_URL = import.meta.env.VITE_API_URL

if (!API_URL) {
  throw new Error('Falta configurar VITE_API_URL.')
}

const API_BASE_URL = `${API_URL.replace(/\/$/, '')}/api/favorites`
const TOKEN_KEY = 'marveltrack_token'

export interface Favorite {
  _id: string
  owner: string
  characterId: number
  name: string
  image: string
}

interface FavoritesResponse {
  favorites: Favorite[]
}

interface FavoriteResponse {
  message: string
  favorite: Favorite
}

async function favoritesRequest(
  endpoint: string,
  method: 'GET' | 'POST' | 'DELETE',
  body?: Record<string, string | number>,
): Promise<FavoritesResponse | FavoriteResponse> {
  const token = localStorage.getItem(TOKEN_KEY)

  if (!token) {
    throw new Error('Debes iniciar sesión para gestionar favoritos.')
  }

  const headers: HeadersInit = {
    Authorization: `Bearer ${token}`,
  }

  if (body) {
    headers['Content-Type'] = 'application/json'
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(
      data.message || 'No se pudo completar la operación de favoritos.',
    )
  }

  return data as FavoritesResponse | FavoriteResponse
}

export async function getFavorites(): Promise<Favorite[]> {
  const data = await favoritesRequest('', 'GET')

  return (data as FavoritesResponse).favorites
}

export async function addFavorite(
  character: Character,
): Promise<Favorite> {
  const data = await favoritesRequest('/', 'POST', {
    characterId: character.id,
    name: character.name,
    image: character.image,
  })

  return (data as FavoriteResponse).favorite
}

export async function removeFavorite(
  favoriteId: string,
): Promise<void> {
  await favoritesRequest(`/${favoriteId}`, 'DELETE')
}

