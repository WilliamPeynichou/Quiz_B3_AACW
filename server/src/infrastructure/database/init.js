import { migrate } from './migrate.js'
import { seed } from './seed.js'

export function initDatabase() {
  migrate()
  seed()
}
