import test from 'node:test'
import assert from 'node:assert/strict'
import { RegisterUser } from '../../../src/application/auth/RegisterUser.js'

function setup({ usernameTaken = false, emailTaken = false } = {}) {
  const created = []
  const repository = {
    findByUsername: async () => usernameTaken ? { id: 1 } : null,
    findByEmail: async () => emailTaken ? { id: 2 } : null,
    create: async (user) => {
      created.push(user)
      return { id: 3, username: user.username, email: user.email }
    },
  }
  const useCase = new RegisterUser({
    userRepository: repository,
    hashPassword: async () => 'hash-de-test',
    issueToken: () => 'jwt-de-test',
  })
  return { useCase, created }
}

const valid = {
  username: ' Cedric ',
  email: ' CEDRIC@EXAMPLE.COM ',
  password: 'un-mot-de-passe-solide',
}

test('inscription : normalise les champs et ne renvoie pas le mot de passe', async () => {
  const { useCase, created } = setup()
  const response = await useCase.execute(valid)

  assert.equal(response.token, 'jwt-de-test')
  assert.deepEqual(response.user, {
    id: 3,
    username: 'cedric',
    email: 'cedric@example.com',
  })
  assert.deepEqual(created, [{
    username: 'cedric',
    email: 'cedric@example.com',
    password_hash: 'hash-de-test',
  }])
  assert.equal(JSON.stringify(response).includes(valid.password), false)
})

test('inscription : rejette les donnees invalides sans ecrire dans la base', async () => {
  const { useCase, created } = setup()
  await assert.rejects(
    useCase.execute({ username: 'x', email: 'incorrect', password: '123' }),
    (error) => error.status === 400 &&
      Boolean(error.details.username && error.details.email && error.details.password),
  )
  assert.equal(created.length, 0)
})

test('inscription : refuse un nom deja utilise', async () => {
  const { useCase } = setup({ usernameTaken: true })
  await assert.rejects(useCase.execute(valid), (error) => error.status === 409)
})

test('inscription : refuse un email deja utilise', async () => {
  const { useCase } = setup({ emailTaken: true })
  await assert.rejects(useCase.execute(valid), (error) => error.status === 409)
})

test('inscription : refuse un mot de passe depassant 72 octets UTF-8', async () => {
  const { useCase } = setup()
  await assert.rejects(
    useCase.execute({ ...valid, password: 'é'.repeat(40) }),
    (error) => error.status === 400 && Boolean(error.details.password),
  )
})

test('inscription : refuse une requete sans corps JSON', async () => {
  const { useCase } = setup()
  await assert.rejects(useCase.execute(undefined), (error) => error.status === 400)
})
