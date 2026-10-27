import { test, before, after } from 'node:test'
import assert from 'node:assert/strict'

process.env.DB_PATH = ':memory:'

let server
let baseUrl

before(async () => {
  const { initDatabase } = await import('../../../src/infrastructure/database/init.js')
  const { createApp } = await import('../../../src/infrastructure/http/app.js')
  const container = await import('../../../src/container.js')

  initDatabase()
  server = createApp(container).listen(0)
  baseUrl = `http://localhost:${server.address().port}/api/auth`
})

after(() => server?.close())

const post = (path, body) =>
  fetch(`${baseUrl}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

const creds = { email: 'login@mail.com', password: 'motdepasse' }

test('connexion → 200 { token, user } puis /me avec ce token', async () => {
  await post('/register', { username: 'loginuser', ...creds })

  const res = await post('/login', creds)
  assert.equal(res.status, 200)
  const { token, user } = await res.json()
  assert.equal(user.username, 'loginuser')
  assert.equal(typeof token, 'string')

  const me = await fetch(`${baseUrl}/me`, { headers: { Authorization: `Bearer ${token}` } })
  assert.equal(me.status, 200)
  assert.deepEqual(await me.json(), user)
})

test('connexion → 401 si mot de passe faux ou email inconnu', async () => {
  assert.equal((await post('/login', { ...creds, password: 'faux' })).status, 401)
  assert.equal((await post('/login', { email: 'nope@mail.com', password: 'motdepasse' })).status, 401)
})

test('connexion → 400 si champs manquants', async () => {
  const res = await post('/login', {})
  assert.equal(res.status, 400)
  const { details } = await res.json()
  assert.ok(details.email && details.password)
})

test('/me → 401 sans token ou avec un token falsifié', async () => {
  assert.equal((await fetch(`${baseUrl}/me`)).status, 401)
  const bad = await fetch(`${baseUrl}/me`, { headers: { Authorization: 'Bearer abc.def.ghi' } })
  assert.equal(bad.status, 401)
})
