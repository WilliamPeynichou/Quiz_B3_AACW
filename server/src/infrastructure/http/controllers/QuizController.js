export class QuizController {
  constructor({ getQuestions, checkAnswer }) {
    this.getQuestions = getQuestions
    this.checkAnswer = checkAnswer
  }

  list = async (req, res) => {
    res.json(await this.getQuestions.execute())
  }

  answer = async (req, res) => {
    const { id, choice } = req.body
    res.json(await this.checkAnswer.execute({ id, choice }))
  }
}
