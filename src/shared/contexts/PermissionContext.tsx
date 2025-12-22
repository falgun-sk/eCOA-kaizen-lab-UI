import { createContext, useContext, ReactNode } from 'react'
import { useCurrentUser, useLogin, useLoginWithMicrosoft, useLogout } from '../hooks/queries'
import type { User, LoginCredentials, LoginResponse } from '../../types'

interface PermissionContextValue {
  user: User | null
  loading: boolean
  login: (credentials: LoginCredentials) => Promise<LoginResponse>
  loginWithMicrosoft: () => Promise<LoginResponse>
  logout: () => Promise<{ success: boolean }>
  refetchUser: () => void
  hasRole: (role: string) => boolean
  hasAnyRole: (roles: string[]) => boolean
  hasAllRoles: (roles: string[]) => boolean
  isAuthenticated: boolean
  isLoggingIn: boolean
  isLoggingOut: boolean
  loginError: Error | null
}

const PermissionContext = createContext<PermissionContextValue | null>(null)

interface PermissionProviderProps {
  children: ReactNode
}

export const PermissionProvider = ({ children }: PermissionProviderProps) => {
  const {
    data: user,
    isLoading: loading,
    refetch: refetchUser
  } = useCurrentUser({
    retry: false,
    enabled: !!localStorage.getItem('auth_token'),
  })

  const loginMutation = useLogin()
  const microsoftLoginMutation = useLoginWithMicrosoft()
  const logoutMutation = useLogout()

  const login = async (credentials: LoginCredentials): Promise<LoginResponse> => {
    return loginMutation.mutateAsync(credentials)
  }

  const loginWithMicrosoft = async (): Promise<LoginResponse> => {
    return microsoftLoginMutation.mutateAsync()
  }

  const logout = async (): Promise<{ success: boolean }> => {
    return logoutMutation.mutateAsync()
  }

  const hasRole = (role: string): boolean => {
    if (!user?.roles) return false
    return user.roles.includes(role)
  }

  const hasAnyRole = (roles: string[]): boolean => {
    if (!user?.roles) return false
    return roles.some(role => user.roles.includes(role))
  }

  const hasAllRoles = (roles: string[]): boolean => {
    if (!user?.roles) return false
    return roles.every(role => user.roles.includes(role))
  }

  const value: PermissionContextValue = {
    user: user || null,
    loading,
    login,
    loginWithMicrosoft,
    logout,
    refetchUser,
    hasRole,
    hasAnyRole,
    hasAllRoles,
    isAuthenticated: !!user,
    isLoggingIn: loginMutation.isPending || microsoftLoginMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
    loginError: loginMutation.error || microsoftLoginMutation.error,
  }

  return (
    <PermissionContext.Provider value={value}>
      {children}
    </PermissionContext.Provider>
  )
}

export const usePermissionContext = (): PermissionContextValue => {
  const context = useContext(PermissionContext)
  if (!context) {
    throw new Error('usePermissionContext must be used within a PermissionProvider')
  }
  return context
}

export default PermissionContext
