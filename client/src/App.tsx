
import {
  BrowserRouter,
  NavLink,
  Route,
  Routes,
} from 'react-router-dom'

import { AuthProvider } from './contexts/AuthContext'

import HomePage from './pages/HomePage'
import TeamsPage from './pages/TeamsPage'
import AboutPage from './pages/AboutPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ProfilePage from './pages/ProfilePage'

import SiteNavigation from './components/SiteNavigation'
import ScrollToTopButton from './components/ScrollToTopButton'
import ProtectedRoute from './components/ProtectedRoute'
import TeamDetails from './components/TeamDetails/TeamDetails'

import './App.css'

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
