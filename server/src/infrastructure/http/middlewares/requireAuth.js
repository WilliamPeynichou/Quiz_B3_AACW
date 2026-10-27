import { JwtTokenService } from '../../auth/JwtTokenService.js'
import { UnauthorizedError } from '../../../domain/auth/errors.js'
import { env } from '../../../config/env.js'

// Export direct (sans fabrique) : les autres features font simplement
// `router.post('/results', requireAuth, ...)` et lisent `req.user`.
const tokenService = new JwtTokenService({ secret: env.jwtSecret, expiresIn: env.jwtExpiresIn })

// Vérifie le JWT du header `Authorization: Bearer <token>`.
// Contrat : remplit req.user = { id, username }, sinon 401.
export const requireAuth = (req, res, next) => {
  const [scheme, token] = (req.headers.authorization ?? '').split(' ')
  if (scheme !== 'Bearer' || !token) return next(new UnauthorizedError('Token manquant'))

  try {
    req.user = tokenService.verify(token)
    next()
  } catch (err) {
    next(err)
  }
}
