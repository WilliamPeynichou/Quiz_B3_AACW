import bcrypt from 'bcryptjs'
import { PasswordHasher } from '../../domain/auth/PasswordHasher.js'

const DEFAULT_ROUNDS = 10

export class BcryptPasswordHasher extends PasswordHasher {
  constructor({ rounds = DEFAULT_ROUNDS } = {}) {
    super()
    this.rounds = rounds
  }

  async hash(plain) {
    return bcrypt.hash(plain, this.rounds)
  }

  async compare(plain, hash) {
    return bcrypt.compare(plain, hash)
  }
}
