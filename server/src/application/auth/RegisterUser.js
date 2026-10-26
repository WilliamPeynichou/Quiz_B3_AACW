import { validateRegistration } from '../../domain/auth/validateRegistration.js'
import { ConflictError } from '../../domain/auth/errors.js'

export class RegisterUser {
  constructor({ userRepository, passwordHasher }) {
    this.userRepository = userRepository
    this.passwordHasher = passwordHasher
  }

  async execute(input) {
    const { username, email, password } = validateRegistration(input)

    if (await this.userRepository.findByEmail(email)) {
      throw new ConflictError('Cet email est déjà utilisé', { email: 'Déjà utilisé' })
    }
    if (await this.userRepository.findByUsername(username)) {
      throw new ConflictError('Ce pseudo est déjà pris', { username: 'Déjà pris' })
    }

    const passwordHash = await this.passwordHasher.hash(password)
    const user = await this.userRepository.create({ username, email, passwordHash })

    // Contrat : { token, user }. Le token JWT arrive avec la feature 1.2 (connexion).
    return { user: user.toPublic() }
  }
}
