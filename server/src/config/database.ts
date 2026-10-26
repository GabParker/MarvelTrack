import mongoose from 'mongoose'

export async function connectDatabase(): Promise<void> {
  const databaseUrl = process.env.DATABASE_URL

  if (!databaseUrl) {
    throw new Error(
      'Falta configurar la variable de entorno DATABASE_URL.',
    )
  }

  try {
    await mongoose.connect(databaseUrl)

    console.log('Conexión con MongoDB establecida correctamente.')
    console.log('Base de datos activa:', mongoose.connection.name)
  } catch (error) {
    console.error('No se pudo conectar con MongoDB:', error)
    throw error
  }
}
