import test from 'node:test'
import assert from 'node:assert/strict'
import { LoginUser } from '../../../src/application/auth/LoginUser.js'

const original = { id: 4, username: 'cedric', email: 'cedric@example.com', password_hash: 'hash' }
function setup({ found = true, passwordOk = true } = {}) {
  let checkedEmail = null
  const useCase = new LoginUser({
    userRepository: {
      findByEmail: async (email) => {
        checkedEmail = email
        return found ? original : null
      },
    },
    comparePassword: async (password, hash) => passwordOk && password === 'bon-mot-de-passe' && hash === 'hash',
    issueToken: () => 'token-test',
  })
  return { useCase, getEmail: () => checkedEmail }
}

test('connexion : retourne un token et un profil sans hash', async () => {
  const { useCase, getEmail } = setup()
  const result = await useCase.execute({ email: ' CEDRIC@EXAMPLE.COM ', password: 'bon-mot-de-passe' })
  assert.equal(getEmail(), 'cedric@example.com')
  assert.deepEqual(result, {
    token: 'token-test',
    user: { id: 4, username: 'cedric', email: 'cedric@example.com' },
  })
  assert.equal(JSON.stringify(result).includes('hash'), false)
})

test('connexion : refuse un email inconnu sans révéler lequel est invalide', async () => {
  const { useCase } = setup({ found: false })
  await assert.rejects(useCase.execute({ email: 'absent@test.fr', password: 'bon-mot-de-passe' }),
    (error) => error.status === 401 && error.message === 'Email ou mot de passe incorrect')
})

test('connexion : refuse un mauvais mot de passe', async () => {
  const { useCase } = setup({ passwordOk: false })
  await assert.rejects(useCase.execute({ email: original.email, password: 'mauvais' }),
    (error) => error.status === 401 && error.message === 'Email ou mot de passe incorrect')
})

test('connexion : refuse un formulaire incomplet', async () => {
  const { useCase } = setup()
  await assert.rejects(useCase.execute({ email: original.email }), (error) => error.status === 400)
  await assert.rejects(useCase.execute(undefined), (error) => error.status === 400)
})
