export class AuthError extends Error {
  constructor(message, status = 400, details = undefined) {
    super(message)
    this.name = 'AuthError'
    this.status = status
    if (details) this.details = details
  }
}
