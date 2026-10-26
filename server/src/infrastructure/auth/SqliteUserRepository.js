import { User } from '../../domain/auth/User.js'
import { UserRepository } from '../../domain/auth/UserRepository.js'
import { ConflictError } from '../../domain/auth/errors.js'

const toEntity = (row) =>
  new User({
    id: row.id,
    username: row.username,
    email: row.email,
    passwordHash: row.password_hash,
    createdAt: row.created_at,
  })

export class SqliteUserRepository extends UserRepository {
  constructor(db) {
    super()
    this.db = db
  }

  async findByEmail(email) {
    const row = this.db.prepare('SELECT * FROM users WHERE email = ?').get(email)
    return row ? toEntity(row) : null
  }

  async findByUsername(username) {
    const row = this.db
      .prepare('SELECT * FROM users WHERE username = ? COLLATE NOCASE')
      .get(username)
    return row ? toEntity(row) : null
  }

  async create({ username, email, passwordHash }) {
    try {
      const { lastInsertRowid } = this.db
        .prepare('INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)')
        .run(username, email, passwordHash)
      const row = this.db.prepare('SELECT * FROM users WHERE id = ?').get(lastInsertRowid)
      return toEntity(row)
    } catch (err) {
      // Filet de sécurité si deux inscriptions identiques arrivent en même temps
      if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
        throw new ConflictError('Email ou pseudo déjà utilisé')
      }
      throw err
    }
  }
}
