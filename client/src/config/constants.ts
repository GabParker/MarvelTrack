import type { Character } from '../types/Character'

export const CHARACTERS_PER_PAGE = 24

export const MARVEL_API_URL =
  'https://akabab.github.io/superhero-api/api/all.json'

export const MARVEL_CHARACTER_NAMES = [
  'thor',
  'hawkeye',
  'jean grey',
  'phoenix',
]

export const ALIGNMENT_LABELS: Record<Character['alignment'], string> = {
  hero: 'Héroe',
  villain: 'Villano',
  neutral: 'Neutral',
}