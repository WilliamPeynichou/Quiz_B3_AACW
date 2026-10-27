// Bouchon 4.1 : faux users + results pour coder ranking sans attendre game.
// À retirer une fois la feature game mergée.

const FAKE_USERS = [
  { id: 1, username: 'demo', email: 'demo@quiz.local' },
  { id: 2, username: 'alice', email: 'alice@quiz.local' },
  { id: 3, username: 'bob', email: 'bob@quiz.local' },
  { id: 4, username: 'charlie', email: 'charlie@quiz.local' },
  { id: 5, username: 'diane', email: 'diane@quiz.local' },
  { id: 6, username: 'eric', email: 'eric@quiz.local' },
  { id: 7, username: 'fatou', email: 'fatou@quiz.local' },
  { id: 8, username: 'hugo', email: 'hugo@quiz.local' },
]

const STUB_CATEGORIES = ['Histoire', 'Sciences', 'Sport']
const FAKE_PASSWORD_HASH = 'not-a-real-hash'

function fakeResults(cat) {
  return [
    // Histoire / facile : plus de 10 scores → top 10 testable (4.2)
    { userId: 2, categoryId: cat(0), difficulty: 'facile', score: 90, correct: 9, total: 10, durationMs: 45000, playedAt: '2026-10-20 10:00:00' },
    { userId: 3, categoryId: cat(0), difficulty: 'facile', score: 80, correct: 8, total: 10, durationMs: 52000, playedAt: '2026-10-20 11:00:00' },
    { userId: 1, categoryId: cat(0), difficulty: 'facile', score: 70, correct: 7, total: 10, durationMs: 61000, playedAt: '2026-10-21 09:15:00' },
    { userId: 4, categoryId: cat(0), difficulty: 'facile', score: 60, correct: 6, total: 10, durationMs: 70000, playedAt: '2026-10-21 14:00:00' },
    { userId: 5, categoryId: cat(0), difficulty: 'facile', score: 50, correct: 5, total: 10, durationMs: 80000, playedAt: '2026-10-22 08:00:00' },
    { userId: 6, categoryId: cat(0), difficulty: 'facile', score: 40, correct: 4, total: 10, durationMs: 88000, playedAt: '2026-10-22 18:30:00' },
    { userId: 7, categoryId: cat(0), difficulty: 'facile', score: 30, correct: 3, total: 10, durationMs: 95000, playedAt: '2026-10-23 12:00:00' },
    { userId: 8, categoryId: cat(0), difficulty: 'facile', score: 20, correct: 2, total: 10, durationMs: 110000, playedAt: '2026-10-23 16:45:00' },
    { userId: 2, categoryId: cat(0), difficulty: 'facile', score: 85, correct: 8, total: 10, durationMs: 48000, playedAt: '2026-10-24 10:00:00' },
    { userId: 3, categoryId: cat(0), difficulty: 'facile', score: 75, correct: 7, total: 10, durationMs: 55000, playedAt: '2026-10-24 11:20:00' },
    { userId: 4, categoryId: cat(0), difficulty: 'facile', score: 55, correct: 5, total: 10, durationMs: 72000, playedAt: '2026-10-25 09:00:00' },

    { userId: 2, categoryId: cat(0), difficulty: 'moyen', score: 160, correct: 8, total: 10, durationMs: 40000, playedAt: '2026-10-20 15:00:00' },
    { userId: 1, categoryId: cat(0), difficulty: 'moyen', score: 140, correct: 7, total: 10, durationMs: 58000, playedAt: '2026-10-21 15:00:00' },
    { userId: 5, categoryId: cat(0), difficulty: 'moyen', score: 120, correct: 6, total: 10, durationMs: 65000, playedAt: '2026-10-22 15:00:00' },

    { userId: 3, categoryId: cat(1), difficulty: 'difficile', score: 210, correct: 7, total: 10, durationMs: 35000, playedAt: '2026-10-21 18:00:00' },
    { userId: 1, categoryId: cat(1), difficulty: 'difficile', score: 180, correct: 6, total: 10, durationMs: 42000, playedAt: '2026-10-22 18:00:00' },
    { userId: 6, categoryId: cat(1), difficulty: 'difficile', score: 90, correct: 3, total: 10, durationMs: 50000, playedAt: '2026-10-23 18:00:00' },

    { userId: 1, categoryId: cat(2), difficulty: 'facile', score: 50, correct: 5, total: 10, durationMs: 64000, playedAt: '2026-10-25 20:00:00' },
    { userId: 7, categoryId: cat(2), difficulty: 'moyen', score: 100, correct: 5, total: 10, durationMs: 60000, playedAt: '2026-10-26 10:00:00' },
  ]
}

export function seedRanking(db) {
  const { count } = db.prepare('SELECT COUNT(*) AS count FROM results').get()
  if (count > 0) return

  const insertUser = db.prepare(`
    INSERT OR IGNORE INTO users (id, username, email, password_hash)
    VALUES (@id, @username, @email, @password_hash)
  `)
  const insertCategory = db.prepare('INSERT OR IGNORE INTO categories (name) VALUES (?)')
  const insertResult = db.prepare(`
    INSERT INTO results (
      user_id, category_id, difficulty, score, correct_count, total, duration_ms, played_at
    ) VALUES (@userId, @categoryId, @difficulty, @score, @correct, @total, @durationMs, @playedAt)
  `)

  db.transaction(() => {
    for (const user of FAKE_USERS) {
      insertUser.run({ ...user, password_hash: FAKE_PASSWORD_HASH })
    }

    const existingCategories = db.prepare('SELECT id FROM categories').all()
    if (existingCategories.length === 0) {
      for (const name of STUB_CATEGORIES) insertCategory.run(name)
    }

    const categories = db.prepare('SELECT id FROM categories ORDER BY id').all()
    if (categories.length === 0) return

    const cat = (index) => categories[index % categories.length].id
    for (const row of fakeResults(cat)) insertResult.run(row)
  })()

  const { count: inserted } = db.prepare('SELECT COUNT(*) AS count FROM results').get()
  console.log(`Seed ranking : ${FAKE_USERS.length} users, ${inserted} results`)
}
