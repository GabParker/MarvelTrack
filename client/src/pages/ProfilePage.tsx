import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

function ProfilePage() {
  const { user, logout, updateProfile } = useAuth()
  const navigate = useNavigate()

  const [name, setName] = useState(user?.name ?? '')
  const [avatar, setAvatar] = useState(user?.avatar ?? '')
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [nameError, setNameError] = useState('')
  const [avatarError, setAvatarError] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    if (user) {
      setName(user.name)
      setAvatar(user.avatar)
    }
  }, [user])

  function validateName(value: string): string {
    const normalizedName = value.trim()

    if (!normalizedName) {
      return 'El nombre es obligatorio.'
    }

    if (normalizedName.length < 2 || normalizedName.length > 40) {
      return 'El nombre debe tener entre 2 y 40 caracteres.'
    }

    return ''
  }

  function validateAvatar(value: string): string {
    const normalizedAvatar = value.trim()

    if (!normalizedAvatar) {
      return ''
    }

    try {
      const parsedUrl = new URL(normalizedAvatar)

      if (
        !['http:', 'https:'].includes(parsedUrl.protocol) ||
        !parsedUrl.hostname.includes('.')
      ) {
        return 'Introduce una URL válida que comience con https:// o http://.'
      }
    } catch {
      return 'Introduce una URL válida que comience con https:// o http://.'
    }

    return ''
  }

  function handleNameChange(value: string) {
    setName(value)
    setNameError(validateName(value))
    setError('')
    setSuccess('')
  }

  function handleAvatarChange(value: string) {
    setAvatar(value)
    setAvatarError(validateAvatar(value))
    setError('')
    setSuccess('')
  }

  function handleEdit() {
    if (!user) return

    setName(user.name)
    setAvatar(user.avatar)
    setNameError('')
    setAvatarError('')
    setError('')
    setSuccess('')
    setIsEditing(true)
  }

  function handleCancel() {
    if (!user) return

    setName(user.name)
    setAvatar(user.avatar)
    setNameError('')
    setAvatarError('')
    setError('')
    setSuccess('')
    setIsEditing(false)
  }

  async function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    setError('')
    setSuccess('')

    const currentNameError = validateName(name)
    const currentAvatarError = validateAvatar(avatar)

    setNameError(currentNameError)
    setAvatarError(currentAvatarError)

    if (currentNameError || currentAvatarError) {
      return
    }

    if (!user) return

    const normalizedName = name.trim()
    const normalizedAvatar = avatar.trim()

    if (
      normalizedName === user.name &&
      normalizedAvatar === user.avatar
    ) {
      setSuccess('No hay cambios que guardar.')
      setIsEditing(false)
      return
    }

    setIsSaving(true)

    try {
      await updateProfile({
        name: normalizedName,
        avatar: normalizedAvatar,
      })

      setSuccess('Tu perfil se actualizó correctamente.')
      setIsEditing(false)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'No se pudo actualizar tu perfil. Inténtalo de nuevo.',
      )
    } finally {
      setIsSaving(false)
    }
  }

  async function handleLogout() {
    setError('')
    setSuccess('')
    setIsLoggingOut(true)

    try {
      await logout()
      navigate('/login', { replace: true })
    } catch {
      setError(
        'No se pudo cerrar la sesión en el servidor. Inténtalo de nuevo.',
      )
    } finally {
      setIsLoggingOut(false)
    }
  }

  if (!user) {
    return null
  }

  const previewAvatar = avatar.trim()
  const previewName = name.trim() || user.name

  return (
    <main className="page auth-page">
      <section className="auth-card profile-card">
        <p className="eyebrow">TU ESPACIO EN EL MULTIVERSO</p>

        <h1>Mi perfil</h1>

        <p>¡Bienvenido a MarvelTrack!</p>

        {previewAvatar && !avatarError ? (
          <img
            src={previewAvatar}
            alt={`Avatar de ${previewName}`}
            className="profile-avatar"
            onError={(event) => {
              event.currentTarget.style.display = 'none'
            }}
            onLoad={(event) => {
              event.currentTarget.style.display = 'block'
            }}
          />
        ) : (
          <div
            className="profile-avatar profile-avatar--placeholder"
            aria-label={`Inicial de ${previewName}`}
          >
            {previewName.charAt(0).toUpperCase()}
          </div>
        )}

        {isEditing ? (
          <form
            className="auth-form profile-edit-form"
            onSubmit={handleSave}
            noValidate
          >
            <label htmlFor="profile-name">Nombre</label>

            <input
              id="profile-name"
              name="name"
              type="text"
              autoComplete="name"
              value={name}
              onChange={(event) => handleNameChange(event.target.value)}
              minLength={2}
              maxLength={40}
              required
              aria-invalid={Boolean(nameError)}
              aria-describedby={
                nameError ? 'profile-name-error' : undefined
              }
            />

            {nameError && (
              <p
                className="auth-field-error"
                id="profile-name-error"
                role="alert"
              >
                {nameError}
              </p>
            )}

            <label htmlFor="profile-avatar">
              URL de la foto de perfil
            </label>

            <input
              id="profile-avatar"
              name="avatar"
              type="url"
              autoComplete="url"
              placeholder="https://ejemplo.com/mi-foto.jpg"
              value={avatar}
              onChange={(event) => handleAvatarChange(event.target.value)}
              aria-invalid={Boolean(avatarError)}
              aria-describedby={
                avatarError ? 'profile-avatar-error' : undefined
              }
            />

            {avatarError && (
              <p
                className="auth-field-error"
                id="profile-avatar-error"
                role="alert"
              >
                {avatarError}
              </p>
            )}

            <label htmlFor="profile-email">Correo electrónico</label>

            <input
              id="profile-email"
              type="email"
              value={user.email}
              readOnly
              aria-readonly="true"
            />

            {error && (
              <p className="auth-error" role="alert">
                {error}
              </p>
            )}

            <button
              className="primary-button"
              type="submit"
              disabled={
                isSaving ||
                Boolean(nameError) ||
                Boolean(avatarError)
              }
            >
              {isSaving ? 'Guardando cambios…' : 'Guardar cambios'}
            </button>

            <button
              className="secondary-button"
              type="button"
              onClick={handleCancel}
              disabled={isSaving}
            >
              Cancelar
            </button>
          </form>
        ) : (
          <>
            <div className="profile-details">
              <div className="profile-detail">
                <strong>Nombre</strong>
                <span>{user.name}</span>
              </div>

              <div className="profile-detail">
                <strong>Correo electrónico</strong>
                <span>{user.email}</span>
              </div>
            </div>

            {success && (
              <p className="auth-success" role="status">
                {success}
              </p>
            )}

            {error && (
              <p className="auth-error" role="alert">
                {error}
              </p>
            )}

            <button
              className="primary-button"
              type="button"
              onClick={handleEdit}
              disabled={isLoggingOut}
            >
              Editar perfil
            </button>
          </>
        )}

        <button
          className="secondary-button"
          type="button"
          onClick={handleLogout}
          disabled={isLoggingOut || isSaving}
        >
          {isLoggingOut ? 'Cerrando sesión…' : 'Cerrar sesión'}
        </button>
      </section>
    </main>
  )
}

export default ProfilePage
