import { db } from './connection.js'

// À incrémenter à chaque changement de schéma (stocké dans PRAGMA user_version)
const SCHEMA_VERSION = 1

// Schéma complet (contrat feature.md, identique au README)
const SCHEMA = `
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
    options     TEXT    NOT NULL, -- tableau JSON
    answer      INTEGER NOT NULL, -- index de la bonne option
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
`

export function migrate() {
  const version = db.pragma('user_version', { simple: true })
  if (version >= SCHEMA_VERSION) return

  db.transaction(() => {
    // Base créée avant le socle (version 0) : l'ancienne table questions n'a ni
    // catégorie ni difficulté. Elle ne contient que le seed → on la recrée.
    if (version === 0) db.exec('DROP TABLE IF EXISTS questions')

    db.exec(SCHEMA)
    db.pragma(`user_version = ${SCHEMA_VERSION}`)
  })()
}
