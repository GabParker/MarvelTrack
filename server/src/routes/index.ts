import { Router } from 'express'
import authRouter from './auth.routes'
import favoritesRouter from './favorites.routes'

const router = Router()

router.use('/auth', authRouter)
router.use('/favorites', favoritesRouter)

export default router
