/**
 * Auth API Service
 * Handles authentication-related API calls to the Spring Boot backend
 */

import { apiClient } from './client'
import type {
  User,
  LoginCredentials,
  LoginResponse,
  ForgotPasswordResponse,
  BackendSignInResponse,
  BackendMeResponse,
  BackendUserSummary,
} from '../../../types'

/**
 * Maps the backend's UserSummary + tokens into the shape our frontend expects.
 *
 * Backend sends:  { accessToken, refreshToken, user: { userId, firstName, lastName, ... } }
 * Frontend needs: { token, refreshToken, user: { id, name, firstName, lastName, ... } }
 */
const mapSignInToLoginResponse = (backend: BackendSignInResponse): LoginResponse => ({
  token: backend.accessToken,
  refreshToken: backend.refreshToken,
  user: {
    id: String(backend.user.userId),
    email: backend.user.email,
    name: `${backend.user.firstName} ${backend.user.lastName}`.trim(),
    firstName: backend.user.firstName,
    lastName: backend.user.lastName,
    roles: backend.user.roles.map(r => r.toLowerCase()),
    role: backend.user.roles[0]?.toLowerCase(),
    avatar: null,
  },
})

/**
 * Maps the backend's MeResponse into the frontend's User type.
 *
 * Backend sends:  { id, username, email, firstName, lastName, roles, pages }
 * Frontend needs: { id, name, email, firstName, lastName, roles, role, pages }
 */
const mapMeToUser = (backend: BackendMeResponse): User => ({
  id: String(backend.id),
  email: backend.email,
  name: `${backend.firstName} ${backend.lastName}`.trim(),
  firstName: backend.firstName,
  lastName: backend.lastName,
  roles: backend.roles.map(r => r.toLowerCase()),
  role: backend.roles[0]?.toLowerCase(),
  avatar: null,
  pages: backend.pages,
})

export const authApi = {
  /**
   * Login with email + password
   * Endpoint: POST /v1/auth/signin
   */
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const backend = await apiClient.post<BackendSignInResponse>('/v1/auth/signin', credentials)
    return mapSignInToLoginResponse(backend)
  },

  /**
   * Get current user's profile (requires valid token in Authorization header)
   * Endpoint: GET /v1/auth/me
   */
  async getCurrentUser(): Promise<User> {
    const backend = await apiClient.get<BackendMeResponse>('/v1/auth/me')
    return mapMeToUser(backend)
  },

  /**
   * Logout — invalidates the refresh token on the server
   * Endpoint: POST /v1/auth/logout
   */
  async logout(): Promise<{ success: boolean }> {
    const refreshToken = localStorage.getItem('refresh_token')
    if (refreshToken) {
      await apiClient.post('/v1/auth/logout', { refreshToken })
    }
    return { success: true }
  },

  /**
   * Refresh the access token using a stored refresh token
   * Endpoint: POST /v1/auth/refresh
   */
  async refreshToken(): Promise<LoginResponse> {
    const refreshToken = localStorage.getItem('refresh_token')
    if (!refreshToken) {
      throw new Error('No refresh token available')
    }
    const backend = await apiClient.post<BackendSignInResponse>('/v1/auth/refresh', { refreshToken })
    return mapSignInToLoginResponse(backend)
  },

  /**
   * Request password reset (not yet implemented in backend)
   */
  async forgotPassword(email: string): Promise<ForgotPasswordResponse> {
    return apiClient.post<ForgotPasswordResponse>('/v1/auth/forgot-password', { email })
  },

  /**
   * Reset password with token (not yet implemented in backend)
   */
  async resetPassword(token: string, newPassword: string): Promise<ForgotPasswordResponse> {
    return apiClient.post<ForgotPasswordResponse>('/v1/auth/reset-password', { token, newPassword })
  },

  /**
   * Get all users (SUPER_ADMIN only)
   * Endpoint: GET /v1/auth/users
   */
  async getAllUsers(): Promise<User[]> {
    const backendUsers = await apiClient.get<BackendUserSummary[]>('/v1/auth/users')
    return backendUsers.map(u => ({
      id: String(u.userId),
      email: u.email,
      name: `${u.firstName} ${u.lastName}`.trim(),
      firstName: u.firstName,
      lastName: u.lastName,
      roles: u.roles.map(r => r.toLowerCase()),
      role: u.roles[0]?.toLowerCase(),
      avatar: null,
      status: 'active' as const,
    }))
  },

  /**
   * Create a new user (public endpoint)
   * Endpoint: POST /v1/auth/signup
   */
  async createUser(data: {
    firstName: string
    lastName: string
    email: string
    password: string
    role?: string
  }): Promise<{ userId: number; email: string }> {
    return apiClient.post('/v1/auth/signup', {
      firstName: data.firstName,
      lastName: data.lastName,
      username: data.email,
      email: data.email,
      password: data.password,
      role: data.role,
    })
  },

  /**
   * Impersonate another user (SUPER_ADMIN only)
   * Endpoint: POST /v1/auth/impersonate
   */
  async impersonate(targetUsername: string, targetRole?: string): Promise<LoginResponse> {
    const backend = await apiClient.post<BackendSignInResponse>('/v1/auth/impersonate', {
      targetUsername,
      targetRole,
    })
    return mapSignInToLoginResponse(backend)
  },
}
