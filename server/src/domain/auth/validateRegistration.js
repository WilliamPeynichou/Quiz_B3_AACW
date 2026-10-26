import { ValidationError } from './errors.js'

export const USERNAME_MIN = 3
export const USERNAME_MAX = 30
export const PASSWORD_MIN = 8
export const PASSWORD_MAX = 72 // bcrypt ignore tout ce qui dépasse 72 octets

const USERNAME_PATTERN = /^[a-zA-Z0-9_.-]+$/
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const asString = (value) => (typeof value === 'string' ? value : '')

/**
 * Valide et normalise les données d'inscription.
 * Retourne { username, email, password } nettoyés, ou lève une ValidationError
 * qui liste toutes les erreurs d'un coup.
 */
export function validateRegistration(input = {}) {
  const username = asString(input.username).trim()
  const email = asString(input.email).trim().toLowerCase()
  const password = asString(input.password)
  const errors = {}

  if (username.length < USERNAME_MIN || username.length > USERNAME_MAX) {
    errors.username = `Le pseudo doit faire entre ${USERNAME_MIN} et ${USERNAME_MAX} caractères`
  } else if (!USERNAME_PATTERN.test(username)) {
    errors.username = 'Le pseudo ne peut contenir que des lettres, chiffres, _ . -'
  }

  if (!EMAIL_PATTERN.test(email)) {
    errors.email = 'Email invalide'
  }

  if (password.length < PASSWORD_MIN) {
    errors.password = `Le mot de passe doit faire au moins ${PASSWORD_MIN} caractères`
  } else if (Buffer.byteLength(password, 'utf8') > PASSWORD_MAX) {
    errors.password = `Le mot de passe est trop long (${PASSWORD_MAX} octets max)`
  }

  if (Object.keys(errors).length > 0) throw new ValidationError(errors)
  return { username, email, password }
}
