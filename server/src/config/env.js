import 'dotenv/config'
import path from 'node:path'

export const env = {
  port: process.env.PORT || 3001,
  jwtSecret: process.env.JWT_SECRET || 'dev-secret-a-changer',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  dbPath: process.env.DB_PATH || path.resolve('data/quiz.db'),
}
