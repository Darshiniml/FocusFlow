import { useEffect, useState } from 'react'

// A drop-in replacement for useState that persists to localStorage under `key`.
// Falls back silently to in-memory state if localStorage is unavailable
// (private browsing, quota exceeded, etc.) so the app never crashes over it.
export const usePersistedState = (key, initialValue) => {
  const [state, setState] = useState(() => {
    if (typeof window === 'undefined') return initialValue
    try {
      const stored = window.localStorage.getItem(key)
      return stored !== null ? JSON.parse(stored) : initialValue
    } catch {
      return initialValue
    }
  })

  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      window.localStorage.setItem(key, JSON.stringify(state))
    } catch {
      // Ignore storage errors - the app still works, it just won't persist.
    }
  }, [key, state])

  return [state, setState]
}
