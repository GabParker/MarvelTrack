import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { connectDatabase } from './config/database'
import authRouter from './routes/auth.routes'

const app = express()
const PORT = Number(process.env.PORT) || 3001

// Orígenes permitidos para el frontend de MarvelTrack.
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  process.env.CLIENT_URL,
].filter((origin): origin is string => Boolean(origin))

// Configuración de CORS y cookies.
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true)
        return
      }

      callback(new Error('Origen no permitido por CORS.'))
    },
    credentials: true,
  }),
)

// Middlewares para procesar solicitudes.
app.use(express.json())
app.use(cookieParser())

// Ruta principal.
app.get('/', (_req, res) => {
  res.json({
    message: '¡Bienvenido al servidor de MarvelTrack!',
  })
})

// Ruta para comprobar el estado del servidor.
app.get('/api/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'El servidor de MarvelTrack funciona correctamente.',
  })
})

// Rutas de autenticación.
app.use('/api/auth', authRouter)

// Iniciar el servidor después de conectar MongoDB.
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
