const BASE_URL = import.meta.env.VITE_API_URL || '/api'
const TOKEN_KEY = 'quiz_auth_token'

export async function http(path, options = {}) {
  const token = sessionStorage.getItem(TOKEN_KEY)
  const headers = new Headers(options.headers)
  if (!headers.has('Content-Type') && options.body !== undefined) {
    headers.set('Content-Type', 'application/json')
  }
  if (token) headers.set('Authorization', `Bearer ${token}`)

  let res
  try {
    res = await fetch(`${BASE_URL}${path}`, { ...options, headers })
  } catch {
    throw new Error('Impossible de joindre le serveur. Vérifie que l’API fonctionne.')
  }

  const data = await res.json().catch(() => null)
  if (!res.ok) {
    const error = new Error(data?.error || `Erreur API ${res.status}`)
    error.status = res.status
    error.details = data?.details || null
    throw error
  }
  return data
}
