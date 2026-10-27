// Contrat que toute implémentation (mémoire, SQLite...) doit respecter
export class CatalogRepository {
  // → Category[] (uniquement celles qui ont des questions)
  async findAllCategories() {
    throw new Error('Not implemented')
  }
}
