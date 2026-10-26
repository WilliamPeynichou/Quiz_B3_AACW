import { NotFoundError } from '../../domain/errors/NotFoundError.js'

export class CheckAnswer {
  constructor(questionRepository) {
    this.questionRepository = questionRepository
  }

  async execute({ id, choice }) {
    const question = await this.questionRepository.findById(id)
    if (!question) throw new NotFoundError('Question introuvable')
    return { correct: question.isCorrect(choice), answer: question.answer }
  }
}
