import { UnauthorizedError } from '../../domain/auth/errors.js'

export class GetCurrentUser {
  constructor({ userRepository, tokenService }) {
    this.userRepository = userRepository
    this.tokenService = tokenService
  }

  // token (sans "Bearer ") → { id, username }
  async execute(token) {
    if (!token) throw new UnauthorizedError('Token manquant')
    const { id } = this.tokenService.verify(token)
    const user = await this.userRepository.findById(id)
    if (!user) throw new UnauthorizedError('Utilisateur introuvable')
    return user.toPublic()
  }
}
