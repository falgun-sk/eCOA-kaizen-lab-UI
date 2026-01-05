/**
 * Auth API Service
 * Handles authentication-related API calls
 */

import { apiClient } from './client'
import type {
  User,
  LoginCredentials,
  LoginResponse,
  ForgotPasswordResponse
} from '../../../types'

// Mock data for development (remove when backend is ready)
const MOCK_USER: User = {
  id: '1',
  email: 'admin@kaizen.com',
  name: 'John Admin',
  firstName: 'John',
  lastName: 'Admin',
  roles: ['admin'],
  role: 'admin',
  avatar: null,
}

// Mock users database for credential validation
const MOCK_USERS = [
  { id: 1, username: 'admin', password: 'admin123', name: 'Admin User', email: 'admin@ecoa.com', role: 'admin' },
  { id: 2, username: 'pm_user', password: 'pm1234', name: 'Project Manager', email: 'pm@ecoa.com', role: 'project_manager' },
  { id: 3, username: 'designer_user', password: 'designer123', name: 'Study Designer', email: 'designer@ecoa.com', role: 'study_designer' },
  { id: 4, username: 'reviewer_user', password: 'reviewer123', name: 'Build Reviewer', email: 'reviewer@ecoa.com', role: 'build_reviewer' },
  { id: 5, username: 'uat_user', password: 'uat1234', name: 'UAT Member', email: 'uat@ecoa.com', role: 'uat_member' },
  { id: 6, username: 'site_user', password: 'site1234', name: 'Site Manager', email: 'site@ecoa.com', role: 'site_manager' },
  { id: 7, username: 'data_user', password: 'data1234', name: 'Data Manager', email: 'data@ecoa.com', role: 'data_manager' },
]

const MOCK_DELAY = 500

const mockResponse = <T>(data: T): Promise<T> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), MOCK_DELAY)
  })
}

export const authApi = {
  // Login with email/password
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    // TODO: Replace with actual API call
    // return apiClient.post<LoginResponse>('/auth/login', credentials)

    // Mock implementation - validate credentials
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const foundUser = MOCK_USERS.find(
          u => u.username === credentials.username && u.password === credentials.password
        )

        if (foundUser) {
          const user: User = {
            id: String(foundUser.id),
            email: foundUser.email,
            name: foundUser.name,
            firstName: foundUser.name.split(' ')[0],
            lastName: foundUser.name.split(' ').slice(1).join(' '),
            roles: [foundUser.role],
            role: foundUser.role,
            avatar: null,
          }
          resolve({
            user,
            token: `mock_token_${foundUser.id}_${Date.now()}`,
          })
        } else {
          reject(new Error('Invalid username or password'))
        }
      }, MOCK_DELAY)
    })
  },

  // Login with Microsoft SSO
  async loginWithMicrosoft(): Promise<LoginResponse> {
    // TODO: Replace with actual API call
    // return apiClient.post<LoginResponse>('/auth/microsoft', {})

    // Mock implementation
    return mockResponse<LoginResponse>({
      user: MOCK_USER,
      token: 'mock-jwt-token',
    })
  },

  // Logout
  async logout(): Promise<{ success: boolean }> {
    // TODO: Replace with actual API call
    // return apiClient.post('/auth/logout', {})

    // Mock implementation
    return mockResponse({ success: true })
  },

  // Get current user
  async getCurrentUser(): Promise<User> {
    // TODO: Replace with actual API call
    // return apiClient.get<User>('/auth/me')

    // Mock implementation - read from localStorage if available
    const token = localStorage.getItem('auth_token')
    if (!token) {
      throw new Error('Not authenticated')
    }

    // Try to get user from localStorage (saved during login)
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser)
        // Convert single role to roles array if needed
        const user: User = {
          id: String(parsedUser.id),
          email: parsedUser.email,
          name: parsedUser.name,
          firstName: parsedUser.name?.split(' ')[0] || '',
          lastName: parsedUser.name?.split(' ').slice(1).join(' ') || '',
          roles: parsedUser.roles || (parsedUser.role ? [parsedUser.role] : []),
          role: parsedUser.role,
          avatar: parsedUser.avatar || null,
        }
        return mockResponse<User>(user)
      } catch {
        // Fall back to mock user
      }
    }

    return mockResponse<User>(MOCK_USER)
  },

  // Refresh token
  async refreshToken(): Promise<{ token: string }> {
    // TODO: Replace with actual API call
    // return apiClient.post('/auth/refresh', {})

    return mockResponse({ token: 'new-mock-jwt-token' })
  },

  // Request password reset
  async forgotPassword(email: string): Promise<ForgotPasswordResponse> {
    // TODO: Replace with actual API call
    // return apiClient.post<ForgotPasswordResponse>('/auth/forgot-password', { email })

    return mockResponse<ForgotPasswordResponse>({
      success: true,
      message: 'Password reset email sent'
    })
  },

  // Reset password with token
  async resetPassword(token: string, newPassword: string): Promise<ForgotPasswordResponse> {
    // TODO: Replace with actual API call
    // return apiClient.post<ForgotPasswordResponse>('/auth/reset-password', { token, newPassword })

    return mockResponse<ForgotPasswordResponse>({
      success: true,
      message: 'Password reset successful'
    })
  },
}
