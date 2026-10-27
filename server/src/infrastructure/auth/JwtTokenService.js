import jwt from 'jsonwebtoken'
import { TokenService } from '../../domain/auth/TokenService.js'
import { UnauthorizedError } from '../../domain/auth/errors.js'

export class JwtTokenService extends TokenService {
  constructor({ secret, expiresIn = '7d' }) {
    super()
    if (!secret) throw new Error('JWT_SECRET manquant')
    this.secret = secret
    this.expiresIn = expiresIn
  }

  sign({ id, username }) {
    return jwt.sign({ username }, this.secret, {
      subject: String(id),
      expiresIn: this.expiresIn,
    })
  }

  verify(token) {
    try {
      const payload = jwt.verify(token, this.secret)
      return { id: Number(payload.sub), username: payload.username }
    } catch {
      throw new UnauthorizedError('Token invalide ou expiré')
    }
  }
}
