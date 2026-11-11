import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import type { Character } from '../../types/Character'
import type { Team } from '../../types/Team'
import { getMarvelCharacters } from '../../utils/charactersApi'
import { teams } from '../../data/teams'
import CharacterCard from '../CharacterCard'

function normalizeName(name: string): string {
  const aliases: Record<string, string> = {
    'the thing': 'thing',
    'ben grimm': 'thing',
    'invisible woman': 'invisiblewoman',
    'sue storm': 'invisiblewoman',
    'mister fantastic': 'misterfantastic',
    'reed richards': 'misterfantastic',
    'human torch': 'humantorch',
    'johnny storm': 'humantorch',
    'black widow': 'blackwidow',
    'natasha romanoff': 'blackwidow',
    'iron man': 'ironman',
    'tony stark': 'ironman',
    'captain america': 'captainamerica',
    'steve rogers': 'captainamerica',
    'professor x': 'professorx',
    'charles xavier': 'professorx',
    'jean grey': 'jeangrey',
    'jean grey summers': 'jeangrey',
    thor: 'thor',
    'thor odinson': 'thor',
    hawkeye: 'hawkeye',
    'clint barton': 'hawkeye',
  }

  const normalized = name.toLowerCase().replace(/[^a-z0-9]/g, '')

  return aliases[name.toLowerCase()] ?? normalized
}

function TeamDetails() {
  const { teamId } = useParams<{ teamId: string }>()

  const [characters, setCharacters] = useState<Character[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const team: Team | undefined = teams.find(
    (item) => item.id === teamId,
  )

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
            'No pudimos cargar las imágenes y los datos. Inténtalo de nuevo.',
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

  if (!team) {
    return (
      <main className="page not-found">
        <h1>Equipo no encontrado</h1>
        <p>No encontramos el equipo que buscas.</p>
        <Link className="primary-button" to="/teams">
          Volver a equipos
        </Link>
      </main>
    )
  }

  const teamMembers = team.members.map((member) => {
    const character = characters.find(
      (item) => normalizeName(item.name) === normalizeName(member),
    )

    return { member, character }
  })

  return (
    <main className="page team-details-page">
      <Link className="team-details__back" to="/teams">
        ← Volver a equipos
      </Link>

      <section className="hero teams-hero">
        <p className="eyebrow">ARCHIVO DE EQUIPOS</p>
        <h1>{team.name}</h1>
        <p className="hero__description">{team.description}</p>
      </section>

      <section className="teams-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">INTEGRANTES</p>
            <h2>Personajes del equipo</h2>
          </div>

          <span className="characters__count">
            {isLoading ? 'Cargando…' : `${team.members.length} integrantes`}
          </span>
        </div>

        {isLoading ? (
          <div className="empty-state" role="status">
            <h3>Cargando integrantes…</h3>
            <p>Estamos preparando el equipo.</p>
          </div>
        ) : (
          <>
            {error && (
              <div className="empty-state" role="status">
                <p>
                  {error} Mostramos los integrantes registrados del equipo.
                </p>
              </div>
            )}

            <div className="character-grid">
              {teamMembers.map(({ member, character }) =>
                character ? (
                  <CharacterCard
                    key={member}
                    character={character}
                  />
                ) : (
                  <article
                    className="character-card team-member-placeholder"
                    key={member}
                  >
                    <div className="team-member-placeholder__art">
                      <span aria-hidden="true">
                        {member
                          .split(' ')
                          .map((part) => part[0])
                          .join('')
                          .slice(0, 3)
                          .toUpperCase()}
                      </span>
                    </div>

                    <div className="character-card__content">
                      <p className="character-card__universe">
                        MARVEL COMICS
                      </p>
                      <h3>{member}</h3>
                      <p>
                        Este integrante forma parte de {team.name}. Su imagen
                        y sus datos detallados aún no están disponibles en
                        nuestro catálogo.
                      </p>
                      <span className="character-alignment character-alignment--hero">
                        Integrante
                      </span>
                    </div>
                  </article>
                ),
              )}
            </div>
          </>
        )}
      </section>
    </main>
  )
}

export default TeamDetails
