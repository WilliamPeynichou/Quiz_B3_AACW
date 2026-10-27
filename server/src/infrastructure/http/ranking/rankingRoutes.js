import { Router } from 'express'
//branches tout dans rankingRoutes.js (db → repo → use case → controller
import { RankingController } from './RankingController.js'
import { RankingRepository } from '../../../domain/repositories/RankinRepository.js'

//branche tous icic le RankingController
const rankingController = new RankingController({ })

export const rankingRoutes = (controller) => {
    const router = Router()
    router.get('/categories', controller.categories)
    router.get('/questions', controller.questions)
    return router
  }
