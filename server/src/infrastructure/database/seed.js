import { db } from './connection.js'
import { seedCatalog } from './seeds/catalog.js'
import { seedRanking } from './seeds/ranking.js'

export function seed() {
  seedCatalog(db)
  seedRanking(db)
}
