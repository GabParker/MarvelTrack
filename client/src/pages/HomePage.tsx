import { useEffect, useMemo, useState } from 'react'
import type { Character } from '../types/Character'
import { getMarvelCharacters } from '../utils/charactersApi'
import {
  getFavorites,
  addFavorite,
  removeFavorite,
} from '../utils/favoritesApi'
import type { Favorite } from '../utils/favoritesApi'
import {
  ALIGNMENT_LABELS,
  CHARACTERS_PER_PAGE,
} from '../config/constants'
import CharacterCard from '../components/CharacterCard'
import { useAuth } from '../contexts/useAuth'

type AlignmentFilter =
  | 'all'
  | 'hero'
  | 'villain'
  | 'neutral'
  | 'favorites'

function HomePage() {
  const { user, isLoading: isAuthLoading } = useAuth()

  const [characters, setCharacters] = useState<Character[]>([])
  const [favorites, setFavorites] = useState<Favorite[]>([])
  const [favoriteLoadingIds, setFavoriteLoadingIds] = useState<Set<number>>(
    new Set(),
  )
  const [favoriteMessage, setFavoriteMessage] = useState('')
  const [favoriteError, setFavoriteError] = useState('')

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
    let isActive = true

    async function loadUserFavorites() {
      if (isAuthLoading) return

      if (!user) {
        setFavorites([])
        return
      }

      try {
        setFavoriteError('')
        const data = await getFavorites()

        if (isActive) {
          setFavorites(data)
        }
      } catch (err) {
        if (isActive) {
          setFavoriteError(
            err instanceof Error
              ? err.message
              : 'No se pudieron cargar tus favoritos.',
          )
        }
      }
    }

    void loadUserFavorites()

    return () => {
      isActive = false
    }
  }, [user, isAuthLoading])

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
        alignment === 'all' ||
        (alignment === 'favorites'
          ? Boolean(user) &&
            favorites.some(
              (favorite) => favorite.characterId === character.id,
            )
          : character.alignment === alignment)

      return matchesSearch && matchesAlignment
    })
  }, [characters, search, alignment, favorites, user])

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

  async function handleToggleFavorite(character: Character) {
    if (!user) {
      setFavoriteError('Inicia sesión para guardar personajes favoritos.')
      setFavoriteMessage('')
      return
    }

    if (favoriteLoadingIds.has(character.id)) return

    setFavoriteLoadingIds((current) => {
      const next = new Set(current)
      next.add(character.id)
      return next
    })

    setFavoriteError('')
    setFavoriteMessage('')

    const existingFavorite = favorites.find(
      (favorite) => favorite.characterId === character.id,
    )

    try {
      if (existingFavorite) {
        await removeFavorite(existingFavorite._id)

        setFavorites((current) =>
          current.filter(
            (favorite) => favorite._id !== existingFavorite._id,
          ),
        )

        setFavoriteMessage(`${character.name} se eliminó de tus favoritos.`)
      } else {
        const newFavorite = await addFavorite(character)

        setFavorites((current) => [...current, newFavorite])

        setFavoriteMessage(`${character.name} se agregó a tus favoritos.`)
      }
    } catch (err) {
      setFavoriteError(
        err instanceof Error
          ? err.message
          : 'No se pudo actualizar tu lista de favoritos.',
      )
    } finally {
      setFavoriteLoadingIds((current) => {
        const next = new Set(current)
        next.delete(character.id)
        return next
      })
    }
  }

  const hasMoreCharacters = visibleCount < filteredCharacters.length

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

            <button
              type="button"
              className={
                alignment === 'favorites'
                  ? 'filter-button is-active'
                  : 'filter-button'
              }
              onClick={() => handleAlignmentChange('favorites')}
              aria-pressed={alignment === 'favorites'}
            >
              ♥ Favoritos
            </button>
          </div>
        </div>

        {favoriteMessage && (
          <p className="auth-success" role="status">
            {favoriteMessage}
          </p>
        )}

        {favoriteError && (
          <p className="auth-error" role="alert">
            {favoriteError}
          </p>
        )}

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
            {alignment === 'favorites'
              ? !user
                ? 'Inicia sesión para consultar tus personajes favoritos.'
                : 'Todavía no tienes personajes favoritos. ¡Explora MarvelTrack y agrega algunos!'
              : 'No encontramos personajes con esos criterios. Prueba otra búsqueda.'}
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
                  isFavorite={favorites.some(
                    (favorite) => favorite.characterId === character.id,
                  )}
                  isFavoriteLoading={favoriteLoadingIds.has(character.id)}
                  onToggleFavorite={handleToggleFavorite}
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
                {ALIGNMENT_LABELS[selectedCharacter.alignment]}
              </span>
            </div>
          </section>
        </div>
      )}
    </main>
  )
}

export default HomePage
