import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

interface RegisterErrors {
  name: string
  email: string
  password: string
  confirmPassword: string
}

function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errors, setErrors] = useState<RegisterErrors>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  function validateName(value: string): string {
    const normalized = value.trim()

    if (!normalized) return 'Escribe tu nombre.'
    if (normalized.length < 2 || normalized.length > 40) {
      return 'El nombre debe tener entre 2 y 40 caracteres.'
    }

    return ''
  }

  function validateEmail(value: string): string {
    const normalized = value.trim()

    if (!normalized) return 'Escribe tu correo electrónico.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) {
      return 'Escribe un correo electrónico válido.'
    }

    return ''
  }

  function validatePassword(value: string): string {
    if (!value) return 'Escribe una contraseña.'
    if (value.length < 8) {
      return 'La contraseña debe tener al menos 8 caracteres.'
    }

    return ''
  }

  function validateConfirmPassword(value: string): string {
    if (!value) return 'Confirma tu contraseña.'
    if (value !== password) return 'Las contraseñas no coinciden.'

    return ''
  }

  function handleNameChange(value: string) {
    setName(value)
    setErrors((previous) => ({
      ...previous,
      name: validateName(value),
    }))
    setSubmitError('')
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
      confirmPassword: confirmPassword
        ? validateConfirmPassword(confirmPassword)
        : previous.confirmPassword,
    }))
    setSubmitError('')
  }

  function handleConfirmPasswordChange(value: string) {
    setConfirmPassword(value)
    setErrors((previous) => ({
      ...previous,
      confirmPassword: validateConfirmPassword(value),
    }))
    setSubmitError('')
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitError('')

    const validationErrors: RegisterErrors = {
      name: validateName(name),
      email: validateEmail(email),
      password: validatePassword(password),
      confirmPassword: validateConfirmPassword(confirmPassword),
    }

    setErrors(validationErrors)

    if (Object.values(validationErrors).some(Boolean)) {
      return
    }

    setIsSubmitting(true)

    try {
      await register(name.trim(), email.trim(), password)
      navigate('/', { replace: true })
    } catch (err) {
      setSubmitError(
        err instanceof Error
          ? err.message
          : 'No se pudo crear la cuenta. Inténtalo de nuevo.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="page auth-page">
      <section className="auth-card">
        <p className="eyebrow">ÚNETE AL MULTIVERSO</p>
        <h1>Crear cuenta</h1>
        <p>
          Regístrate para comenzar tu experiencia en MarvelTrack.
        </p>

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <label htmlFor="register-name">Nombre</label>
          <input
            id="register-name"
            name="name"
            type="text"
            autoComplete="name"
            minLength={2}
            maxLength={40}
            value={name}
            onChange={(event) => handleNameChange(event.target.value)}
            required
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? 'register-name-error' : undefined}
          />
          {errors.name && (
            <p className="auth-field-error" id="register-name-error" role="alert">
              {errors.name}
            </p>
          )}

          <label htmlFor="register-email">Correo electrónico</label>
          <input
            id="register-email"
            name="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => handleEmailChange(event.target.value)}
            required
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? 'register-email-error' : undefined}
          />
          {errors.email && (
            <p className="auth-field-error" id="register-email-error" role="alert">
              {errors.email}
            </p>
          )}

          <label htmlFor="register-password">Contraseña</label>
          <input
            id="register-password"
            name="password"
            type="password"
            autoComplete="new-password"
            minLength={8}
            value={password}
            onChange={(event) => handlePasswordChange(event.target.value)}
            required
            aria-invalid={Boolean(errors.password)}
            aria-describedby={
              errors.password ? 'register-password-error' : undefined
            }
          />
          {errors.password && (
            <p
              className="auth-field-error"
              id="register-password-error"
              role="alert"
            >
              {errors.password}
            </p>
          )}

          <label htmlFor="register-confirm-password">
            Confirmar contraseña
          </label>
          <input
            id="register-confirm-password"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(event) =>
              handleConfirmPasswordChange(event.target.value)
            }
            required
            aria-invalid={Boolean(errors.confirmPassword)}
            aria-describedby={
              errors.confirmPassword
                ? 'register-confirm-password-error'
                : undefined
            }
          />
          {errors.confirmPassword && (
            <p
              className="auth-field-error"
              id="register-confirm-password-error"
              role="alert"
            >
              {errors.confirmPassword}
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
            {isSubmitting ? 'Creando cuenta…' : 'Registrarme'}
          </button>
        </form>

        <p className="auth-switch">
          ¿Ya tienes una cuenta? <Link to="/login">Inicia sesión</Link>
        </p>
      </section>
    </main>
  )
}

export default RegisterPage
