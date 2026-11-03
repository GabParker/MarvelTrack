import type { Character } from '../types/Character'
import {
  MARVEL_API_URL,
  MARVEL_CHARACTER_NAMES,
} from '../config/constants'

type SuperheroApiCharacter = {
  id: number
  name: string
  images: {
    md: string
  }
  biography: {
    publisher: string
    alignment: string
    firstAppearance: string
  }
}

let cachedCharacters: Character[] | null = null
let charactersRequest: Promise<Character[]> | null = null

export async function getMarvelCharacters(): Promise<Character[]> {
  if (cachedCharacters) return cachedCharacters
  if (charactersRequest) return charactersRequest

  charactersRequest = (async (): Promise<Character[]> => {
    const response = await fetch(MARVEL_API_URL)

    if (!response.ok) {
      throw new Error('No fue posible cargar los personajes.')
    }

    const data: SuperheroApiCharacter[] = await response.json()

    const characters: Character[] = data
      .filter((character) => {
        const isMarvelPublisher =
          character.biography.publisher === 'Marvel Comics'

        const isRequiredCharacter = MARVEL_CHARACTER_NAMES.includes(
          character.name.trim().toLowerCase(),
        )

        return isMarvelPublisher || isRequiredCharacter
      })
      .map((character): Character => {
        const apiAlignment = character.biography.alignment
          .trim()
          .toLowerCase()

        let alignment: Character['alignment'] = 'neutral'

        if (apiAlignment === 'good') alignment = 'hero'
        if (apiAlignment === 'bad') alignment = 'villain'

        const firstAppearance = character.biography.firstAppearance

        const description =
          firstAppearance && firstAppearance !== '-'
            ? `Primera aparición: ${firstAppearance}`
            : 'Descubre más sobre este personaje de Marvel.'

        return {
          id: character.id,
          name: character.name,
          universe: character.biography.publisher.toUpperCase(),
          description,
          image: character.images.md,
          alignment,
        }
      })

    cachedCharacters = characters
    return characters
  })()

  try {
    return await charactersRequest
  } catch (error) {
    charactersRequest = null
    throw error
  }
}
