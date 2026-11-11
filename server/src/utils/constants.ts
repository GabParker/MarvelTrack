export const HTTP_STATUS = {
  OK: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
} as const

export const ERROR_MESSAGES = {
  BAD_REQUEST: 'La solicitud contiene información inválida.',
  INVALID_JSON: 'El formato JSON de la solicitud no es válido.',
  UNAUTHORIZED: 'No tienes autorización para acceder a este recurso.',
  FORBIDDEN: 'No tienes permiso para realizar esta operación.',
  NOT_FOUND: 'La ruta solicitada no existe.',
  INTERNAL_SERVER_ERROR: 'Error interno del servidor.',
  CORS_ORIGIN: 'Origen no permitido por CORS.',
} as const
