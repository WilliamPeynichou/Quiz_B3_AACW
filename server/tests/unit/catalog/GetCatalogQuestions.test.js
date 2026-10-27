import { test } from 'node:test'
import assert from 'node:assert/strict'
import { GetCatalogQuestions } from '../../../src/application/catalog/GetCatalogQuestions.js'
import { shuffle } from '../../../src/application/catalog/shuffle.js'
import { CatalogRepository } from '../../../src/domain/catalog/CatalogRepository.js'
import { Category } from '../../../src/domain/catalog/Category.js'
import { Question } from '../../../src/domain/entities/Question.js'
import { ValidationError } from '../../../src/domain/errors/ValidationError.js'
import { NotFoundError } from '../../../src/domain/errors/NotFoundError.js'

class InMemoryCatalogRepository extends CatalogRepository {
  categories = [new Category({ id: 1, name: 'Cinéma' })]
  questions = [
    { id: 1, question: 'Q1', options: ['a', 'b'], answer: 0, categoryId: 1, difficulty: 'facile' },
    { id: 2, question: 'Q2', options: ['a', 'b'], answer: 1, categoryId: 1, difficulty: 'facile' },
    { id: 3, question: 'Q3', options: ['a', 'b'], answer: 0, categoryId: 1, difficulty: 'facile' },
    { id: 4, question: 'Q4', options: ['a', 'b'], answer: 1, categoryId: 1, difficulty: 'moyen' },
  ]
  async findCategoryById(id) {
    return this.categories.find((c) => c.id === id) ?? null
  }
  async findQuestions({ categoryId, difficulty }) {
    return this.questions
      .filter((q) => q.categoryId === categoryId && q.difficulty === difficulty)
      .map((q) => new Question(q))
  }
}

// random() = 0 → chaque élément est échangé avec le premier : ordre prévisible
const setup = (random = () => 0) =>
  new GetCatalogQuestions(new InMemoryCatalogRepository(), random)

test('renvoie les questions de la catégorie et de la difficulté demandées, sans la réponse', async () => {
  const questions = await setup().execute({ category: '1', difficulty: 'facile' })

  assert.equal(questions.length, 3)
  for (const q of questions) assert.deepEqual(Object.keys(q), ['id', 'question', 'options'])
})

test("mélange l'ordre des questions", async () => {
  const questions = await setup().execute({ category: '1', difficulty: 'facile' })
  assert.deepEqual(questions.map((q) => q.id), [2, 3, 1])
})

test('refuse une difficulté ou une catégorie invalide (400 avec le détail)', async () => {
  await assert.rejects(setup().execute({ category: 'abc', difficulty: 'expert' }), (err) => {
    assert.ok(err instanceof ValidationError)
    assert.equal(err.status, 400)
    assert.deepEqual(Object.keys(err.details).sort(), ['category', 'difficulty'])
    return true
  })
})

test('refuse des paramètres absents sans planter', async () => {
  await assert.rejects(setup().execute(), ValidationError)
})

test('catégorie inexistante → 404', async () => {
  await assert.rejects(
    setup().execute({ category: '99', difficulty: 'facile' }),
    (err) => err instanceof NotFoundError && err.status === 404,
  )
})

test('shuffle garde les mêmes éléments et ne modifie pas le tableau reçu', () => {
  const items = [1, 2, 3, 4, 5]
  const result = shuffle(items)

  assert.deepEqual(items, [1, 2, 3, 4, 5])
  assert.deepEqual([...result].sort(), [1, 2, 3, 4, 5])
})
