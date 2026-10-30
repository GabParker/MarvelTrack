
import type { Team } from '../types/Team'
import { teams } from '../data/teams'
import TeamCard from '../components/TeamCard'

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

export default TeamsPage
