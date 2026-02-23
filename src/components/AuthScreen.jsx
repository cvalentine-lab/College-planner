import React, { useState } from 'react'
import styles from './AuthScreen.module.css'

export default function AuthScreen({ mode, onSwitchMode, onSuccess, onBack }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')

  const isCreate = mode === 'create'

  function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (isCreate && password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    const result = isCreate
      ? onSuccess.createAccount(email, password)
      : onSuccess.login(email, password)
    if (result.ok) return
    setError(result.error || 'Something went wrong.')
  }

  return (
    <div className={styles.wrapper}>
      {onBack && (
        <button
          type="button"
          className={styles.backBtn}
          onClick={onBack}
        >
          ← Back
        </button>
      )}
      <div className={styles.card}>
        <h1 className={styles.title}>
          {isCreate ? 'Create Account' : 'Sign In'}
        </h1>
        <p className={styles.subtitle}>
          {isCreate
            ? 'Create an account to start planning your semester.'
            : 'Sign in to access your calendar.'}
        </p>
        <form onSubmit={handleSubmit} className={styles.form}>
          {error && <div className={styles.error}>{error}</div>}
          <label htmlFor="auth-email" className={styles.label}>
            Email
          </label>
          <input
            id="auth-email"
            type="email"
            className={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            autoComplete="email"
          />
          <label htmlFor="auth-password" className={styles.label}>
            Password
          </label>
          <input
            id="auth-password"
            type="password"
            className={styles.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={isCreate ? 'At least 6 characters' : '••••••••'}
            required
            minLength={isCreate ? 6 : undefined}
            autoComplete={isCreate ? 'new-password' : 'current-password'}
          />
          {isCreate && (
            <>
              <label htmlFor="auth-confirm" className={styles.label}>
                Confirm Password
              </label>
              <input
                id="auth-confirm"
                type="password"
                className={styles.input}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="new-password"
              />
            </>
          )}
          <button type="submit" className={styles.submitBtn}>
            {isCreate ? 'Create Account' : 'Sign In'}
          </button>
        </form>
        <button
          type="button"
          className={styles.switchBtn}
          onClick={onSwitchMode}
        >
          {isCreate
            ? 'Already have an account? Sign in'
            : "Don't have an account? Create one"}
        </button>
      </div>
    </div>
  )
}
