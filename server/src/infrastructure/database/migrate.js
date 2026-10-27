import { db } from './connection.js'

function tableExists(name) {
  return Boolean(
    db.prepare("SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = ?").get(name),
  )
}

function hasColumn(table, column) {
  return db.prepare(`PRAGMA table_info(${table})`).all().some((col) => col.name === column)
}

export function migrate() {
  db.pragma('foreign_keys = ON')

  // Ancien schéma : questions sans category_id / difficulty → on recrée la table
  if (tableExists('questions') && !hasColumn('questions', 'category_id')) {
    db.exec('DROP TABLE questions')
  }

  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id            INTEGER PRIMARY KEY AUTOINCREMENT,
      username      TEXT    NOT NULL UNIQUE,
      email         TEXT    NOT NULL UNIQUE,
      password_hash TEXT    NOT NULL,
      created_at    TEXT    NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS categories (
      id   INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT    NOT NULL UNIQUE
    );

    CREATE TABLE IF NOT EXISTS questions (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      question    TEXT    NOT NULL,
      options     TEXT    NOT NULL,
      answer      INTEGER NOT NULL,
      category_id INTEGER NOT NULL REFERENCES categories(id),
      difficulty  TEXT    NOT NULL CHECK (difficulty IN ('facile', 'moyen', 'difficile'))
    );

    CREATE TABLE IF NOT EXISTS results (
      id            INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id       INTEGER NOT NULL REFERENCES users(id),
      category_id   INTEGER NOT NULL REFERENCES categories(id),
      difficulty    TEXT    NOT NULL CHECK (difficulty IN ('facile', 'moyen', 'difficile')),
      score         INTEGER NOT NULL,
      correct_count INTEGER NOT NULL,
      total         INTEGER NOT NULL,
      duration_ms   INTEGER NOT NULL,
      played_at     TEXT    NOT NULL DEFAULT (datetime('now'))
    );

    CREATE INDEX IF NOT EXISTS idx_questions_cat_diff ON questions(category_id, difficulty);
    CREATE INDEX IF NOT EXISTS idx_results_ranking    ON results(category_id, difficulty, score DESC);
    CREATE INDEX IF NOT EXISTS idx_results_user       ON results(user_id);
  `)
}
