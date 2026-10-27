import { useState } from 'react'
import { useNavigate } from 'react-router'
import { useCategories } from '../../../application/catalog/useCategories'
import { DIFFICULTIES } from '../../../constants/difficulties'
import './catalog.css'

const ICONS = { Musique: '🎵', 'Culture générale': '🧠', Cinéma: '🎬', Voyage: '✈️' }

// Infos affichées sous chaque difficulté (règles de la feature game)
const DIFFICULTY_INFO = {
  facile: '20 s par question · points ×1',
  moyen: '15 s par question · points ×2',
  difficile: '10 s par question · points ×3',
}

export function CatalogPage() {
  const { categories, loading, error } = useCategories()
  const [category, setCategory] = useState(null)
  const navigate = useNavigate()

  const play = (difficulty) => {
    const params = new URLSearchParams({ category: category.id, difficulty })
    navigate(`/play?${params}`)
  }

  if (loading) return <p className="catalog">Chargement…</p>
  if (error) return <p className="catalog">Erreur : {error}</p>

  // Étape 1 : choix de la catégorie
  if (!category) {
    return (
      <main className="catalog">
        <h1>Choisis une catégorie</h1>
        <ul className="catalog-grid">
          {categories.map((c) => (
            <li key={c.id}>
              <button className="catalog-card" onClick={() => setCategory(c)}>
                <span className="catalog-icon" aria-hidden="true">{ICONS[c.name] ?? '❓'}</span>
                {c.name}
              </button>
            </li>
          ))}
        </ul>
      </main>
    )
  }

  // Étape 2 : choix de la difficulté
  return (
    <main className="catalog">
      <h1>{category.name}</h1>
      <p>Choisis ta difficulté</p>
      <ul className="catalog-list">
        {DIFFICULTIES.map((d) => (
          <li key={d}>
            <button className={`catalog-card difficulty-${d}`} onClick={() => play(d)}>
              <strong>{d}</strong>
              <small>{DIFFICULTY_INFO[d]}</small>
            </button>
          </li>
        ))}
      </ul>
      <button className="catalog-back" onClick={() => setCategory(null)}>
        ← Changer de catégorie
      </button>
    </main>
  )
}
