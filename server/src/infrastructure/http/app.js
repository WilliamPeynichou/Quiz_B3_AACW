import express from 'express'
import cors from 'cors'
import { quizRoutes } from './routes/quizRoutes.js'
import { authRoutes } from './auth/authRoutes.js'
import { errorHandler } from './middlewares/errorHandler.js'

export const createApp = ({ quizController, authController }) => {
  const app = express()
  app.use(cors())
  app.use(express.json())
  app.use('/api/auth', authRoutes(authController))
  app.use('/api', quizRoutes(quizController))
  app.use(errorHandler)
  return app
}
