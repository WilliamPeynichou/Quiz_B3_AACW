import express from 'express'
import cors from 'cors'
import { quizRoutes } from './routes/quizRoutes.js'
import { errorHandler } from './middlewares/errorHandler.js'

export const createApp = ({ quizController }) => {
  const app = express()
  app.use(cors())
  app.use(express.json())
  app.use('/api', quizRoutes(quizController))
  app.use(errorHandler)
  return app
}
