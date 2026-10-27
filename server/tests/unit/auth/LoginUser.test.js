import { test } from 'node:test'
import assert from 'node:assert/strict'
import { LoginUser } from '../../../src/application/auth/LoginUser.js'
import { GetCurrentUser } from '../../../src/application/auth/GetCurrentUser.js'
import { User } from '../../../src/domain/auth/User.js'
import { UserRepository } from '../../../src/domain/auth/UserRepository.js'
import { ValidationError, UnauthorizedError } from '../../../src/domain/auth/errors.js'

class InMemoryUserRepository extends UserRepository {
  users = [new User({ id: 1, username: 'william', email: 'william@mail.com', passwordHash: 'hashed:motdepasse' })]
  async findByEmail(email) {
    return this.users.find((u) => u.email === email) ?? null
  }
  async findById(id) {
    return this.users.find((u) => u.id === id) ?? null
  }
}

const hasher = { compare: async (plain, hash) => hash === `hashed:${plain}` }
const tokens = {
  sign: ({ id }) => `token-${id}`,
  verify: (t) => {
    if (!t.startsWith('token-')) throw new UnauthorizedError('Token invalide ou expiré')
    return { id: Number(t.slice(6)) }
  },
}

const setup = () => {
  const userRepository = new InMemoryUserRepository()
  return {
    login: new LoginUser({ userRepository, passwordHasher: hasher, tokenService: tokens }),
    me: new GetCurrentUser({ userRepository, tokenService: tokens }),
  }
}

test('connecte avec les bons identifiants et renvoie token + user public', async () => {
  const { login } = setup()
  const result = await login.execute({ email: ' William@Mail.com ', password: 'motdepasse' })
  assert.deepEqual(result, { token: 'token-1', user: { id: 1, username: 'william' } })
})

test('refuse un mauvais mot de passe ou un email inconnu avec le même message', async () => {
  const { login } = setup()
  const badPassword = await login.execute({ email: 'william@mail.com', password: 'faux' }).catch((e) => e)
  const badEmail = await login.execute({ email: 'x@mail.com', password: 'motdepasse' }).catch((e) => e)
  assert.ok(badPassword instanceof UnauthorizedError)
  assert.ok(badEmail instanceof UnauthorizedError)
  assert.equal(badPassword.message, badEmail.message)
})

test('refuse des champs manquants', async () => {
  const { login } = setup()
  await assert.rejects(() => login.execute({}), ValidationError)
})

test('me renvoie l’utilisateur du token', async () => {
  const { me } = setup()
  assert.deepEqual(await me.execute('token-1'), { id: 1, username: 'william' })
})

test('me refuse un token absent, invalide ou d’un utilisateur supprimé', async () => {
  const { me } = setup()
  await assert.rejects(() => me.execute(null), UnauthorizedError)
  await assert.rejects(() => me.execute('abc'), UnauthorizedError)
  await assert.rejects(() => me.execute('token-99'), UnauthorizedError)
})
