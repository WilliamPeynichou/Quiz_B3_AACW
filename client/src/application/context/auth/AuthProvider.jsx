import { useCallback, useEffect, useMemo, useState } from 'react'
import { AuthContext } from './AuthContext'
import { authApi } from '../../../infrastructure/api/auth/authApi'

const TOKEN_KEY = 'quiz_auth_token'

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => sessionStorage.getItem(TOKEN_KEY))
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(Boolean(token))

  useEffect(() => {
    if (!token) return
    let active = true
    authApi.me()
      .then((profile) => {
        if (active) setUser(profile)
      })
      .catch(() => {
        if (active) {
          sessionStorage.removeItem(TOKEN_KEY)
          setToken(null)
          setUser(null)
        }
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => { active = false }
  }, [token])

  const acceptSession = useCallback(({ token: nextToken, user: nextUser }) => {
    sessionStorage.setItem(TOKEN_KEY, nextToken)
    setToken(nextToken)
    setUser(nextUser)
    setLoading(false)
  }, [])

  const logout = useCallback(() => {
    sessionStorage.removeItem(TOKEN_KEY)
    setToken(null)
    setUser(null)
    setLoading(false)
  }, [])

  const value = useMemo(() => ({
    user, token, loading, isAuthenticated: Boolean(user),
    login: acceptSession, logout,
  }), [user, token, loading, acceptSession, logout])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
