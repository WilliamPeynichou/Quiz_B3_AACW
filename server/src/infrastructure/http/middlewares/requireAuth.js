import { AuthError } from '../../../application/auth/AuthError.js'
import { db } from '../../database/connection.js'
import { SqliteUserRepository } from '../../auth/SqliteUserRepository.js'
import { verifyToken } from '../../auth/issueToken.js'

const userRepository = new SqliteUserRepository(db)

// Remplace le bouchon du socle. Toutes les routes protégées reçoivent req.user.
export const requireAuth = async (req, res, next) => {
  try {
    const match = /^Bearer\s+(.+)$/i.exec(req.get('authorization') || '')
    if (!match) throw new AuthError('Authentification requise', 401)

    const session = verifyToken(match[1])
    const user = await userRepository.findById(session.id)
    if (!user) throw new AuthError('Utilisateur introuvable', 401)

    req.user = { id: user.id, username: user.username }
    next()
  } catch (error) {
    next(error)
  }
}
