import { DIFFICULTIES } from '../../constants/difficulties.js'
import { ValidationError } from '../../domain/errors/ValidationError.js'
import { NotFoundError } from '../../domain/errors/NotFoundError.js'
import { shuffle } from './shuffle.js'

export class GetCatalogQuestions {
  constructor(catalogRepository, random = Math.random) {
    this.catalogRepository = catalogRepository
    this.random = random
  }

  // category et difficulty arrivent de la query string (donc en texte)
  async execute({ category, difficulty } = {}) {
    const categoryId = Number(category)
    const details = {}
    if (!Number.isInteger(categoryId) || categoryId <= 0) details.category = 'Catégorie invalide'
    if (!DIFFICULTIES.includes(difficulty)) {
      details.difficulty = `Difficulté attendue : ${DIFFICULTIES.join(', ')}`
    }
    if (Object.keys(details).length > 0) throw new ValidationError(details)

    if (!(await this.catalogRepository.findCategoryById(categoryId))) {
      throw new NotFoundError('Catégorie introuvable')
    }

    const questions = await this.catalogRepository.findQuestions({ categoryId, difficulty })
    return shuffle(questions, this.random).map((q) => q.toPublic())
  }
}
