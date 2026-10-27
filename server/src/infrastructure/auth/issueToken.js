import { createHmac, timingSafeEqual } from 'node:crypto'
import { fileURLToPath } from 'node:url'
import dotenv from 'dotenv'
import { AuthError } from '../../application/auth/AuthError.js'

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

export function verifyToken(token) {
  const unauthorized = () => new AuthError('Session invalide ou expirée', 401)
  if (typeof token !== 'string' || token.length > 4096) throw unauthorized()
  const parts = token.split('.')
  if (parts.length !== 3 || parts.some((part) => !/^[A-Za-z0-9_-]+$/.test(part))) {
    throw unauthorized()
  }

  const [headerB64, payloadB64, signatureB64] = parts
  const data = `${headerB64}.${payloadB64}`
  const expected = Buffer.from(sign(data, ensureJwtSecret()), 'base64url')
  const received = Buffer.from(signatureB64, 'base64url')
  if (expected.length !== received.length || !timingSafeEqual(expected, received)) {
    throw unauthorized()
  }

  try {
    const header = JSON.parse(Buffer.from(headerB64, 'base64url').toString('utf8'))
    const payload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString('utf8'))
    const now = Math.floor(Date.now() / 1000)
    const userId = Number(payload.sub)
    if (header.alg !== 'HS256' || header.typ !== 'JWT' ||
        !Number.isSafeInteger(userId) || userId <= 0 ||
        String(userId) !== payload.sub ||
        !Number.isInteger(payload.iat) || payload.iat > now + 60 ||
        !Number.isInteger(payload.exp) || payload.exp <= now ||
        payload.exp <= payload.iat) {
      throw unauthorized()
    }
    return { id: userId, username: payload.username }
  } catch {
    throw unauthorized()
  }
}
