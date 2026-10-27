import { test, before, after } from 'node:test'
import assert from 'node:assert/strict'

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
  baseUrl = `http://localhost:${server.address().port}/api/catalog`
})

after(() => server?.close())

test('le seed insère 5 questions par catégorie et par difficulté', () => {
  const rows = db
    .prepare('SELECT category_id, difficulty, COUNT(*) AS n FROM questions GROUP BY 1, 2')
    .all()
  assert.equal(rows.length, 4 * 3)
  for (const row of rows) assert.equal(row.n, 5)
})

test('GET /api/catalog/categories → les 4 catégories jouables { id, name }', async () => {
  const res = await fetch(`${baseUrl}/categories`)
  assert.equal(res.status, 200)

  const categories = await res.json()
  assert.deepEqual(
    categories.map((c) => c.name),
    ['Musique', 'Culture générale', 'Cinéma', 'Voyage'],
  )
  for (const c of categories) assert.deepEqual(Object.keys(c), ['id', 'name'])
})

test('GET /api/catalog/categories → ignore les catégories sans questions', async () => {
  db.prepare('INSERT INTO categories (name) VALUES (?)').run('Catégorie vide')

  const categories = await (await fetch(`${baseUrl}/categories`)).json()
  assert.ok(!categories.some((c) => c.name === 'Catégorie vide'))
})
