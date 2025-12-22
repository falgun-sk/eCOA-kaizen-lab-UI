import { useState, useEffect } from 'react'

interface StoredUser {
  id: string
  name: string
  email: string
  role?: string
  roles?: string[]
}

interface UseAuthReturn {
  user: StoredUser | null
  loading: boolean
}

const useAuth = (): UseAuthReturn => {
  const [user, setUser] = useState<StoredUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user')
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser) as StoredUser
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
