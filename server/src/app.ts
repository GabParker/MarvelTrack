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

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  process.env.CLIENT_URL,
].filter((origin): origin is string => Boolean(origin))

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true)
        return
      }

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

async function startServer(): Promise<void> {
  try {
    await connectDatabase()

    app.listen(PORT, () => {
      console.log(`MarvelTrack API escuchando en el puerto ${PORT}`)
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
