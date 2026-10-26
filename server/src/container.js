// Composition root : on assemble les dépendances ici
import { db } from './infrastructure/database/connection.js'
import { SqliteQuestionRepository } from './infrastructure/repositories/SqliteQuestionRepository.js'
import { GetQuestions } from './application/use-cases/GetQuestions.js'
import { CheckAnswer } from './application/use-cases/CheckAnswer.js'
import { QuizController } from './infrastructure/http/controllers/QuizController.js'
import { SqliteUserRepository } from './infrastructure/auth/SqliteUserRepository.js'
import { BcryptPasswordHasher } from './infrastructure/auth/BcryptPasswordHasher.js'
import { RegisterUser } from './application/auth/RegisterUser.js'
import { AuthController } from './infrastructure/http/auth/AuthController.js'

const questionRepository = new SqliteQuestionRepository(db)
const userRepository = new SqliteUserRepository(db)
const passwordHasher = new BcryptPasswordHasher()

export const quizController = new QuizController({
  getQuestions: new GetQuestions(questionRepository),
  checkAnswer: new CheckAnswer(questionRepository),
})

export const authController = new AuthController({
  registerUser: new RegisterUser({ userRepository, passwordHasher }),
})
