import type { Character } from '../types/Character'
import { ALIGNMENT_LABELS } from '../config/constants'

type CharacterCardProps = {
  character: Character
  onOpen?: (character: Character) => void
  isFavorite?: boolean
  isFavoriteLoading?: boolean
  onToggleFavorite?: (character: Character) => void
}

export default function CharacterCard({
  character,
  onOpen,
  isFavorite = false,
  isFavoriteLoading = false,
  onToggleFavorite,
}: CharacterCardProps) {
  const alignmentLabel = ALIGNMENT_LABELS[character.alignment]

  return (
    <article className="character-card">
      <button
        type="button"
        className="character-card__open"
        onClick={() => onOpen?.(character)}
        aria-label={`Ver detalles de ${character.name}`}
      >
        <div
          className={`character-card__art character-card__art--${character.name
            .toLowerCase()
            .replace(/\s+/g, '')}`}
        >
          <img
            src={character.image}
            alt={`Imagen de ${character.name}`}
            loading="lazy"
            width="400"
            height="400"
          />
        </div>

        <div className="character-card__content">
          <p className="character-card__universe">
            {character.universe}
          </p>

          <h3>{character.name}</h3>
          <p>{character.description}</p>

          <span
            className={`character-alignment character-alignment--${character.alignment}`}
          >
            {alignmentLabel}
          </span>
        </div>
      </button>

      {onToggleFavorite && (
        <button
          type="button"
          className={`character-card__favorite ${
            isFavorite ? 'is-favorite' : ''
          }`}
          onClick={() => onToggleFavorite(character)}
          disabled={isFavoriteLoading}
          aria-pressed={isFavorite}
          aria-label={
            isFavorite
              ? `Quitar ${character.name} de favoritos`
              : `Agregar ${character.name} a favoritos`
          }
        >
          {isFavoriteLoading
            ? 'Guardando…'
            : isFavorite
              ? '♥ En favoritos'
              : '♡ Agregar a favoritos'}
        </button>
      )}
    </article>
  )
}
