import { questions } from '../../data/questions.js'

// Catégorie des questions de départ (la feature catalog 2.1 ajoutera les autres)
const DEFAULT_CATEGORY = 'React'
const DEFAULT_DIFFICULTY = 'facile'

export function seedCatalog(db) {
  const { count } = db.prepare('SELECT COUNT(*) AS count FROM questions').get()
  if (count > 0) return

  db.transaction(() => {
    db.prepare('INSERT OR IGNORE INTO categories (name) VALUES (?)').run(DEFAULT_CATEGORY)
    const { id: categoryId } = db
      .prepare('SELECT id FROM categories WHERE name = ?')
      .get(DEFAULT_CATEGORY)

    const insert = db.prepare(
      `INSERT INTO questions (question, options, answer, category_id, difficulty)
       VALUES (?, ?, ?, ?, ?)`,
    )
    for (const q of questions) {
      insert.run(q.question, JSON.stringify(q.options), q.answer, categoryId, q.difficulty ?? DEFAULT_DIFFICULTY)
    }
  })()
  console.log(`Seed : ${questions.length} questions insérées`)
}
