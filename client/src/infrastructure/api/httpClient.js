const BASE_URL = import.meta.env.VITE_API_URL || '/api'
const TOKEN_KEY = 'quiz_token'

export const tokenStore = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (token) => localStorage.setItem(TOKEN_KEY, token),
  clear: () => localStorage.removeItem(TOKEN_KEY),
}

// Erreur API : garde le statut et le détail par champ ({ email: '...' }) renvoyés par le serveur
export class ApiError extends Error {
  constructor(message, status, details) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.details = details
  }
}

export async function http(path, options = {}) {
  const token = tokenStore.get()
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new ApiError(body.error || `Erreur API ${res.status}`, res.status, body.details)
  }
  return res.json()
}
