// Données envoyées invalides → 400. `details` = { champ: message }
export class ValidationError extends Error {
  constructor(details, message = 'Données invalides') {
    super(message)
    this.name = 'ValidationError'
    this.status = 400
    this.details = details
  }
}
