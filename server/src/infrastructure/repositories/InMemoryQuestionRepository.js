import { Question } from '../../domain/entities/Question.js'
import { QuestionRepository } from '../../domain/repositories/QuestionRepository.js'
import { questions } from '../data/questions.js'

export class InMemoryQuestionRepository extends QuestionRepository {
  constructor() {
    super()
    this.questions = questions.map((q, id) => new Question({ id, ...q }))
  }

  async findAll() {
    return this.questions
  }

  async findById(id) {
    return this.questions.find((q) => q.id === Number(id)) ?? null
  }
}
