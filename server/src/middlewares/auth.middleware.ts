import type { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

interface AuthTokenPayload {
  id: string
}

export interface AuthenticatedRequest extends Request {
  userId?: string
}

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET

  if (!secret) {
    throw new Error('Falta configurar JWT_SECRET en el archivo .env.')
  }

  return secret
}

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const authenticatedReq = req as AuthenticatedRequest
  const authorization = req.headers.authorization

  if (!authorization || !authorization.startsWith('Bearer ')) {
    res.status(401).json({
      message: 'Debes iniciar sesión para acceder a este recurso.',
    })
    return
  }

  const token = authorization.slice(7).trim()

  if (!token) {
    res.status(401).json({
      message: 'La sesión no es válida.',
    })
    return
  }

  try {
    const payload = jwt.verify(token, getJwtSecret()) as AuthTokenPayload

    if (typeof payload.id !== 'string' || !payload.id) {
      res.status(401).json({
        message: 'La sesión no es válida.',
      })
      return
    }

    authenticatedReq.userId = payload.id
    next()
  } catch {
    res.status(401).json({
      message: 'La sesión ha caducado o no es válida. Inicia sesión nuevamente.',
    })
  }
}