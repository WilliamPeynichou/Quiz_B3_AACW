// Contrat de hachage : le domaine ne dépend pas de bcrypt directement
export class PasswordHasher {
  async hash(plain) {
    throw new Error('Not implemented')
  }

  async compare(plain, hash) {
    throw new Error('Not implemented')
  }
}
