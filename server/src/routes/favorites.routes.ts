import { Router } from 'express'
import {
  getFavorites,
  addFavorite,
  deleteFavorite,
} from '../controllers/favorites.controller'
import { authMiddleware } from '../middlewares/auth.middleware'

const router = Router()

// Todas las rutas requieren autenticación.
router.use(authMiddleware)

router.get('/', getFavorites)
router.post('/', addFavorite)
router.delete('/:id', deleteFavorite)

export default router
