import type { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import User from '../models/User'
import type { AuthenticatedRequest } from '../middlewares/auth.middleware'

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET

  if (!secret) {
    throw new Error('Falta configurar JWT_SECRET en el archivo .env.')
  }

  return secret
}

function getCookieOptions() {
  const isProduction = process.env.NODE_ENV === 'production'

  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: (isProduction ? 'none' : 'lax') as 'none' | 'lax',
    path: '/',
  }
}

function setSessionCookie(res: Response, token: string): void {
  res.cookie('marveltrack_token', token, {
    ...getCookieOptions(),
    maxAge: 7 * 24 * 60 * 60 * 1000,
  })
}

export async function signup(req: Request, res: Response): Promise<void> {
  try {
    const { name, email, password, avatar } = req.body as {
      name?: string
      email?: string
      password?: string
      avatar?: string
    }

    if (
      typeof name !== 'string' ||
      typeof email !== 'string' ||
      typeof password !== 'string'
    ) {
      res.status(400).json({
        message: 'Nombre, correo y contraseña son obligatorios.',
      })
      return
    }

    const normalizedName = name.trim()
    const normalizedEmail = email.trim().toLowerCase()

    if (normalizedName.length < 2 || normalizedName.length > 40) {
      res.status(400).json({
        message: 'El nombre debe tener entre 2 y 40 caracteres.',
      })
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      res.status(400).json({
        message: 'Introduce un correo electrónico válido.',
      })
      return
    }

    if (password.length < 8) {
      res.status(400).json({
        message: 'La contraseña debe tener al menos 8 caracteres.',
      })
      return
    }

    if (avatar !== undefined && typeof avatar !== 'string') {
      res.status(400).json({
        message: 'El avatar debe ser una URL de texto.',
      })
      return
    }

    const existingUser = await User.findOne({ email: normalizedEmail })

    if (existingUser) {
      res.status(409).json({
        message: 'Ya existe una cuenta con ese correo electrónico.',
      })
      return
    }

    const passwordHash = await bcrypt.hash(password, 12)

    const user = await User.create({
      name: normalizedName,
      email: normalizedEmail,
      passwordHash,
      avatar: avatar?.trim() || '',
    })

    res.status(201).json({
      message: 'Usuario registrado correctamente.',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      },
    })
  } catch (error) {
    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      error.code === 11000
    ) {
      res.status(409).json({
        message: 'Ya existe una cuenta con ese correo electrónico.',
      })
      return
    }

    console.error('Error al registrar usuario:', error)

    res.status(500).json({
      message: 'No se pudo registrar el usuario.',
    })
  }
}

export async function signin(req: Request, res: Response): Promise<void> {
  try {
    const { email, password } = req.body as {
      email?: string
      password?: string
    }

    if (
      typeof email !== 'string' ||
      typeof password !== 'string' ||
      !email.trim() ||
      !password
    ) {
      res.status(400).json({
        message: 'El correo y la contraseña son obligatorios.',
      })
      return
    }

    const normalizedEmail = email.trim().toLowerCase()

    const user = await User.findOne({ email: normalizedEmail }).select(
      '+passwordHash',
    )

    if (!user) {
      res.status(401).json({
        message: 'Correo o contraseña incorrectos.',
      })
      return
    }

    const passwordMatches = await bcrypt.compare(
      password,
      user.passwordHash,
    )

    if (!passwordMatches) {
      res.status(401).json({
        message: 'Correo o contraseña incorrectos.',
      })
      return
    }

    const token = jwt.sign(
      { id: user.id },
      getJwtSecret(),
      { expiresIn: '7d' },
    )

    setSessionCookie(res, token)

    res.status(200).json({
      message: 'Inicio de sesión correcto.',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      },
    })
  } catch (error) {
    console.error('Error al iniciar sesión:', error)

    res.status(500).json({
      message: 'No se pudo iniciar sesión.',
    })
  }
}

export async function getCurrentUser(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const authenticatedReq = req as AuthenticatedRequest
    const userId = authenticatedReq.userId

    if (!userId) {
      res.status(401).json({
        message: 'Debes iniciar sesión para consultar tu perfil.',
      })
      return
    }

    const user = await User.findById(userId)

    if (!user) {
      res.status(401).json({
        message: 'La cuenta asociada a esta sesión ya no existe.',
      })
      return
    }

    res.status(200).json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      },
    })
  } catch (error) {
    console.error('Error al recuperar el usuario autenticado:', error)

    res.status(500).json({
      message: 'No se pudo recuperar la sesión del usuario.',
    })
  }
}

export async function updateCurrentUser(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const authenticatedReq = req as AuthenticatedRequest
    const userId = authenticatedReq.userId

    if (!userId) {
      res.status(401).json({
        message: 'Debes iniciar sesión para editar tu perfil.',
      })
      return
    }

    const { name, avatar } = req.body as {
      name?: unknown
      avatar?: unknown
    }

    const updates: { name?: string; avatar?: string } = {}

    if (name !== undefined) {
      if (typeof name !== 'string') {
        res.status(400).json({ message: 'El nombre debe ser texto.' })
        return
      }

      const normalizedName = name.trim()

      if (normalizedName.length < 2 || normalizedName.length > 40) {
        res.status(400).json({
          message: 'El nombre debe tener entre 2 y 40 caracteres.',
        })
        return
      }

      updates.name = normalizedName
    }

    if (avatar !== undefined) {
      if (typeof avatar !== 'string') {
        res.status(400).json({
          message: 'La foto debe ser una URL de texto.',
        })
        return
      }

      const normalizedAvatar = avatar.trim()

      if (normalizedAvatar) {
        try {
          const parsedUrl = new URL(normalizedAvatar)

          if (
            !['http:', 'https:'].includes(parsedUrl.protocol) ||
            !parsedUrl.hostname.includes('.')
          ) {
            throw new Error('URL no válida')
          }
        } catch {
          res.status(400).json({
            message: 'Introduce una URL de imagen válida.',
          })
          return
        }
      }

      updates.avatar = normalizedAvatar
    }

    if (Object.keys(updates).length === 0) {
      res.status(400).json({
        message: 'Indica el nombre o la foto que deseas actualizar.',
      })
      return
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true, runValidators: true },
    )

    if (!user) {
      res.status(404).json({ message: 'No se encontró el usuario.' })
      return
    }

    res.status(200).json({
      message: 'Perfil actualizado correctamente.',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      },
    })
  } catch (error) {
    console.error('Error al actualizar el perfil:', error)

    res.status(500).json({
      message: 'No se pudo actualizar el perfil.',
    })
  }
}

export function signout(_req: Request, res: Response): void {
  res.clearCookie('marveltrack_token', getCookieOptions())

  res.status(200).json({
    message: 'Sesión cerrada correctamente.',
  })
}
