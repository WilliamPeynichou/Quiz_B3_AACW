import { Router } from 'express'
import bcrypt from 'bcryptjs'
import { db } from '../../database/connection.js'
import { RegisterUser } from '../../../application/auth/RegisterUser.js'
import { SqliteUserRepository } from '../../auth/SqliteUserRepository.js'
import { ensureJwtSecret, issueToken } from '../../auth/issueToken.js'

// Monte sur /api/auth par le socle. Pas de modification de app.js.
export const authRoutes = () => {
  const router = Router()
  const registerUser = new RegisterUser({
    userRepository: new SqliteUserRepository(db),
    hashPassword: (password) => bcrypt.hash(password, 12),
    issueToken,
  })

  router.post('/register', async (req, res) => {
    ensureJwtSecret()
    const result = await registerUser.execute(req.body)
    res.status(201).json(result)
  })

  return router
}
