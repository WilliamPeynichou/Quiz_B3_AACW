export class SqliteUserRepository {
  constructor(db) {
    this.db = db
  }

  async findByUsername(username) {
    return this.db.prepare('SELECT id FROM users WHERE username = ?').get(username) ?? null
  }

  async findByEmail(email) {
    return this.db.prepare('SELECT id FROM users WHERE email = ?').get(email) ?? null
  }

  async create({ username, email, password_hash }) {
    const result = this.db.prepare(
      'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
    ).run(username, email, password_hash)

    return this.db.prepare(
      'SELECT id, username, email FROM users WHERE id = ?',
    ).get(result.lastInsertRowid)
  }
}
