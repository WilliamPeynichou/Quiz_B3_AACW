import { db } from './connection.js'
import { questions } from '../data/questions.js'

// Insère les questions de départ si la table est vide
export function seed() {
  const { count } = db.prepare('SELECT COUNT(*) AS count FROM questions').get()
  if (count > 0) return

  const insert = db.prepare(
    'INSERT INTO questions (question, options, answer) VALUES (?, ?, ?)',
  )
  db.transaction(() => {
    for (const q of questions) insert.run(q.question, JSON.stringify(q.options), q.answer)
  })()
  console.log(`Seed : ${questions.length} questions insérées`)
}
