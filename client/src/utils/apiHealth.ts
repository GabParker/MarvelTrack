type ApiHealth = {
  status: string
  message: string
}

export async function checkApiHealth(): Promise<ApiHealth> {
  const response = await fetch('http://localhost:3001/api/health')

  if (!response.ok) {
    throw new Error('No se pudo conectar con el servidor de MarvelTrack.')
  }

  return response.json() as Promise<ApiHealth>
}
