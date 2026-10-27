import { Category } from '../../domain/catalog/Category.js'
import { Question } from '../../domain/entities/Question.js'
import { CatalogRepository } from '../../domain/catalog/CatalogRepository.js'

const toQuestion = (row) => new Question({ ...row, options: JSON.parse(row.options) })

export class SqliteCatalogRepository extends CatalogRepository {
  constructor(db) {
    super()
    this.db = db
  }

  // Seules les catégories jouables (avec au moins une question) sont proposées
  async findAllCategories() {
    return this.db
      .prepare(
        `SELECT id, name FROM categories c
         WHERE EXISTS (SELECT 1 FROM questions q WHERE q.category_id = c.id)
         ORDER BY id`,
      )
      .all()
      .map((row) => new Category(row))
  }

  async findCategoryById(id) {
    const row = this.db.prepare('SELECT id, name FROM categories WHERE id = ?').get(id)
    return row ? new Category(row) : null
  }

  async findQuestions({ categoryId, difficulty }) {
    return this.db
      .prepare(
        `SELECT id, question, options, answer FROM questions
         WHERE category_id = ? AND difficulty = ?`,
      )
      .all(categoryId, difficulty)
      .map(toQuestion)
  }
}
