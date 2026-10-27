import { Router } from 'express'
//branches tout dans rankingRoutes.js (db → repo → use case → controller
import { RankingController } from './RankingController.js'
import { RankingRepository } from '../../../domain/repositories/RankinRepository.js'

//branche tous icic le RankingController
const rankingController = new RankingController()

// Monté sur /api/ranking (routes ajoutées par la feature ranking)
export const rankingRoutes = () => Router()

//valider la persence des query category et difficulty si le cas contraire retourner une erreur 400
rankingRoutes.get('/', (req, res) => {
    const { category, difficulty } = req.query
    if (!category || !difficulty) {
        return res.status(400).json({ error: 'Category and difficulty are required' })
    }
    const ranking = RankingRepository.findTop10({ categoryId: category, difficulty: difficulty })
    res.json(ranking)
})

//fonction qui ne prends que le meilleur score de chaque joueur pour une catégorie et une difficulté
rankingRoutes.get('/best-score', (req, res) => {
    const { category, difficulty } = req.query
    if (!category || !difficulty) {
        return res.status(400).json({ error: 'Category and difficulty are required' })
    }
    const bestScore = RankingRepository.findBestScore({ categoryId: category, difficulty: difficulty })
    res.json(bestScore)
})

