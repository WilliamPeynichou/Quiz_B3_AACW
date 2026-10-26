const BASE_URL = import.meta.env.VITE_API_URL || '/api'

export async function http(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!res.ok) throw new Error(`Erreur API ${res.status}`)
  return res.json()
}
