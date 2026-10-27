// Contrat de gestion des tokens : le domaine ne dépend pas de jsonwebtoken
export class TokenService {
  // { id, username } → token
  sign(payload) {
    throw new Error('Not implemented')
  }

  // token → { id, username }, ou lève une UnauthorizedError
  verify(token) {
    throw new Error('Not implemented')
  }
}
