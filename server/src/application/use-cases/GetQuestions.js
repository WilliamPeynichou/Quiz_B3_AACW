export class GetQuestions {
  constructor(questionRepository) {
    this.questionRepository = questionRepository
  }

  async execute() {
    const questions = await this.questionRepository.findAll()
    return questions.map((q) => q.toPublic())
  }
}
