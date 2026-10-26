// Composition root : on assemble les dépendances ici
import { db } from './infrastructure/database/connection.js'
import { SqliteQuestionRepository } from './infrastructure/repositories/SqliteQuestionRepository.js'
import { GetQuestions } from './application/use-cases/GetQuestions.js'
import { CheckAnswer } from './application/use-cases/CheckAnswer.js'
import { QuizController } from './infrastructure/http/controllers/QuizController.js'

const questionRepository = new SqliteQuestionRepository(db)

export const quizController = new QuizController({
  getQuestions: new GetQuestions(questionRepository),
  checkAnswer: new CheckAnswer(questionRepository),
})
