import 'dotenv/config'
import path from 'node:path'

export const env = {
  port: process.env.PORT || 3001,
  dbPath: process.env.DB_PATH || path.resolve('data/quiz.db'),
}
