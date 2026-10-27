import { Router } from 'express'

// Monté sur /api/auth
export const authRoutes = (controller) => {
  const router = Router()
  router.post('/register', controller.register)
  router.post('/login', controller.login)
  router.get('/me', controller.me)
  return router
}
