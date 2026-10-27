//classe qui ressemble au quizzcontroller
export class RankingController {
    constructor({ findTop10, findBestScore }) {
        this.findTop10 = findTop10
        this.findBestScore = findBestScore
    }

    list = async (req, res) => {
        const { category, difficulty } = req.query
        const ranking = this.findTop10({ categoryId: category, difficulty: difficulty })
        res.json(ranking)
    }
    
    bestScore = async (req, res) => {
        const { category, difficulty } = req.query
        const bestScore = this.findBestScore({ categoryId: category, difficulty: difficulty })
        res.json(bestScore)
    }
}


