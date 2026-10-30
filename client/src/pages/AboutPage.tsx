
import { NavLink } from 'react-router-dom'

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

export default AboutPage
