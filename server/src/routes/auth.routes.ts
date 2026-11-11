import { Router } from 'express'
import {
  signup,
  signin,
  getCurrentUser,
  updateCurrentUser,
  signout,
} from '../controllers/auth.controller'
import { authMiddleware } from '../middlewares/auth.middleware'
import { authLimiter } from '../middlewares/auth-rate-limit'

const router = Router()

router.post('/signup', authLimiter, signup)
router.post('/signin', authLimiter, signin)
router.get('/me', authMiddleware, getCurrentUser)
router.patch('/me', authMiddleware, updateCurrentUser)
router.post('/signout', authMiddleware, signout)

export default router
