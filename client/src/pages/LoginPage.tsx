import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

interface LoginErrors {
  email: string
  password: string
}

function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<LoginErrors>({
    email: '',
    password: '',
  })
  const [submitError, setSubmitError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  function validateEmail(value: string): string {
    const normalizedEmail = value.trim()

    if (!normalizedEmail) {
      return 'Escribe tu correo electrónico.'
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      return 'Escribe un correo electrónico válido.'
    }

    return ''
  }

  function validatePassword(value: string): string {
    if (!value) {
      return 'Escribe tu contraseña.'
    }

    return ''
  }

  function handleEmailChange(value: string) {
    setEmail(value)
    setErrors((previous) => ({
      ...previous,
      email: validateEmail(value),
    }))
    setSubmitError('')
  }

  function handlePasswordChange(value: string) {
    setPassword(value)
    setErrors((previous) => ({
      ...previous,
      password: validatePassword(value),
    }))
    setSubmitError('')
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitError('')

    const validationErrors: LoginErrors = {
      email: validateEmail(email),
      password: validatePassword(password),
    }

    setErrors(validationErrors)

    if (Object.values(validationErrors).some(Boolean)) {
      return
    }

    setIsSubmitting(true)

    try {
      await login(email.trim(), password)
      navigate('/', { replace: true })
    } catch (err) {
      setSubmitError(
        err instanceof Error
          ? err.message
          : 'No se pudo iniciar sesión. Inténtalo de nuevo.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="page auth-page">
      <section className="auth-card">
        <p className="eyebrow">ACCESO AL MULTIVERSO</p>
        <h1>Iniciar sesión</h1>
        <p>
          Entra a MarvelTrack y continúa explorando tus personajes favoritos.
        </p>

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <label htmlFor="login-email">Correo electrónico</label>
          <input
            id="login-email"
            name="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => handleEmailChange(event.target.value)}
            required
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? 'login-email-error' : undefined}
          />
          {errors.email && (
            <p
              className="auth-field-error"
              id="login-email-error"
              role="alert"
            >
              {errors.email}
            </p>
          )}

          <label htmlFor="login-password">Contraseña</label>
          <input
            id="login-password"
            name="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => handlePasswordChange(event.target.value)}
            required
            aria-invalid={Boolean(errors.password)}
            aria-describedby={
              errors.password ? 'login-password-error' : undefined
            }
          />
          {errors.password && (
            <p
              className="auth-field-error"
              id="login-password-error"
              role="alert"
            >
              {errors.password}
            </p>
          )}

          {submitError && (
            <p className="auth-error" role="alert">
              {submitError}
            </p>
          )}

          <button
            className="primary-button"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Iniciando sesión…' : 'Entrar'}
          </button>
        </form>

        <p className="auth-switch">
          ¿Todavía no tienes cuenta? <Link to="/register">Regístrate</Link>
        </p>
      </section>
    </main>
  )
}

export default LoginPage
