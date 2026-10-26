// Données envoyées invalides → 400. `details` = { champ: message }
export class ValidationError extends Error {
  constructor(details, message = 'Données invalides') {
    super(message)
    this.name = 'ValidationError'
    this.status = 400
    this.details = details
  }
}

// Ressource déjà existante (email ou pseudo pris) → 409
export class ConflictError extends Error {
  constructor(message = 'Déjà utilisé', details) {
    super(message)
    this.name = 'ConflictError'
    this.status = 409
    this.details = details
  }
}
