export class CatalogController {
  constructor({ getCategories }) {
    this.getCategories = getCategories
  }

  categories = async (req, res) => {
    res.json(await this.getCategories.execute())
  }
}
