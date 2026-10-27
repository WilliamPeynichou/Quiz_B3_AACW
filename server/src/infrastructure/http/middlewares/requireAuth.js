// BOUCHON : remplacé par la vraie vérification JWT (feature auth 1.3).
// Contrat : remplit toujours req.user = { id, username }.
export const requireAuth = (req, res, next) => {
  req.user = { id: 1, username: 'demo' }
  next()
}
