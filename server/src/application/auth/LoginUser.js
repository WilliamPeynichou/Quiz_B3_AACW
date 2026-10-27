import { AuthError } from './AuthError.js'

export class LoginUser {
  constructor({ userRepository, comparePassword, issueToken }) {
    this.userRepository = userRepository
    this.comparePassword = comparePassword
    this.issueToken = issueToken
  }

  async execute(input) {
    const email = typeof input?.email === 'string' ? input.email.trim().toLowerCase() : ''
    const password = input?.password

    if (!email || typeof password !== 'string' || !password) {
      throw new AuthError('Email et mot de passe requis', 400)
    }

    const user = await this.userRepository.findByEmail(email)
    // Message volontairement identique pour email inconnu et mot de passe incorrect.
    if (!user || !(await this.comparePassword(password, user.password_hash))) {
      throw new AuthError('Email ou mot de passe incorrect', 401)
    }

    return {
      token: this.issueToken(user),
      user: { id: user.id, username: user.username, email: user.email },
    }
  }
}
