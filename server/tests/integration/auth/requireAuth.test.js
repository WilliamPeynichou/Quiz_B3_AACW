import { test, before, after } from 'node:test'
import assert from 'node:assert/strict'
import express from 'express'

process.env.DB_PATH = ':memory:'

let server
let baseUrl
let token

before(async () => {
  const { requireAuth } = await import('../../../src/infrastructure/http/middlewares/requireAuth.js')
  const { errorHandler } = await import('../../../src/infrastructure/http/middlewares/errorHandler.js')
  const { initDatabase } = await import('../../../src/infrastructure/database/init.js')
  const container = await import('../../../src/container.js')

  initDatabase()
  // Route protégée jetable, montée sur une app à part
  const app = express()
  app.use(express.json())
  app.use('/api/auth', (await import('../../../src/infrastructure/http/auth/authRoutes.js')).authRoutes(container.authController))
  app.get('/api/protected', requireAuth, (req, res) => res.json(req.user))
  app.use(errorHandler)
  server = app.listen(0)
  baseUrl = `http://localhost:${server.address().port}/api`

  const res = await fetch(`${baseUrl}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'guard', email: 'guard@mail.com', password: 'motdepasse' }),
  })
  ;({ token } = await res.json())
})

after(() => server?.close())

test('token valide → req.user rempli avec { id, username }', async () => {
  const res = await fetch(`${baseUrl}/protected`, { headers: { Authorization: `Bearer ${token}` } })
  assert.equal(res.status, 200)
  const user = await res.json()
  assert.equal(user.username, 'guard')
  assert.equal(typeof user.id, 'number')
})

test('sans token → 401', async () => {
  assert.equal((await fetch(`${baseUrl}/protected`)).status, 401)
})

test('mauvais schéma ou token falsifié → 401', async () => {
  const basic = await fetch(`${baseUrl}/protected`, { headers: { Authorization: `Basic ${token}` } })
  assert.equal(basic.status, 401)
  const bad = await fetch(`${baseUrl}/protected`, { headers: { Authorization: `Bearer ${token}x` } })
  assert.equal(bad.status, 401)
})
