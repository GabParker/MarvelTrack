import type { RequestHandler } from 'express'
import { HTTP_STATUS, ERROR_MESSAGES } from '../utils/constants'

export const notFound: RequestHandler = (_req, res) => {
  res.status(HTTP_STATUS.NOT_FOUND).json({
    message: ERROR_MESSAGES.NOT_FOUND,
  })
}
