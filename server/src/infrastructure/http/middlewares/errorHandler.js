// eslint-disable-next-line no-unused-vars
export const errorHandler = (err, req, res, next) => {
  const status = err.status || 500
  if (status === 500) console.error(err)
  res.status(status).json({ error: status === 500 ? 'Erreur serveur' : err.message })
}
