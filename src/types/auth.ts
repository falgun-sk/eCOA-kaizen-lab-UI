/**
 * Authentication Types
 */

export interface User {
  id: string
  email: string
  name: string
  firstName?: string
  lastName?: string
  roles: string[]
  role?: string  // Single role for backward compatibility
  avatar?: string | null
  status?: 'active' | 'inactive'
  lastLogin?: string
  createdAt?: string
}

export interface LoginCredentials {
  username: string
  password: string
}

export interface LoginResponse {
  user: User
  token: string
}

export interface AuthState {
  user: User | null
  loading: boolean
  isAuthenticated: boolean
  isLoggingIn: boolean
  isLoggingOut: boolean
  loginError: Error | null
}

export interface ForgotPasswordResponse {
  success: boolean
  message: string
}

export interface ResetPasswordRequest {
  token: string
  newPassword: string
}
