import useAuth from './useAuth'

/**
 * usePermission Hook
 *
 * Provides role-based permission checking utilities
 *
 * @returns {Object} { hasRole, hasAnyRole, user }
 */
const usePermission = () => {
  const { user, loading } = useAuth()

  /**
   * Check if the current user has a specific role
   * @param {string} requiredRole - The role to check for
   * @returns {boolean}
   */
  const hasRole = (requiredRole) => {
    if (!user || !user.role) return false
    return user.role === requiredRole
  }

  /**
   * Check if the current user has any of the specified roles
   * @param {string[]} roles - Array of roles to check
   * @returns {boolean}
   */
  const hasAnyRole = (roles) => {
    if (!user || !user.role) return false
    return roles.includes(user.role)
  }

  return {
    hasRole,
    hasAnyRole,
    user,
    loading
  }
}

export default usePermission
