import type { Team } from '../types/Team'
import { teams } from '../data/teams'
import TeamCard from '../components/TeamCard'

function TeamsPage() {
  return (
    <main className="page">
      <section className="hero">
        <p className="eyebrow">JUNTOS SON MÁS FUERTES</p>

        <h1>Equipos del universo Marvel</h1>

        <p className="hero__description">
          Conoce a los grupos de superhéroes que unen sus habilidades
          para enfrentar amenazas extraordinarias.
        </p>
      </section>

      <section className="teams-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">ARCHIVO DE EQUIPOS</p>
            <h2>Conoce a sus integrantes</h2>
          </div>

          <span className="characters__count">
            {teams.length} equipos
          </span>
        </div>

        {teams.length > 0 ? (
          <div className="teams-grid">
            {teams.map((team: Team) => (
              <TeamCard key={team.id} team={team} />
            ))}
          </div>
        ) : (
          <p className="empty-state">
            Todavía no hay equipos disponibles.
          </p>
        )}
      </section>
    </main>
  )
}

export default TeamsPage
