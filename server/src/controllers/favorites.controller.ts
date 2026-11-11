import type { Request, Response } from 'express'
import mongoose from 'mongoose'
import Favorite from '../models/Favorite'
import type { AuthenticatedRequest } from '../middlewares/auth.middleware'

function getUserId(req: Request): string | undefined {
  return (req as AuthenticatedRequest).userId
}

// GET: Obtener los favoritos del usuario autenticado.
export async function getFavorites(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const userId = getUserId(req)

    if (!userId) {
      res.status(401).json({
        message: 'Debes iniciar sesión para consultar tus favoritos.',
      })
      return
    }

    const favorites = await Favorite.find({ owner: userId })
      .sort({ createdAt: -1 })

    res.status(200).json({ favorites })
  } catch (error) {
    console.error('Error al obtener favoritos:', error)

    res.status(500).json({
      message: 'No se pudieron recuperar tus favoritos.',
    })
  }
}

// POST: Agregar un personaje a favoritos.
export async function addFavorite(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const userId = getUserId(req)

    if (!userId) {
      res.status(401).json({
        message: 'Debes iniciar sesión para guardar favoritos.',
      })
      return
    }

    const { characterId, name, image } = req.body as {
      characterId?: unknown
      name?: unknown
      image?: unknown
    }

    if (
      typeof characterId !== 'number' ||
      !Number.isInteger(characterId) ||
      characterId < 1
    ) {
      res.status(400).json({
        message: 'El ID del personaje debe ser un número entero válido.',
      })
      return
    }

    if (typeof name !== 'string' || !name.trim()) {
      res.status(400).json({
        message: 'El nombre del personaje es obligatorio.',
      })
      return
    }

    if (image !== undefined && typeof image !== 'string') {
      res.status(400).json({
        message: 'La imagen debe ser una URL de texto.',
      })
      return
    }

    const normalizedImage = typeof image === 'string' ? image.trim() : ''

    if (normalizedImage) {
      try {
        const parsedUrl = new URL(normalizedImage)

        if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
          throw new Error('URL no válida')
        }
      } catch {
        res.status(400).json({
          message: 'Introduce una URL de imagen válida.',
        })
        return
      }
    }

    const favorite = await Favorite.create({
      owner: userId,
      characterId,
      name: name.trim(),
      image: normalizedImage,
    })

    res.status(201).json({
      message: 'Personaje agregado a favoritos correctamente.',
      favorite,
    })
  } catch (error) {
    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      error.code === 11000
    ) {
      res.status(409).json({
        message: 'Este personaje ya está en tus favoritos.',
      })
      return
    }

    console.error('Error al agregar favorito:', error)

    res.status(500).json({
      message: 'No se pudo agregar el personaje a favoritos.',
    })
  }
}

// DELETE: Eliminar un favorito del usuario autenticado.
export async function deleteFavorite(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const userId = getUserId(req)
    const { id } = req.params

    if (!userId) {
      res.status(401).json({
        message: 'Debes iniciar sesión para eliminar favoritos.',
      })
      return
    }

    if (!mongoose.isValidObjectId(id)) {
      res.status(400).json({
        message: 'El identificador del favorito no es válido.',
      })
      return
    }

    const favorite = await Favorite.findById(id)

    if (!favorite) {
      res.status(404).json({
        message: 'No se encontró el favorito solicitado.',
      })
      return
    }

    if (favorite.owner.toString() !== userId) {
      res.status(403).json({
        message: 'No tienes permiso para eliminar este favorito.',
      })
      return
    }

    await Favorite.findByIdAndDelete(id)

    res.status(200).json({
      message: 'Favorito eliminado correctamente.',
    })
  } catch (error) {
    console.error('Error al eliminar favorito:', error)

    res.status(500).json({
      message: 'No se pudo eliminar el favorito.',
    })
  }
}
