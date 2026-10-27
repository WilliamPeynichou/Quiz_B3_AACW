import { catalog } from '../../catalog/catalogData.js'

// Insère catégories + questions. Une catégorie qui a déjà des questions est ignorée,
// on peut donc relancer le seed à chaque démarrage sans créer de doublons.
export function seedCatalog(db) {
  const insertCategory = db.prepare('INSERT OR IGNORE INTO categories (name) VALUES (?)')
  const findCategory = db.prepare('SELECT id FROM categories WHERE name = ?')
  const countQuestions = db.prepare('SELECT COUNT(*) AS count FROM questions WHERE category_id = ?')
  const insertQuestion = db.prepare(
    `INSERT INTO questions (question, options, answer, category_id, difficulty)
     VALUES (?, ?, ?, ?, ?)`,
  )

  let inserted = 0
  db.transaction(() => {
    for (const { name, questions } of catalog) {
      insertCategory.run(name)
      const { id: categoryId } = findCategory.get(name)
      if (countQuestions.get(categoryId).count > 0) continue

      for (const [difficulty, list] of Object.entries(questions)) {
        for (const q of list) {
          insertQuestion.run(q.question, JSON.stringify(q.options), q.answer, categoryId, difficulty)
          inserted++
        }
      }
    }
  })()

  if (inserted > 0) console.log(`Seed catalog : ${inserted} questions insérées`)
}
