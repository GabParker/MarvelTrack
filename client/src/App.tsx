import { useEffect, useMemo, useState } from 'react'
import {
  BrowserRouter,
  NavLink,
  Route,
  Routes,
} from 'react-router-dom'

import type { Character } from './types/Character'
import type { Team } from './types/Team'

import { getMarvelCharacters } from './utils/charactersApi'
import { teams } from './data/teams'

import CharacterCard from './components/CharacterCard'
import TeamCard from './components/TeamCard'
import TeamDetails from './components/TeamDetails/TeamDetails'
import ProtectedRoute from './components/ProtectedRoute'

import { useAuth, AuthProvider } from './contexts/AuthContext'

import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ProfilePage from './pages/ProfilePage'

import './App.css'

const CHARACTERS_PER_PAGE = 24

function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    function handleScroll() {
      setIsVisible(window.scrollY > 300)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  if (!isVisible) {
    return null
  }

  return (
    <button
      className="back-to-top"
      type="button"
      onClick={scrollToTop}
      aria-label="Volver al inicio de la página"
    >
      <span aria-hidden="true">↑</span>
      Volver arriba
    </button>
  )
}

function HomePage() {
  const [characters, setCharacters] = useState<Character[]>([])
  const [search, setSearch] = useState('')
  const [alignment, setAlignment] = useState<'all' | 'hero' | 'villain'>('all')
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
    if (!selectedCharacter) {
      return
    }

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

  useEffect(() => {
    setVisibleCount(CHARACTERS_PER_PAGE)
  }, [search, alignment])

  const filteredCharacters = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase()

    return characters.filter((character) => {
      const matchesSearch =
        character.name.toLowerCase().includes(normalizedSearch) ||
        character.universe.toLowerCase().includes(normalizedSearch)

      const normalizedAlignment = String(
        character.alignment ?? '',
      ).toLowerCase()

      const matchesAlignment =
        alignment === 'all' ||
        (alignment === 'hero' &&
          (normalizedAlignment === 'hero' ||
            normalizedAlignment === 'good')) ||
        (alignment === 'villain' &&
          (normalizedAlignment === 'villain' ||
            normalizedAlignment === 'bad' ||
            normalizedAlignment === 'evil'))

      return matchesSearch && matchesAlignment
    })
  }, [characters, search, alignment])

  const visibleCharacters = filteredCharacters.slice(0, visibleCount)

  function handleLoadMore() {
    setVisibleCount((currentCount) => currentCount + CHARACTERS_PER_PAGE)
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
              onChange={(event) => setSearch(event.target.value)}
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
              onClick={() => setAlignment('all')}
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
              onClick={() => setAlignment('hero')}
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
              onClick={() => setAlignment('villain')}
              aria-pressed={alignment === 'villain'}
            >
              Villanos
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

            {visibleCount < filteredCharacters.length && (
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
                {selectedCharacter.alignment === 'villain'
                  ? 'Villano'
                  : 'Héroe'}
              </span>
            </div>
          </section>
        </div>
      )}
    </main>
  )
}

function TeamsPage() {
  return (
    <main className="page">
      <section className="hero">
        <p className="eyebrow">UNIDOS SON MÁS FUERTES</p>
        <h1>Equipos del multiverso</h1>
        <p className="hero__description">
          Descubre a los grupos que unen fuerzas para enfrentar amenazas
          extraordinarias a través del universo.
        </p>
      </section>

      <section className="teams-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">ARCHIVO DE EQUIPOS</p>
            <h2>Conoce a los equipos</h2>
          </div>

          <span className="characters__count">
            {teams.length} equipos
          </span>
        </div>

        <div className="teams-grid">
          {teams.map((team: Team) => (
            <TeamCard key={team.id} team={team} />
          ))}
        </div>
      </section>
    </main>
  )
}

function AboutPage() {
  return (
    <main className="page about-page">
      <p className="eyebrow">DETRÁS DEL PROYECTO</p>
      <h1>Sobre el autor</h1>

      <p>
        ¡Hola! Soy el desarrollador de MarvelTrack. Este proyecto forma parte
        de mi recorrido de aprendizaje en desarrollo web y combina mi interés
        por la tecnología con el universo de los cómics.
      </p>

      <p>
        MarvelTrack busca ofrecer un espacio para explorar personajes,
        organizar favoritos y descubrir historias del multiverso.
      </p>

      <NavLink className="primary-button" to="/">
        Volver al catálogo
      </NavLink>
    </main>
  )
}

function SiteNavigation() {
  const { user, isLoading, logout } = useAuth()

  async function handleLogout() {
    try {
      await logout()
    } catch (error) {
      console.error('No se pudo cerrar la sesión:', error)
    }
  }

  return (
    <nav className="site-nav" aria-label="Navegación principal">
      <NavLink
        to="/"
        end
        className={({ isActive }) =>
          isActive ? 'site-nav__link is-active' : 'site-nav__link'
        }
      >
        Explorar
      </NavLink>

      <NavLink
        to="/teams"
        className={({ isActive }) =>
          isActive ? 'site-nav__link is-active' : 'site-nav__link'
        }
      >
        Equipos
      </NavLink>

      <NavLink
        to="/about"
        className={({ isActive }) =>
          isActive ? 'site-nav__link is-active' : 'site-nav__link'
        }
      >
        Sobre el autor
      </NavLink>

      {!isLoading && user ? (
        <>
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              isActive ? 'site-nav__link is-active' : 'site-nav__link'
            }
          >
            Mi perfil
          </NavLink>

          <button
            className="site-nav__link site-nav__button"
            type="button"
            onClick={handleLogout}
          >
            Cerrar sesión
          </button>
        </>
      ) : (
        <>
          <NavLink
            to="/login"
            className={({ isActive }) =>
              isActive ? 'site-nav__link is-active' : 'site-nav__link'
            }
          >
            Iniciar sesión
          </NavLink>

          <NavLink
            to="/register"
            className={({ isActive }) =>
              isActive ? 'site-nav__link is-active' : 'site-nav__link'
            }
          >
            Registrarse
          </NavLink>
        </>
      )}
    </nav>
  )
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/teams" element={<TeamsPage />} />
      <Route path="/teams/:teamId" element={<TeamDetails />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/profile" element={<ProfilePage />} />
      </Route>

      <Route
        path="*"
        element={
          <main className="page not-found">
            <h1>Universo no encontrado</h1>
            <p>La página que buscas no existe.</p>
            <NavLink className="primary-button" to="/">
              Volver al inicio
            </NavLink>
          </main>
        }
      />
    </Routes>
  )
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="app-shell">
          <header className="site-header">
            <NavLink
              className="brand"
              to="/"
              aria-label="MarvelTrack, inicio"
            >
              <span className="brand__mark">M</span>
              <span>
                MARVEL<span className="brand__accent">TRACK</span>
              </span>
            </NavLink>

            <SiteNavigation />
          </header>

          <AppRoutes />

          <footer className="site-footer">
            <p>MARVELTRACK</p>
            <p>Proyecto independiente de práctica. No afiliado a Marvel.</p>
          </footer>

          <ScrollToTopButton />
        </div>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
