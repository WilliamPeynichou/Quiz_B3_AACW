import { test, before, after } from 'node:test'
import assert from 'node:assert/strict'
import { DIFFICULTIES } from '../../../src/constants/difficulties.js'

// Base SQLite en mémoire : n'abîme pas la base locale data/quiz.db
process.env.DB_PATH = ':memory:'

let server
let baseUrl
let db

before(async () => {
  // Imports dynamiques : DB_PATH doit être défini avant l'ouverture de la connexion
  const { initDatabase } = await import('../../../src/infrastructure/database/init.js')
  const { createApp } = await import('../../../src/infrastructure/http/app.js')
  const container = await import('../../../src/container.js')
  ;({ db } = await import('../../../src/infrastructure/database/connection.js'))

  initDatabase()
  server = createApp(container).listen(0)
  baseUrl = `http://localhost:${server.address().port}/api`
})

after(() => server?.close())

const register = (body) =>
  fetch(`${baseUrl}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

test('la BDD contient les 4 tables du contrat', () => {
  const tables = db
    .prepare("SELECT name FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%'")
    .all()
    .map((t) => t.name)
    .sort()
  assert.deepEqual(tables, ['categories', 'questions', 'results', 'users'])
})

test('le seed range les questions dans une catégorie avec une difficulté', async () => {
  const row = db.prepare('SELECT category_id, difficulty FROM questions LIMIT 1').get()
  assert.ok(row.category_id)
  assert.ok(DIFFICULTIES.includes(row.difficulty))

  // L'API existante du quiz fonctionne toujours
  const res = await fetch(`${baseUrl}/questions`)
  assert.equal(res.status, 200)
  assert.ok((await res.json()).length > 0)
})

test('POST /api/auth/register → 201 et mot de passe hashé en base', async () => {
  const res = await register({ username: 'william', email: 'william@mail.com', password: 'motdepasse' })
  assert.equal(res.status, 201)

  const body = await res.json()
  assert.deepEqual(body.user, { id: body.user.id, username: 'william' })
  assert.equal(typeof body.token, 'string')

  const row = db.prepare('SELECT password_hash FROM users WHERE email = ?').get('william@mail.com')
  assert.notEqual(row.password_hash, 'motdepasse')
  assert.match(row.password_hash, /^\$2[aby]\$/) // format bcrypt
})

test('POST /api/auth/register → 409 si email déjà utilisé', async () => {
  const res = await register({ username: 'autre', email: 'william@mail.com', password: 'motdepasse' })
  assert.equal(res.status, 409)
  assert.ok((await res.json()).details.email)
})

test('POST /api/auth/register → 400 avec le détail des erreurs', async () => {
  const res = await register({ username: 'a', email: 'nope', password: '123' })
  assert.equal(res.status, 400)
  const body = await res.json()
  assert.equal(body.error, 'Données invalides')
  assert.ok(body.details.username && body.details.email && body.details.password)
})

test('POST /api/auth/register → 400 si le JSON est mal formé', async () => {
  const res = await fetch(`${baseUrl}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: '{ pas du json',
  })
  assert.equal(res.status, 400)
})
