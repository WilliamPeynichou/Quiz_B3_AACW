export class User {
  constructor({ id, username, email, passwordHash, createdAt }) {
    this.id = id
    this.username = username
    this.email = email
    this.passwordHash = passwordHash
    this.createdAt = createdAt
  }

  // Ce qui peut sortir vers le client : jamais le hash du mot de passe
  toPublic() {
    return { id: this.id, username: this.username }
  }
}
