import test from 'node:test'
import assert from 'node:assert/strict'
import { createHmac } from 'node:crypto'
import { issueToken, verifyToken } from '../../../src/infrastructure/auth/issueToken.js'

const previous = process.env.JWT_SECRET
process.env.JWT_SECRET = 'cle-uniquement-pour-les-tests-une-chaine-de-64-caracteres-minimum'

const user = { id: 23, username: 'cedric' }

test('JWT : le jeton valide retrouve le compte', () => {
  assert.deepEqual(verifyToken(issueToken(user)), user)
})

test('JWT : une signature modifiée est refusée', () => {
  const token = issueToken(user)
  const pieces = token.split('.')
  pieces[2] = pieces[2][0] === 'a' ? 'b' + pieces[2].slice(1) : 'a' + pieces[2].slice(1)
  assert.throws(() => verifyToken(pieces.join('.')), (error) => error.status === 401)
})

test('JWT : un token expiré est refusé', () => {
  const encoder = (value) => Buffer.from(JSON.stringify(value)).toString('base64url')
  const header = encoder({ alg: 'HS256', typ: 'JWT' })
  const payload = encoder({ sub: '23', username: 'cedric', iat: 100, exp: 200 })
  const data = `${header}.${payload}`
  const signature = createHmac('sha256', process.env.JWT_SECRET).update(data).digest('base64url')
  assert.throws(() => verifyToken(`${data}.${signature}`), (error) => error.status === 401)
})

test('JWT : une clé trop courte est refusée à la création', () => {
  const secret = process.env.JWT_SECRET
  process.env.JWT_SECRET = 'court'
  try {
    assert.throws(() => issueToken(user), /JWT_SECRET/)
  } finally {
    process.env.JWT_SECRET = secret
  }
})

test('JWT : le token sans signature est refusé', () => {
  assert.throws(() => verifyToken('abc.def.ghi'), (error) => error.status === 401)
})

test.after(() => {
  if (previous === undefined) delete process.env.JWT_SECRET
  else process.env.JWT_SECRET = previous
})
