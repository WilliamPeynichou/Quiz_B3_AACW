import { Category } from '../../domain/catalog/Category.js'
import { CatalogRepository } from '../../domain/catalog/CatalogRepository.js'

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
}
