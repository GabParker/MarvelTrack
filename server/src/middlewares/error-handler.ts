import type { ErrorRequestHandler } from 'express'
import { HTTP_STATUS, ERROR_MESSAGES } from '../utils/constants'

interface HandledError {
  message?: string
  status?: number
  type?: string
}

export const errorHandler: ErrorRequestHandler = (
  error: unknown,
  _req,
  res,
  _next,
) => {
  void _next

  const handledError = error as HandledError

  // Error de JSON malformado generado por express.json().
  if (handledError.type === 'entity.parse.failed') {
    res.status(HTTP_STATUS.BAD_REQUEST).json({
      message: ERROR_MESSAGES.INVALID_JSON,
    })
    return
  }

  // Error de origen no permitido por CORS.
  if (handledError.message === ERROR_MESSAGES.CORS_ORIGIN) {
    res.status(HTTP_STATUS.FORBIDDEN).json({
      message: ERROR_MESSAGES.CORS_ORIGIN,
    })
    return
  }

  console.error('Error interno del servidor:', error)

  res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
  })
}
