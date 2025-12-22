import { usePermissionContext } from '../contexts/PermissionContext'
import type { User } from '../../types'

interface UsePermissionReturn {
  hasRole: (requiredRole: string) => boolean
  hasAnyRole: (roles: string[]) => boolean
  user: User | null
  loading: boolean
}

const usePermission = (): UsePermissionReturn => {
  const { user, loading, hasRole: contextHasRole, hasAnyRole: contextHasAnyRole } = usePermissionContext()

  // Check for single role (supports both 'role' and 'roles' fields)
  const hasRole = (requiredRole: string): boolean => {
    if (!user) return false
    // Check single role field first
    if (user.role && user.role === requiredRole) return true
    // Then check roles array
    return contextHasRole(requiredRole)
  }

  // Check if user has any of the provided roles
  const hasAnyRole = (roles: string[]): boolean => {
    if (!user) return false
    // Check single role field first
    if (user.role && roles.includes(user.role)) return true
    // Then check roles array
    return contextHasAnyRole(roles)
  }

  return {
    hasRole,
    hasAnyRole,
    user,
    loading
  }
}

export default usePermission
