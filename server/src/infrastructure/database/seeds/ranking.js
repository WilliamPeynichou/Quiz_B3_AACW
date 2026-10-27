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

export function seedRanking(db) {
  const { count } = db.prepare('SELECT COUNT(*) AS count FROM results').get()
  if (count > 0) return

  const insertUser = db.prepare(`
    INSERT OR IGNORE INTO users (id, username, email, password_hash)
    VALUES (?, ?, ?, ?)
  `)
  const insertCategory = db.prepare('INSERT OR IGNORE INTO categories (name) VALUES (?)')

  db.transaction(() => {
    for (const user of FAKE_USERS) {
      insertUser.run(user.id, user.username, user.email, FAKE_PASSWORD_HASH)
    }

    const existingCategories = db.prepare('SELECT id FROM categories').all()
    if (existingCategories.length === 0) {
      for (const name of STUB_CATEGORIES) insertCategory.run(name)
    }

    const categories = db.prepare('SELECT id FROM categories ORDER BY id').all()
    if (categories.length === 0) return

    const cat = (index) => categories[index % categories.length].id
    const insertResult = db.prepare(`
      INSERT INTO results (
        user_id, category_id, difficulty, score, correct_count, total, duration_ms, played_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `)

    const rows = [
      [2, cat(0), 'facile', 90, 9, 10, 45000, '2026-10-20 10:00:00'],
      [3, cat(0), 'facile', 80, 8, 10, 52000, '2026-10-20 11:00:00'],
      [1, cat(0), 'facile', 70, 7, 10, 61000, '2026-10-21 09:15:00'],
      [4, cat(0), 'facile', 60, 6, 10, 70000, '2026-10-21 14:00:00'],
      [5, cat(0), 'facile', 50, 5, 10, 80000, '2026-10-22 08:00:00'],
      [6, cat(0), 'facile', 40, 4, 10, 88000, '2026-10-22 18:30:00'],
      [7, cat(0), 'facile', 30, 3, 10, 95000, '2026-10-23 12:00:00'],
      [8, cat(0), 'facile', 20, 2, 10, 110000, '2026-10-23 16:45:00'],
      [2, cat(0), 'facile', 85, 8, 10, 48000, '2026-10-24 10:00:00'],
      [3, cat(0), 'facile', 75, 7, 10, 55000, '2026-10-24 11:20:00'],
      [4, cat(0), 'facile', 55, 5, 10, 72000, '2026-10-25 09:00:00'],

      [2, cat(0), 'moyen', 160, 8, 10, 40000, '2026-10-20 15:00:00'],
      [1, cat(0), 'moyen', 140, 7, 10, 58000, '2026-10-21 15:00:00'],
      [5, cat(0), 'moyen', 120, 6, 10, 65000, '2026-10-22 15:00:00'],

      [3, cat(1), 'difficile', 210, 7, 10, 35000, '2026-10-21 18:00:00'],
      [1, cat(1), 'difficile', 180, 6, 10, 42000, '2026-10-22 18:00:00'],
      [6, cat(1), 'difficile', 90, 3, 10, 50000, '2026-10-23 18:00:00'],

      [1, cat(2), 'facile', 50, 5, 10, 64000, '2026-10-25 20:00:00'],
      [7, cat(2), 'moyen', 100, 5, 10, 60000, '2026-10-26 10:00:00'],
    ]

    for (const row of rows) insertResult.run(...row)
  })()

  const { count: inserted } = db.prepare('SELECT COUNT(*) AS count FROM results').get()
  console.log(`Seed ranking : ${FAKE_USERS.length} users, ${inserted} results`)
}
