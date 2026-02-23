import React, { createContext, useContext, useState, useEffect } from 'react'

const USERS_KEY = 'syllabus_users'
const SESSION_KEY = 'syllabus_session'
const ASSIGNMENTS_KEY = 'syllabus_assignments'

const AuthContext = createContext(null)

function loadUsers() {
  try {
    const raw = localStorage.getItem(USERS_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

function loadSession() {
  return localStorage.getItem(SESSION_KEY)
}

function saveSession(email) {
  if (email) localStorage.setItem(SESSION_KEY, email)
  else localStorage.removeItem(SESSION_KEY)
}

export function loadAssignmentsForUser(email) {
  try {
    const raw = localStorage.getItem(`${ASSIGNMENTS_KEY}_${email}`)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function saveAssignmentsForUser(email, assignments) {
  localStorage.setItem(`${ASSIGNMENTS_KEY}_${email}`, JSON.stringify(assignments))
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const email = loadSession()
    if (email) {
      const users = loadUsers()
      if (users[email]) setUser({ email })
    }
    setLoading(false)
  }, [])

  function login(email, password) {
    const trimmed = email.trim().toLowerCase()
    const users = loadUsers()
    const stored = users[trimmed]
    if (!stored) return { ok: false, error: 'No account found with this email.' }
    if (stored !== password) return { ok: false, error: 'Incorrect password.' }
    saveSession(trimmed)
    setUser({ email: trimmed })
    return { ok: true }
  }

  function createAccount(email, password) {
    const trimmed = email.trim().toLowerCase()
    if (!trimmed) return { ok: false, error: 'Email is required.' }
    if (!password || password.length < 6)
      return { ok: false, error: 'Password must be at least 6 characters.' }
    const users = loadUsers()
    if (users[trimmed]) return { ok: false, error: 'An account with this email already exists.' }
    users[trimmed] = password
    saveUsers(users)
    saveSession(trimmed)
    setUser({ email: trimmed })
    return { ok: true }
  }

  function logout() {
    saveSession(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, createAccount, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
