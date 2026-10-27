// Contrat que toute implémentation (mémoire, SQLite...) doit respecter
export class UserRepository {
  async findByEmail(email) {
    throw new Error('Not implemented')
  }

  async findById(id) {
    throw new Error('Not implemented')
  }

  async findByUsername(username) {
    throw new Error('Not implemented')
  }

  // { username, email, passwordHash } → User
  async create(data) {
    throw new Error('Not implemented')
  }
}
