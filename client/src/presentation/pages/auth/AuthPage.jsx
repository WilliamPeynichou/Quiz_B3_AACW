import { useState } from 'react'
import { Link } from 'react-router'
import { useAuth } from '../../../application/hooks/auth/useAuth'
import { authApi } from '../../../infrastructure/api/auth/authApi'
import './AuthPage.css'

export function AuthPage() {
  const { user, loading: checkingSession, login, logout } = useAuth()
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({ username: '', email: '', password: '' })
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})

  const isRegister = mode === 'register'

  const changeMode = () => {
    setMode((previous) => previous === 'login' ? 'register' : 'login')
    setError('')
    setFieldErrors({})
    setForm({ username: '', email: '', password: '' })
  }

  const changeField = (event) => {
    const { name, value } = event.target
    setForm((previous) => ({ ...previous, [name]: value }))
    setFieldErrors((previous) => ({ ...previous, [name]: undefined }))
    setError('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (pending) return
    setPending(true)
    setError('')
    setFieldErrors({})
    try {
      const credentials = isRegister ? form : { email: form.email, password: form.password }
      const result = isRegister
        ? await authApi.register(credentials)
        : await authApi.login(credentials)
      login(result)
    } catch (err) {
      setError(err.message || 'Une erreur est survenue.')
      setFieldErrors(err.details || {})
    } finally {
      setPending(false)
    }
  }

  if (checkingSession) return <main className="auth-page"><p>Vérification de la session…</p></main>

  if (user) {
    return (
      <main className="auth-page">
        <section className="auth-panel">
          <span className="auth-eyebrow">Compte utilisateur</span>
          <h1>Bonjour {user.username} !</h1>
          <p>Tu es connecté à Quiz B3.</p>
          <div className="auth-actions">
            <Link className="auth-link-button" to="/">Aller aux catégories</Link>
            <button className="auth-secondary" type="button" onClick={logout}>Se déconnecter</button>
          </div>
        </section>
      </main>
    )
  }

  return (
    <main className="auth-page">
      <section className="auth-panel" aria-labelledby="auth-title">
        <span className="auth-eyebrow">Quiz B3 · Espace membre</span>
        <h1 id="auth-title">{isRegister ? 'Créer un compte' : 'Se connecter'}</h1>
        <p className="auth-subtitle">
          {isRegister ? 'Un compte pour garder tes résultats.' : 'Retrouve tes quiz et ta progression.'}
        </p>
        <div className="auth-mode" aria-label="Choisir un mode">
          <button type="button" className={!isRegister ? 'active' : ''}
            onClick={() => isRegister && changeMode()} aria-pressed={!isRegister}>Connexion</button>
          <button type="button" className={isRegister ? 'active' : ''}
            onClick={() => !isRegister && changeMode()} aria-pressed={isRegister}>Inscription</button>
        </div>
        <form onSubmit={handleSubmit} noValidate>
          {isRegister && (
            <label className="auth-field">
              <span>Pseudo</span>
              <input name="username" autoComplete="username" required minLength={3}
                maxLength={30} value={form.username} onChange={changeField}
                aria-invalid={Boolean(fieldErrors.username)} />
              {fieldErrors.username && <small role="alert">{fieldErrors.username}</small>}
            </label>
          )}
          <label className="auth-field">
            <span>Email</span>
            <input name="email" type="email" autoComplete="email" required
              placeholder="toi@exemple.fr" value={form.email} onChange={changeField}
              aria-invalid={Boolean(fieldErrors.email)} />
            {fieldErrors.email && <small role="alert">{fieldErrors.email}</small>}
          </label>
          <label className="auth-field">
            <span>Mot de passe</span>
            <input name="password" type="password" required minLength={isRegister ? 8 : undefined}
              autoComplete={isRegister ? 'new-password' : 'current-password'}
              value={form.password} onChange={changeField}
              aria-invalid={Boolean(fieldErrors.password)} />
            {fieldErrors.password && <small role="alert">{fieldErrors.password}</small>}
          </label>
          {isRegister && <p className="auth-hint">8 caractères minimum. Le mot de passe n'est jamais stocké en clair.</p>}
          {error && <p className="auth-error" role="alert">{error}</p>}
          <button className="auth-submit" type="submit" disabled={pending}>
            {pending ? 'Envoi en cours…' : isRegister ? "S'inscrire" : 'Se connecter'}
          </button>
        </form>
        <p className="auth-switch">
          {isRegister ? 'Déjà un compte ?' : 'Pas encore de compte ?'}{' '}
          <button type="button" onClick={changeMode}>
            {isRegister ? 'Se connecter' : "S'inscrire"}
          </button>
        </p>
        <Link className="auth-back" to="/">← Retour aux catégories</Link>
      </section>
    </main>
  )
}
