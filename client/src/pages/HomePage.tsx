import { useEffect, useMemo, useState } from 'react'
import type { Character } from '../types/Character'
import { getMarvelCharacters } from '../utils/charactersApi'
import { CHARACTERS_PER_PAGE } from '../config/constants'
import CharacterCard from '../components/CharacterCard'

type AlignmentFilter = 'all' | 'hero' | 'villain' | 'neutral'

function HomePage() {
  const [characters, setCharacters] = useState<Character[]>([])
  const [search, setSearch] = useState('')
  const [alignment, setAlignment] = useState<AlignmentFilter>('all')
  const [visibleCount, setVisibleCount] = useState(CHARACTERS_PER_PAGE)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedCharacter, setSelectedCharacter] =
    useState<Character | null>(null)

  useEffect(() => {
    let isActive = true

    async function loadCharacters() {
      try {
        setIsLoading(true)
        setError('')

        const data = await getMarvelCharacters()

        if (isActive) {
          setCharacters(data)
        }
      } catch {
        if (isActive) {
          setError(
            'No pudimos cargar los personajes. Comprueba tu conexión e inténtalo de nuevo.',
          )
        }
      } finally {
        if (isActive) {
          setIsLoading(false)
        }
      }
    }

    void loadCharacters()

    return () => {
      isActive = false
    }
  }, [])

  useEffect(() => {
    if (!selectedCharacter) return

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setSelectedCharacter(null)
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [selectedCharacter])

  const filteredCharacters = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase()

    return characters.filter((character) => {
      const matchesSearch =
        character.name.toLowerCase().includes(normalizedSearch) ||
        character.universe.toLowerCase().includes(normalizedSearch)

      const matchesAlignment =
        alignment === 'all' || character.alignment === alignment

      return matchesSearch && matchesAlignment
    })
  }, [characters, search, alignment])

  const visibleCharacters = filteredCharacters.slice(0, visibleCount)

  function handleLoadMore() {
    setVisibleCount((currentCount) => currentCount + CHARACTERS_PER_PAGE)
  }

  function handleSearchChange(value: string) {
    setSearch(value)
    setVisibleCount(CHARACTERS_PER_PAGE)
  }

  function handleAlignmentChange(value: AlignmentFilter) {
    setAlignment(value)
    setVisibleCount(CHARACTERS_PER_PAGE)
  }

  const hasMoreCharacters = visibleCount < filteredCharacters.length

  const alignmentLabels: Record<Character['alignment'], string> = {
    hero: 'Héroe',
    villain: 'Villano',
    neutral: 'Neutral',
  }

  return (
    <main className="page">
      <section className="hero">
        <p className="eyebrow">EXPLORA EL MULTIVERSO</p>
        <h1>Descubre tu próximo héroe favorito</h1>
        <p className="hero__description">
          Explora personajes, descubre sus universos y conoce a las figuras que
          hacen extraordinario el mundo de los cómics.
        </p>
      </section>

      <section className="characters-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">ARCHIVO DE PERSONAJES</p>
            <h2>Explorar personajes</h2>
          </div>

          <span className="characters__count">
            {isLoading
              ? 'Cargando…'
              : `${filteredCharacters.length} personajes`}
          </span>
        </div>

        <div className="characters__controls">
          <label className="search-field">
            <span className="visually-hidden">Buscar personajes</span>
            <input
              type="search"
              placeholder="Buscar por nombre o universo…"
              value={search}
              onChange={(event) => handleSearchChange(event.target.value)}
            />
          </label>

          <div className="filter-buttons" aria-label="Filtrar personajes">
            <button
              type="button"
              className={
                alignment === 'all'
                  ? 'filter-button is-active'
                  : 'filter-button'
              }
              onClick={() => handleAlignmentChange('all')}
              aria-pressed={alignment === 'all'}
            >
              Todos
            </button>

            <button
              type="button"
              className={
                alignment === 'hero'
                  ? 'filter-button is-active'
                  : 'filter-button'
              }
              onClick={() => handleAlignmentChange('hero')}
              aria-pressed={alignment === 'hero'}
            >
              Héroes
            </button>

            <button
              type="button"
              className={
                alignment === 'villain'
                  ? 'filter-button is-active'
                  : 'filter-button'
              }
              onClick={() => handleAlignmentChange('villain')}
              aria-pressed={alignment === 'villain'}
            >
              Villanos
            </button>

            <button
              type="button"
              className={
                alignment === 'neutral'
                  ? 'filter-button is-active'
                  : 'filter-button'
              }
              onClick={() => handleAlignmentChange('neutral')}
              aria-pressed={alignment === 'neutral'}
            >
              Neutrales
            </button>
          </div>
        </div>

        {isLoading && (
          <p className="status-message" role="status">
            Cargando personajes del universo Marvel…
          </p>
        )}

        {!isLoading && error && (
          <p className="status-message auth-error" role="alert">
            {error}
          </p>
        )}

        {!isLoading && !error && filteredCharacters.length === 0 && (
          <p className="status-message">
            No encontramos personajes con esos criterios. Prueba otra búsqueda.
          </p>
        )}

        {!isLoading && !error && filteredCharacters.length > 0 && (
          <>
            <div className="character-grid">
              {visibleCharacters.map((character) => (
                <CharacterCard
                  key={character.id}
                  character={character}
                  onOpen={setSelectedCharacter}
                />
              ))}
            </div>

            {hasMoreCharacters && (
              <div className="load-more-container">
                <button
                  type="button"
                  className="primary-button"
                  onClick={handleLoadMore}
                >
                  Cargar más personajes
                </button>
              </div>
            )}
          </>
        )}
      </section>

      {selectedCharacter && (
        <div
          className="character-modal"
          onClick={() => setSelectedCharacter(null)}
        >
          <section
            className="character-modal__content"
            role="dialog"
            aria-modal="true"
            aria-labelledby="character-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="character-modal__close"
              onClick={() => setSelectedCharacter(null)}
              aria-label="Cerrar detalles"
            >
              ×
            </button>

            <img
              className="character-modal__image"
              src={selectedCharacter.image}
              alt={`Imagen de ${selectedCharacter.name}`}
            />

            <div className="character-modal__details">
              <p className="eyebrow">{selectedCharacter.universe}</p>

              <h2 id="character-modal-title">
                {selectedCharacter.name}
              </h2>

              <p>{selectedCharacter.description}</p>

              <span
                className={`character-alignment character-alignment--${selectedCharacter.alignment}`}
              >
                {alignmentLabels[selectedCharacter.alignment]}
              </span>
            </div>
          </section>
        </div>
      )}
    </main>
  )
}

export default HomePage
