import { createContext, useContext, useState, useEffect } from 'react'

/**
 * Permission Context
 *
 * Provides global access to user authentication and permissions
 */
const PermissionContext = createContext(null)

/**
 * PermissionProvider Component
 *
 * Wraps the app to provide authentication context
 */
export const PermissionProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Load user from localStorage on mount
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user')
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser)
        setUser(parsedUser)
      }
    } catch (error) {
      console.error('Error loading user from localStorage:', error)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  // Sync user state with localStorage changes (across tabs)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'user') {
        try {
          const newUser = e.newValue ? JSON.parse(e.newValue) : null
          setUser(newUser)
        } catch (error) {
          console.error('Error parsing user from storage event:', error)
        }
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  /**
   * Update the current user
   * @param {Object} newUser - New user object
   */
  const updateUser = (newUser) => {
    setUser(newUser)
    if (newUser) {
      localStorage.setItem('user', JSON.stringify(newUser))
    } else {
      localStorage.removeItem('user')
    }
  }

  /**
   * Check if user has a specific role
   * @param {string} role - Role to check
   * @returns {boolean}
   */
  const hasRole = (role) => {
    return user?.role === role
  }

  /**
   * Check if user has any of the specified roles
   * @param {string[]} roles - Array of roles to check
   * @returns {boolean}
   */
  const hasAnyRole = (roles) => {
    return roles.includes(user?.role)
  }

  const value = {
    user,
    loading,
    updateUser,
    hasRole,
    hasAnyRole
  }

  return (
    <PermissionContext.Provider value={value}>
      {children}
    </PermissionContext.Provider>
  )
}

/**
 * usePermissionContext Hook
 *
 * Access the permission context
 * @returns {Object} { user, loading, updateUser, hasRole, hasAnyRole }
 */
export const usePermissionContext = () => {
  const context = useContext(PermissionContext)
  if (!context) {
    throw new Error('usePermissionContext must be used within a PermissionProvider')
  }
  return context
}

export default PermissionContext
