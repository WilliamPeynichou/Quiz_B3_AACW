import { test } from 'node:test'
import assert from 'node:assert/strict'
import { RegisterUser } from '../../../src/application/auth/RegisterUser.js'
import { User } from '../../../src/domain/auth/User.js'
import { UserRepository } from '../../../src/domain/auth/UserRepository.js'
import { ValidationError, ConflictError } from '../../../src/domain/auth/errors.js'

class InMemoryUserRepository extends UserRepository {
  users = []
  async findByEmail(email) {
    return this.users.find((u) => u.email === email) ?? null
  }
  async findByUsername(username) {
    return this.users.find((u) => u.username.toLowerCase() === username.toLowerCase()) ?? null
  }
  async create(data) {
    const user = new User({ id: this.users.length + 1, ...data })
    this.users.push(user)
    return user
  }
}

const fakeHasher = { hash: async (p) => `hashed:${p}` }
const fakeTokens = { sign: ({ id }) => `token-${id}` }

const setup = () => {
  const userRepository = new InMemoryUserRepository()
  const registerUser = new RegisterUser({ userRepository, passwordHasher: fakeHasher, tokenService: fakeTokens })
  return { userRepository, registerUser }
}

const valid = { username: 'william', email: 'William@Mail.com ', password: 'motdepasse' }

test('inscrit un utilisateur et ne renvoie que les infos publiques', async () => {
  const { registerUser, userRepository } = setup()
  const result = await registerUser.execute(valid)

  assert.deepEqual(result, { token: 'token-1', user: { id: 1, username: 'william' } })
  assert.equal(userRepository.users[0].email, 'william@mail.com') // normalisé
  assert.equal(userRepository.users[0].passwordHash, 'hashed:motdepasse') // jamais en clair
})

test('refuse des données invalides avec le détail par champ', async () => {
  const { registerUser } = setup()
  await assert.rejects(
    registerUser.execute({ username: 'a', email: 'pas-un-email', password: 'court' }),
    (err) => {
      assert.ok(err instanceof ValidationError)
      assert.equal(err.status, 400)
      assert.deepEqual(Object.keys(err.details).sort(), ['email', 'password', 'username'])
      return true
    },
  )
})

test('refuse un corps vide sans planter', async () => {
  const { registerUser } = setup()
  await assert.rejects(registerUser.execute(undefined), ValidationError)
})

test('refuse un email déjà utilisé (insensible à la casse)', async () => {
  const { registerUser } = setup()
  await registerUser.execute(valid)
  await assert.rejects(
    registerUser.execute({ ...valid, username: 'autre', email: 'WILLIAM@mail.com' }),
    (err) => err instanceof ConflictError && err.status === 409 && 'email' in err.details,
  )
})

test('refuse un pseudo déjà pris (insensible à la casse)', async () => {
  const { registerUser } = setup()
  await registerUser.execute(valid)
  await assert.rejects(
    registerUser.execute({ ...valid, username: 'WILLIAM', email: 'autre@mail.com' }),
    (err) => err instanceof ConflictError && 'username' in err.details,
  )
})
