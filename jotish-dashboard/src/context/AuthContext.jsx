import { createContext, useContext, useState } from 'react'

const STORAGE_KEY = 'jotish_session'
const VALID_USER = 'testuser'
const VALID_PASS = 'Test123'

const AuthContext = createContext(null)

function readSession() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) return JSON.parse(saved)
  } catch {
    // localStorage unavailable or data corrupt
  }
  return { isLoggedIn: false, user: null }
}

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(readSession)

  function login(username, password) {
    if (username !== VALID_USER || password !== VALID_PASS) {
      return 'Invalid username or password.'
    }
    const next = { isLoggedIn: true, user: username }
    setAuth(next)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    } catch {
      // localStorage unavailable
    }
  }

  function logout() {
    setAuth({ isLoggedIn: false, user: null })
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {
      // localStorage unavailable
    }
  }

  return (
    <AuthContext.Provider value={{ ...auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider. Wrap your component tree with <AuthProvider>.')
  return ctx
}
