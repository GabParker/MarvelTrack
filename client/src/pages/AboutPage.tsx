import { NavLink } from 'react-router-dom'

function AboutPage() {
  return (
    <main className="page about-page">
      <section className="about-hero">
        <p className="eyebrow">DETRÁS DEL PROYECTO</p>

        <h1>Descubre el universo Marvel</h1>

        <p>
          MarvelTrack es una aplicación web creada para explorar personajes,
          conocer sus características y descubrir los equipos que forman
          parte del universo de superhéroes.
        </p>

        <NavLink className="primary-button" to="/">
          Explorar personajes
        </NavLink>
      </section>

      <section className="about-content">
        <div>
          <p className="eyebrow">NUESTRA IDEA</p>
          <h2>¿Qué es MarvelTrack?</h2>
          <p>
            MarvelTrack reúne información de personajes y equipos en un solo
            lugar. Su objetivo es ofrecer una experiencia sencilla e
            intuitiva para explorar el universo de Marvel.
          </p>
        </div>

        <div>
          <p className="eyebrow">EXPLORA</p>
          <h2>¿Qué puedes encontrar?</h2>
          <ul>
            <li>Un catálogo de personajes.</li>
            <li>Información y características de cada personaje.</li>
            <li>Clasificación de héroes, villanos y personajes neutrales.</li>
            <li>Una sección dedicada a los equipos del universo Marvel.</li>
            <li>Registro y perfil de usuario.</li>
          </ul>
        </div>

        <div>
          <p className="eyebrow">DESARROLLO</p>
          <h2>Un proyecto de aprendizaje</h2>
          <p>
            Este proyecto forma parte de mi formación en desarrollo web.
            Fue creado para poner en práctica tecnologías como React,
            TypeScript y CSS, además de trabajar con consumo de datos,
            navegación y autenticación.
          </p>
        </div>
      </section>

      <section className="about-cta">
        <h2>Tu próxima aventura comienza aquí</h2>
        <p>
          Explora los personajes y descubre los equipos que hacen
          extraordinario este universo.
        </p>

        <NavLink className="primary-button" to="/teams">
          Descubrir equipos
        </NavLink>
      </section>
    </main>
  )
}

export default AboutPage
