export class CatalogController {
  constructor({ getCategories, getCatalogQuestions }) {
    this.getCategories = getCategories
    this.getCatalogQuestions = getCatalogQuestions
  }

  categories = async (req, res) => {
    res.json(await this.getCategories.execute())
  }

  // GET /questions?category=<id>&difficulty=<niveau>
  questions = async (req, res) => {
    const { category, difficulty } = req.query
    res.json(await this.getCatalogQuestions.execute({ category, difficulty }))
  }
}
