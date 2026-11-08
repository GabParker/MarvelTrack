import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { connectDatabase } from './config/database'
import authRouter from './routes/auth.routes'
import favoritesRouter from './routes/favorites.routes'

const app = express()
const PORT = Number(process.env.PORT) || 3001

app.disable('x-powered-by')
app.set('trust proxy', 1)

function normalizeOrigin(origin: string): string {
  try {
    return new URL(origin).origin
  } catch {
    return ''
  }
}

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'https://marveltrack-iota.vercel.app',
  process.env.CLIENT_URL,
]
  .filter((origin): origin is string => Boolean(origin))
  .map(normalizeOrigin)
  .filter(Boolean)

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) {
        callback(null, true)
        return
      }

      const normalizedOrigin = normalizeOrigin(origin)

      if (allowedOrigins.includes(normalizedOrigin)) {
        callback(null, true)
        return
      }

      console.warn(`Origen rechazado por CORS: ${origin}`)
      callback(new Error('Origen no permitido por CORS.'))
    },
  }),
)

app.use(express.json())

app.get('/', (_req, res) => {
  res.status(200).json({
    message: '¡Bienvenido al servidor de MarvelTrack!',
  })
})

app.get('/api/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'El servidor de MarvelTrack funciona correctamente.',
  })
})

app.use('/api/auth', authRouter)
app.use('/api/favorites', favoritesRouter)

app.use(
  (
    error: Error,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction,
  ) => {
    if (error.message === 'Origen no permitido por CORS.') {
      res.status(403).json({ message: error.message })
      return
    }

    console.error('Error interno del servidor:', error)
    res.status(500).json({ message: 'Error interno del servidor.' })
  },
)

async function startServer(): Promise<void> {
  try {
    await connectDatabase()

    app.listen(PORT, () => {
      console.log(`MarvelTrack API escuchando en el puerto ${PORT}`)
      console.log('Orígenes permitidos:', allowedOrigins)
    })
  } catch (error) {
    console.error(
      'MarvelTrack no pudo iniciar porque falló la conexión con MongoDB.',
      error,
    )

    process.exitCode = 1
  }
}

void startServer()
