import { ValidationError } from './errors.js'

const asString = (value) => (typeof value === 'string' ? value : '')

// Normalise les données de connexion. Lève une ValidationError si un champ manque.
export function validateLogin(input = {}) {
  const email = asString(input.email).trim().toLowerCase()
  const password = asString(input.password)
  const errors = {}

  if (!email) errors.email = 'Email requis'
  if (!password) errors.password = 'Mot de passe requis'

  if (Object.keys(errors).length > 0) throw new ValidationError(errors)
  return { email, password }
}
