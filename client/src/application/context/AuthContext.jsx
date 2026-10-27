import { useCallback, useEffect, useMemo, useState } from 'react'
import { authApi } from '../../infrastructure/api/authApi'
import { tokenStore } from '../../infrastructure/api/httpClient'
import { AuthContext } from './authState'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  // true tant qu'on vérifie un token déjà stocké
  const [loading, setLoading] = useState(() => Boolean(tokenStore.get()))

  useEffect(() => {
    if (!tokenStore.get()) return
    authApi
      .me()
      .then(setUser)
      .catch(() => tokenStore.clear()) // token expiré ou invalide
      .finally(() => setLoading(false))
  }, [])

  const authenticate = useCallback(async (request) => {
    const { token, user } = await request()
    tokenStore.set(token)
    setUser(user)
    return user
  }, [])

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user),
      login: (credentials) => authenticate(() => authApi.login(credentials)),
      register: (data) => authenticate(() => authApi.register(data)),
      logout: () => {
        tokenStore.clear()
        setUser(null)
      },
    }),
    [user, loading, authenticate],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
