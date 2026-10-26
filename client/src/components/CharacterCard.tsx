import type { Character } from '../types/Character'

type CharacterCardProps = {
  character: Character
}

export default function CharacterCard({
  character,
}: CharacterCardProps) {
  const alignmentLabel =
    character.alignment === 'villain' ? 'Villano' : 'Héroe'

  return (
    <article className="character-card">
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
    </article>
  )
}
