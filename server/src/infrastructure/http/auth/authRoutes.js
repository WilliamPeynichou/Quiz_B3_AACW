import { Router } from 'express'
import bcrypt from 'bcryptjs'
import { db } from '../../database/connection.js'
import { RegisterUser } from '../../../application/auth/RegisterUser.js'
import { LoginUser } from '../../../application/auth/LoginUser.js'
import { SqliteUserRepository } from '../../auth/SqliteUserRepository.js'
import { ensureJwtSecret, issueToken } from '../../auth/issueToken.js'

// Monté sur /api/auth par le socle : aucune modification de app.js.
export const authRoutes = () => {
  const router = Router()
  const userRepository = new SqliteUserRepository(db)
  const registerUser = new RegisterUser({
    userRepository,
    hashPassword: (password) => bcrypt.hash(password, 12),
    issueToken,
  })
  const loginUser = new LoginUser({
    userRepository,
    comparePassword: (password, hash) => bcrypt.compare(password, hash),
    issueToken,
  })

  router.post('/register', async (req, res) => {
    ensureJwtSecret()
    res.status(201).json(await registerUser.execute(req.body))
  })

  router.post('/login', async (req, res) => {
    ensureJwtSecret()
    res.json(await loginUser.execute(req.body))
  })

  return router
}
