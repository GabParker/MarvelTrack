
import { NavLink } from 'react-router-dom'
import { useAuth } from '../contexts/useAuth'

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

export default SiteNavigation
