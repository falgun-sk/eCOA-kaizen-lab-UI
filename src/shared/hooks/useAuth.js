import { useState, useEffect } from 'react'

/**
 * useAuth Hook
 *
 * Provides access to the currently authenticated user
 * Reads user data from localStorage
 *
 * @returns {Object} { user, loading }
 */
const useAuth = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user')
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser)
        setUser(parsedUser)
      }
    } catch (error) {
      console.error('Error parsing user from localStorage:', error)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  return { user, loading }
}

export default useAuth
