import { validateLogin } from '../../domain/auth/validateLogin.js'
import { UnauthorizedError } from '../../domain/auth/errors.js'

export class LoginUser {
  constructor({ userRepository, passwordHasher, tokenService }) {
    this.userRepository = userRepository
    this.passwordHasher = passwordHasher
    this.tokenService = tokenService
  }

  async execute(input) {
    const { email, password } = validateLogin(input)

    const user = await this.userRepository.findByEmail(email)
    // Même message que l'email soit inconnu ou le mot de passe faux : on ne révèle rien
    const valid = user && (await this.passwordHasher.compare(password, user.passwordHash))
    if (!valid) throw new UnauthorizedError('Email ou mot de passe incorrect')

    const publicUser = user.toPublic()
    return { token: this.tokenService.sign(publicUser), user: publicUser }
  }
}
