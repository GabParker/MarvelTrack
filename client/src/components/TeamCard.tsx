import { Link } from 'react-router-dom'
import type { Team } from '../types/Team'

type TeamCardProps = {
  team: Team
}

function TeamCard({ team }: TeamCardProps) {
  return (
    <article className="team-card">
      <div className="team-card__image">
        {team.image ? (
          <img src={team.image} alt={team.name} loading="lazy" />
        ) : (
          <div className="team-card__placeholder">
            <span>{team.name}</span>
          </div>
        )}
      </div>

      <div className="team-card__content">
        <h2 className="team-card__title">{team.name}</h2>

        <p className="team-card__description">{team.description}</p>

        <ul className="team-card__members">
          {team.members.map((member) => (
            <li key={member}>{member}</li>
          ))}
        </ul>

        <Link className="primary-button team-card__button" to={`/teams/${team.id}`}>
          Ver equipo
        </Link>
      </div>
    </article>
  )
}

export default TeamCard
