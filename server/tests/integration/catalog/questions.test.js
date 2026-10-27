import { test, before, after } from 'node:test'
import assert from 'node:assert/strict'

// Base SQLite en mémoire : n'abîme pas la base locale data/quiz.db
process.env.DB_PATH = ':memory:'

let server
let baseUrl

before(async () => {
  // Imports dynamiques : DB_PATH doit être défini avant l'ouverture de la connexion
  const { initDatabase } = await import('../../../src/infrastructure/database/init.js')
  const { createApp } = await import('../../../src/infrastructure/http/app.js')
  const container = await import('../../../src/container.js')

  initDatabase()
  server = createApp(container).listen(0)
  baseUrl = `http://localhost:${server.address().port}/api/catalog/questions`
})

after(() => server?.close())

test('GET /api/catalog/questions → 5 questions filtrées, sans la réponse', async () => {
  const res = await fetch(`${baseUrl}?category=1&difficulty=moyen`)
  assert.equal(res.status, 200)

  const questions = await res.json()
  assert.equal(questions.length, 5)
  for (const q of questions) {
    assert.deepEqual(Object.keys(q), ['id', 'question', 'options'])
    assert.equal(q.options.length, 4)
  }
})

test('GET /api/catalog/questions → 400 si la difficulté est invalide', async () => {
  const res = await fetch(`${baseUrl}?category=1&difficulty=expert`)
  assert.equal(res.status, 400)
  assert.ok((await res.json()).details.difficulty)
})

test('GET /api/catalog/questions → 400 si les paramètres manquent', async () => {
  const res = await fetch(baseUrl)
  assert.equal(res.status, 400)
})

test('GET /api/catalog/questions → 404 si la catégorie n’existe pas', async () => {
  const res = await fetch(`${baseUrl}?category=999&difficulty=facile`)
  assert.equal(res.status, 404)
})
