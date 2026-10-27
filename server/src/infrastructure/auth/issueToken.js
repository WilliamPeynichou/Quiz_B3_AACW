import { createHmac } from 'node:crypto'

// Secret indispensable avant l'insertion : pas de compte cree si JWT est mal configure.
export function ensureJwtSecret() {
  const secret = process.env.JWT_SECRET
  if (!secret || Buffer.byteLength(secret, 'utf8') < 32) {
    const error = new Error('JWT_SECRET doit contenir au moins 32 octets.')
    error.status = 500
    throw error
  }
  return secret
}

// Generation d'un JWT HS256 signe pour 24 heures.
export function issueToken(user) {
  const secret = ensureJwtSecret()
  const now = Math.floor(Date.now() / 1000)
  const encode = (value) => Buffer.from(JSON.stringify(value)).toString('base64url')
  const header = encode({ alg: 'HS256', typ: 'JWT' })
  const payload = encode({
    sub: String(user.id),
    username: user.username,
    iat: now,
    exp: now + 60 * 60 * 24,
  })
  const signingInput = `${header}.${payload}`
  const signature = createHmac('sha256', secret)
    .update(signingInput)
    .digest('base64url')

  return `${signingInput}.${signature}`
}
