import { db } from './connection.js'

export function migrate() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS questions (
      id       INTEGER PRIMARY KEY AUTOINCREMENT,
      question TEXT    NOT NULL,
      options  TEXT    NOT NULL, -- tableau JSON
      answer   INTEGER NOT NULL
    );
  `)
}
