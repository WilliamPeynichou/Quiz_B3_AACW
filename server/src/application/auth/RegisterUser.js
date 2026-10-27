import { AuthError } from './AuthError.js'

const USERNAME_PATTERN = /^[\p{L}\p{N}_-]{3,30}$/u
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validateRegistration(input) {
  const username = typeof input?.username === 'string'
    ? input.username.trim().toLowerCase()
    : ''
  const email = typeof input?.email === 'string'
    ? input.email.trim().toLowerCase()
    : ''
  const password = input?.password
  const details = {}

  if (!USERNAME_PATTERN.test(username)) {
    details.username = 'Entre 3 et 30 caractères : lettres, chiffres, _ ou -.'
  }
  if (email.length > 254 || !EMAIL_PATTERN.test(email)) {
    details.email = 'Adresse email invalide.'
  }
  if (typeof password !== 'string' || [...password].length < 8 ||
      Buffer.byteLength(password, 'utf8') > 72 || password.includes('\0')) {
    details.password = 'Mot de passe requis : 8 caractères minimum et 72 octets maximum.'
  }

  if (Object.keys(details).length) {
    throw new AuthError('Données d’inscription invalides', 400, details)
  }

  return { username, email, password }
}

export class RegisterUser {
  constructor({ userRepository, hashPassword, issueToken }) {
    this.userRepository = userRepository
    this.hashPassword = hashPassword
    this.issueToken = issueToken
  }

  async execute(input) {
    const { username, email, password } = validateRegistration(input)

    if (await this.userRepository.findByUsername(username)) {
      throw new AuthError('Nom d’utilisateur déjà utilisé', 409, {
        username: 'Ce nom d’utilisateur est déjà pris.',
      })
    }
    if (await this.userRepository.findByEmail(email)) {
      throw new AuthError('Adresse email déjà utilisée', 409, {
        email: 'Cette adresse email est déjà utilisée.',
      })
    }

    // Aucun mot de passe en clair n'est conserve dans la base.
    const password_hash = await this.hashPassword(password)

    let user
    try {
      user = await this.userRepository.create({ username, email, password_hash })
    } catch (error) {
      // Protection contre deux inscriptions simultanees.
      if (error.code?.startsWith('SQLITE_CONSTRAINT')) {
        throw new AuthError('Nom d’utilisateur ou email déjà utilisé', 409)
      }
      throw error
    }

    return {
      token: this.issueToken(user),
      user: { id: user.id, username: user.username, email: user.email },
    }
  }
}
