import { Question } from '../../domain/entities/Question.js'
import { QuestionRepository } from '../../domain/repositories/QuestionRepository.js'

const toEntity = (row) =>
  new Question({ ...row, options: JSON.parse(row.options) })

export class SqliteQuestionRepository extends QuestionRepository {
  constructor(db) {
    super()
    this.db = db
  }

  async findAll() {
    return this.db.prepare('SELECT * FROM questions ORDER BY id').all().map(toEntity)
  }

  async findById(id) {
    const row = this.db.prepare('SELECT * FROM questions WHERE id = ?').get(Number(id))
    return row ? toEntity(row) : null
  }
}
