import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router'
import { useAuth } from '../../../application/hooks/useAuth'

const FIELDS = {
  username: { label: 'Pseudo', type: 'text', autoComplete: 'username' },
  email: { label: 'Email', type: 'email', autoComplete: 'email' },
  password: { label: 'Mot de passe', type: 'password' },
}

// Formulaire commun connexion / inscription
export function AuthForm({ mode }) {
  const isRegister = mode === 'register'
  const fields = isRegister ? ['username', 'email', 'password'] : ['email', 'password']
  const { isAuthenticated, login, register } = useAuth()
  const navigate = useNavigate()
  const [values, setValues] = useState({ username: '', email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (isAuthenticated && !submitting) return <Navigate to="/" replace />

  const onSubmit = async (e) => {
    e.preventDefault()
    setErrors({})
    setFormError('')
    setSubmitting(true)
    try {
      const { username, email, password } = values
      await (isRegister ? register({ username, email, password }) : login({ email, password }))
      navigate('/', { replace: true })
    } catch (err) {
      setErrors(err.details ?? {})
      setFormError(err.details ? '' : err.message)
      setSubmitting(false)
    }
  }

  return (
    <main className="quiz auth">
      <h1>{isRegister ? 'Inscription' : 'Connexion'}</h1>
      <form onSubmit={onSubmit} noValidate>
        {fields.map((name) => (
          <label key={name}>
            {FIELDS[name].label}
            <input
              name={name}
              type={FIELDS[name].type}
              autoComplete={FIELDS[name].autoComplete ?? (isRegister ? 'new-password' : 'current-password')}
              value={values[name]}
              onChange={(e) => setValues({ ...values, [name]: e.target.value })}
              aria-invalid={Boolean(errors[name])}
              required
            />
            {errors[name] && <span className="field-error">{errors[name]}</span>}
          </label>
        ))}
        {formError && <p className="field-error" role="alert">{formError}</p>}
        <button type="submit" disabled={submitting}>
          {submitting ? '…' : isRegister ? 'Créer mon compte' : 'Se connecter'}
        </button>
      </form>
      <p>
        {isRegister ? (
          <>Déjà un compte ? <Link to="/login">Se connecter</Link></>
        ) : (
          <>Pas encore de compte ? <Link to="/register">S’inscrire</Link></>
        )}
      </p>
    </main>
  )
}
