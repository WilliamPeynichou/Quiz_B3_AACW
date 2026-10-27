// Contrat que toute implémentation (mémoire, SQLite...) doit respecter
export class CatalogRepository {
  // → Category[] (uniquement celles qui ont des questions)
  async findAllCategories() {
    throw new Error('Not implemented')
  }

  // → Category | null
  async findCategoryById(id) {
    throw new Error('Not implemented')
  }

  // → Question[] (avec la réponse : c'est au use-case de la retirer)
  async findQuestions({ categoryId, difficulty }) {
    throw new Error('Not implemented')
  }
}
