import { createApp } from './infrastructure/http/app.js'
import { initDatabase } from './infrastructure/database/init.js'
import { quizController, authController } from './container.js'
import { env } from './config/env.js'

initDatabase()

const app = createApp({ quizController, authController })
app.listen(env.port, () => console.log(`API sur http://localhost:${env.port}`))
