// eslint-disable-next-line no-unused-vars
export const errorHandler = (err, req, res, next) => {
  const status = err.status || 500
  if (status === 500) console.error(err)
  if (status === 500) return res.status(500).json({ error: 'Erreur serveur' })

  const body = { error: err.message }
  if (err.details) body.details = err.details // ex : { email: 'Email invalide' }
  res.status(status).json(body)
}
