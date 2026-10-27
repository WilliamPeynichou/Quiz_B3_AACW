// Composition root : on assemble les dépendances ici
import { db } from './infrastructure/database/connection.js'
import { SqliteQuestionRepository } from './infrastructure/repositories/SqliteQuestionRepository.js'
import { GetQuestions } from './application/use-cases/GetQuestions.js'
import { CheckAnswer } from './application/use-cases/CheckAnswer.js'
import { QuizController } from './infrastructure/http/controllers/QuizController.js'
import { SqliteUserRepository } from './infrastructure/auth/SqliteUserRepository.js'
import { BcryptPasswordHasher } from './infrastructure/auth/BcryptPasswordHasher.js'
import { JwtTokenService } from './infrastructure/auth/JwtTokenService.js'
import { RegisterUser } from './application/auth/RegisterUser.js'
import { LoginUser } from './application/auth/LoginUser.js'
import { GetCurrentUser } from './application/auth/GetCurrentUser.js'
import { env } from './config/env.js'
import { AuthController } from './infrastructure/http/auth/AuthController.js'
import { SqliteCatalogRepository } from './infrastructure/catalog/SqliteCatalogRepository.js'
import { GetCategories } from './application/catalog/GetCategories.js'
import { CatalogController } from './infrastructure/http/catalog/CatalogController.js'

const questionRepository = new SqliteQuestionRepository(db)
const userRepository = new SqliteUserRepository(db)
const passwordHasher = new BcryptPasswordHasher()
const tokenService = new JwtTokenService({ secret: env.jwtSecret, expiresIn: env.jwtExpiresIn })
const catalogRepository = new SqliteCatalogRepository(db)

export const quizController = new QuizController({
  getQuestions: new GetQuestions(questionRepository),
  checkAnswer: new CheckAnswer(questionRepository),
})

export const authController = new AuthController({
  registerUser: new RegisterUser({ userRepository, passwordHasher, tokenService }),
  loginUser: new LoginUser({ userRepository, passwordHasher, tokenService }),
  getCurrentUser: new GetCurrentUser({ userRepository, tokenService }),
})

export const catalogController = new CatalogController({
  getCategories: new GetCategories(catalogRepository),
})
