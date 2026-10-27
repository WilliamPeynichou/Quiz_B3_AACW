import express from 'express'
import cors from 'cors'
import { quizRoutes } from './routes/quizRoutes.js'
import { authRoutes } from './auth/authRoutes.js'
import { catalogRoutes } from './catalog/catalogRoutes.js'
import { gameRoutes } from './game/gameRoutes.js'
import { rankingRoutes } from './ranking/rankingRoutes.js'
import { errorHandler } from './middlewares/errorHandler.js'

export const createApp = ({ quizController, authController }) => {
  const app = express()
  app.use(cors())
  app.use(express.json())
  app.use('/api/auth', authRoutes(authController))
  app.use('/api/catalog', catalogRoutes())
  app.use('/api/game', gameRoutes())
  app.use('/api/ranking', rankingRoutes())
  app.use('/api', quizRoutes(quizController)) // ancien quiz, retiré par la feature game
  app.use(errorHandler)
  return app
}
