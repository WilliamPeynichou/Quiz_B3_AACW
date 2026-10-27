export class GetCategories {
  constructor(catalogRepository) {
    this.catalogRepository = catalogRepository
  }

  async execute() {
    const categories = await this.catalogRepository.findAllCategories()
    return categories.map((c) => c.toPublic())
  }
}
