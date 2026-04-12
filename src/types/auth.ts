/**
 * Authentication Types
 */

// ─── Frontend types (used throughout the app) ───

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
  pages?: string[]
}

export interface LoginCredentials {
  username: string
  password: string
}

export interface LoginResponse {
  user: User
  token: string
  refreshToken: string
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

// ─── Backend API types (match what Spring Boot sends) ───

/** The wrapper every backend endpoint returns */
export interface BackendApiResponse<T> {
  success: boolean
  message: string
  data: T
  error: { code: string; message: string } | null
}

/** What POST /v1/auth/signin returns inside "data" */
export interface BackendSignInResponse {
  accessToken: string
  refreshToken: string
  tokenType: string
  expiresIn: number
  user: BackendUserSummary
}

/** User object as the backend shapes it */
export interface BackendUserSummary {
  userId: number
  firstName: string
  lastName: string
  username: string
  email: string
  roles: string[]
}

/** What GET /v1/auth/me returns inside "data" */
export interface BackendMeResponse {
  id: number
  username: string
  email: string
  firstName: string
  lastName: string
  roles: string[]
  pages: string[]
}

/** What GET /v1/auth/approvals returns inside "data" */
export interface RoleApproval {
  id: number
  username: string
  email: string
  requestedRole: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  createdAt: string
}
