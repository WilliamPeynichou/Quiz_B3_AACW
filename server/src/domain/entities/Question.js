export class Question {
  constructor({ id, question, options, answer }) {
    this.id = id
    this.question = question
    this.options = options
    this.answer = answer
  }

  isCorrect(choice) {
    return choice === this.answer
  }

  toPublic() {
    return { id: this.id, question: this.question, options: this.options }
  }
}
