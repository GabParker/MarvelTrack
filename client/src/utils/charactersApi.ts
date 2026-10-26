import type { Character } from '../types/Character'

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

const API_URL =
  'https://akabab.github.io/superhero-api/api/all.json'

const MARVEL_CHARACTER_NAMES = [
  'thor',
  'hawkeye',
  'jean grey',
  'phoenix',
]

export async function getMarvelCharacters(): Promise<Character[]> {
  const response = await fetch(API_URL)

  if (!response.ok) {
    throw new Error('No fue posible cargar los personajes.')
  }

  const data: SuperheroApiCharacter[] = await response.json()

  return data
    .filter((character) => {
      const isMarvelPublisher =
        character.biography.publisher === 'Marvel Comics'

      const isRequiredCharacter = MARVEL_CHARACTER_NAMES.includes(
        character.name.trim().toLowerCase(),
      )

      return isMarvelPublisher || isRequiredCharacter
    })
    .map((character) => ({
      id: character.id,
      name: character.name,
      universe: character.biography.publisher.toUpperCase(),
      description:
        character.biography.firstAppearance &&
        character.biography.firstAppearance !== '-'
          ? `Primera aparición: ${character.biography.firstAppearance}`
          : 'Descubre más sobre este personaje de Marvel.',
      image: character.images.md,
      alignment:
        character.biography.alignment === 'bad'
          ? 'villain'
          : 'hero',
    }))
}
