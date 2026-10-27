import { validateRegistration } from '../../domain/auth/validateRegistration.js'
import { ConflictError } from '../../domain/auth/errors.js'

export class RegisterUser {
  constructor({ userRepository, passwordHasher, tokenService }) {
    this.userRepository = userRepository
    this.passwordHasher = passwordHasher
    this.tokenService = tokenService
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

    const publicUser = user.toPublic()
    return { token: this.tokenService.sign(publicUser), user: publicUser }
  }
}
