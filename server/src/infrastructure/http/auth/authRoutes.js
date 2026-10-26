import { Router } from 'express'

// Monté sur /api/auth
export const authRoutes = (controller) => {
  const router = Router()
  router.post('/register', controller.register)
  return router
}
