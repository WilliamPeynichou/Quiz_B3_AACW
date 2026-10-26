import { Router } from 'express'

export const quizRoutes = (controller) => {
  const router = Router()
  router.get('/questions', controller.list)
  router.post('/answer', controller.answer)
  return router
}
