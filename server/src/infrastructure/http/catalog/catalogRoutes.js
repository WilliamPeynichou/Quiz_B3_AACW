import { Router } from 'express'

// Monté sur /api/catalog
export const catalogRoutes = (controller) => {
  const router = Router()
  router.get('/categories', controller.categories)
  return router
}
