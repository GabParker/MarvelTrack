import { Router } from 'express'
import {
  signup,
  signin,
  getCurrentUser,
  updateCurrentUser,
  signout,
} from '../controllers/auth.controller'
import { authMiddleware } from '../middlewares/auth.middleware'

const router = Router()

router.post('/signup', signup)
router.post('/signin', signin)
router.get('/me', authMiddleware, getCurrentUser)
router.patch('/me', authMiddleware, updateCurrentUser)
router.post('/signout', signout)

export default router
