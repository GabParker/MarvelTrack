import { useMemo, useState } from 'react'
import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom'
import './App.css'

type Character = {
  id: number
  name: string
  universe: string
  description: string
  initials: string
  alignment: 'hero' | 'villain'
  style: string
}

const characters: Character[] = [
  {
    id: 1,
    name: 'Iron Man',
    universe: 'AVENGERS',
    description: 'Genio, inventor y héroe con una armadura extraordinaria.',
    initials: 'IM',
    alignment: 'hero',
    style: 'character-card__art--ironman',
  },
  {
    id: 2,
    name: 'Spider-Man',
    universe: 'NEW YORK',
    description: 'Un héroe con grandes poderes y una gran responsabilidad.',
    initials: 'SM',
    alignment: 'hero',
    style: 'character-card__art--spiderman',
  },
  {
    id: 3,
    name: 'Doctor Strange',
    universe: 'MYSTIC ARTS',
    description: 'Protector de la Tierra frente a amenazas místicas.',
    initials: 'DS',
    alignment: 'hero',
    style: 'character-card__art--strange',
  },
  {
    id: 4,
    name: 'Thanos',
    universe: 'THE INFINITY SAGA',
    description: 'Un poderoso titán decidido a imponer su visión del equilibrio.',
    initials: 'TH',
    alignment: 'villain',
    style: 'character-card__art--thanos',
  },
  {
    id: 5,
    name: 'Loki',
    universe: 'ASGARD',
    description: 'El astuto dios de las travesuras, lleno de secretos.',
    initials: 'LO',
    alignment: 'villain',
    style: 'character-card__art--loki',
  },
  {
    id: 6,
    name: 'Doctor Doom',
    universe: 'LATVERIA',
    description: 'Un brillante científico y gobernante con una armadura imponente.',
    initials: 'DD',
    alignment: 'villain',
    style: 'character-card__art--doom',
  },
]

function HomePage() {
  const [search, setSearch] = useState('')
  const [alignment, setAlignment] = useState<'all' | 'hero' | 'villain'>('all')

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
  }, [search, alignment])

  return (
    <main className="page">
      <section className="hero">
        <p className="eyebrow">TU UNIVERSO MARVEL</p>
        <h1>Descubre tu próximo héroe favorito.</h1>
        <p className="hero__description">
          Explora personajes, descubre sus historias y construye tu propia
          colección del universo Marvel.
        </p>
        <a className="primary-button" href="#characters">
          Explorar personajes
        </a>
      </section>

      <section className="characters" id="characters">
        <div className="section-heading">
          <div>
            <p className="eyebrow">ARCHIVO DE PERSONAJES</p>
            <h2>Explora el universo</h2>
          </div>
          <span className="characters__count">
            {filteredCharacters.length}{' '}
            {filteredCharacters.length === 1 ? 'personaje' : 'personajes'}
          </span>
        </div>

        <div className="character-filters">
          <label className="character-search">
            <span>Buscar personajes</span>
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Ej. Spider-Man, Asgard..."
            />
          </label>

          <div className="filter-buttons" aria-label="Filtrar personajes">
            <button
              type="button"
              className={alignment === 'all' ? 'filter-button is-active' : 'filter-button'}
              onClick={() => setAlignment('all')}
              aria-pressed={alignment === 'all'}
            >
              Todos
            </button>
            <button
              type="button"
              className={alignment === 'hero' ? 'filter-button is-active' : 'filter-button'}
              onClick={() => setAlignment('hero')}
              aria-pressed={alignment === 'hero'}
            >
              Héroes
            </button>
            <button
              type="button"
              className={alignment === 'villain' ? 'filter-button is-active' : 'filter-button'}
              onClick={() => setAlignment('villain')}
              aria-pressed={alignment === 'villain'}
            >
              Villanos
            </button>
          </div>
        </div>

        {filteredCharacters.length > 0 ? (
          <div className="character-grid">
            {filteredCharacters.map((character) => (
              <article className="character-card" key={character.id}>
                <div className={`character-card__art ${character.style}`}>
                  <span className="character-card__symbol">
                    {character.initials}
                  </span>
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
                    {character.alignment === 'hero' ? 'Héroe' : 'Villano'}
                  </span>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <h3>No encontramos personajes</h3>
            <p>Prueba con otro nombre o cambia el filtro seleccionado.</p>
            <button
              className="filter-button"
              type="button"
              onClick={() => {
                setSearch('')
                setAlignment('all')
              }}
            >
              Limpiar búsqueda
            </button>
          </div>
        )}

        <p className="demo-notice">
          Catálogo de muestra para desarrollo. Conectaremos los personajes a
          una API en una siguiente etapa.
        </p>
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

function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <header className="site-header">
          <NavLink className="brand" to="/" aria-label="MarvelTrack, inicio">
            <span className="brand__mark">M</span>
            <span>
              MARVEL<span className="brand__accent">TRACK</span>
            </span>
          </NavLink>

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
              to="/about"
              className={({ isActive }) =>
                isActive ? 'site-nav__link is-active' : 'site-nav__link'
              }
            >
              Sobre el autor
            </NavLink>
          </nav>
        </header>

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
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

        <footer className="site-footer">
          <p>MARVELTRACK</p>
          <p>Proyecto independiente de práctica. No afiliado a Marvel.</p>
        </footer>
      </div>
    </BrowserRouter>
  )
}

export default App