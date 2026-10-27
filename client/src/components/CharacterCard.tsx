
import type { Character } from '../types/Character'

type CharacterCardProps = {
  character: Character
  onOpen?: (character: Character) => void
}

export default function CharacterCard({
  character,
  onOpen,
}: CharacterCardProps) {
  const alignmentLabel =
    character.alignment === 'villain' ? 'Villano' : 'Héroe'

  return (
    <article className="character-card">
      <button
        type="button"
        className="character-card__open"
        onClick={() => {
          console.log('Tarjeta seleccionada:', character.name)
          onOpen?.(character)
        }}
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
    </article>
  )
}
