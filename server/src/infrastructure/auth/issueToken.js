import { createHmac } from 'node:crypto'
import { fileURLToPath } from 'node:url'
import dotenv from 'dotenv'

// Secret propre au poste de développement, non versionné : server/.env.auth.local.
dotenv.config({
  path: fileURLToPath(new URL('../../../.env.auth.local', import.meta.url)),
  quiet: true,
})

export function ensureJwtSecret() {
  const secret = process.env.JWT_SECRET
  if (!secret || Buffer.byteLength(secret, 'utf8') < 32) {
    throw new Error('JWT_SECRET doit contenir au moins 32 octets.')
  }
  return secret
}

const encode = (value) => Buffer.from(JSON.stringify(value)).toString('base64url')
const sign = (data, secret) => createHmac('sha256', secret).update(data).digest('base64url')

export function issueToken(user) {
  const secret = ensureJwtSecret()
  const now = Math.floor(Date.now() / 1000)
  const header = encode({ alg: 'HS256', typ: 'JWT' })
  const payload = encode({
    sub: String(user.id),
    username: user.username,
    iat: now,
    exp: now + 60 * 60 * 24,
  })
  const data = `${header}.${payload}`
  return `${data}.${sign(data, secret)}`
}

