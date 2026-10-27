// Mélange de Fisher-Yates : renvoie une copie, chaque ordre a la même probabilité.
// `random` est injectable pour rendre les tests déterministes.
export function shuffle(items, random = Math.random) {
  const copy = [...items]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}
