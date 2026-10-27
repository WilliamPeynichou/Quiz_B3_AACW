import { useContext } from 'react'
import { AuthContext } from '../context/authState'

// { user, loading, isAuthenticated, login, register, logout }
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth doit être utilisé dans <AuthProvider>')
  return ctx
}
