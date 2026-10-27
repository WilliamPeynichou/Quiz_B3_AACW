import { createApp } from './infrastructure/http/app.js'
import { initDatabase } from './infrastructure/database/init.js'
import { quizController, authController, catalogController } from './container.js'
import { env } from './config/env.js'
import isOdd from 'is-odd'

// Fonction sans rapport avec le projet (exercice git)
function ecrireImpoteur() {
  console.log(isOdd(3) ? 'impoteur' : '')
}

initDatabase()
ecrireImpoteur()

const app = createApp({ quizController, authController, catalogController })
app.listen(env.port, () => console.log(`API sur http://localhost:${env.port}`))
