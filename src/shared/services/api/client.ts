/**
 * API Client - Base HTTP client for all API requests
 * Includes automatic token refresh on 401 responses
 */

import type { RequestOptions } from '../../../types'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

export class ApiError extends Error {
  status: number
  data: unknown

  constructor(message: string, status: number, data?: unknown) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.data = data
  }
}

const defaultHeaders: Record<string, string> = {
  'Content-Type': 'application/json',
}

const getAuthHeaders = (): Record<string, string> => {
  const token = localStorage.getItem('auth_token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

// Flag to prevent infinite refresh loops
let isRefreshing = false

/**
 * Attempt to refresh the access token using the stored refresh token.
 * Returns true if refresh succeeded, false otherwise.
 */
const tryRefreshToken = async (): Promise<boolean> => {
  if (isRefreshing) return false

  const refreshToken = localStorage.getItem('refresh_token')
  if (!refreshToken) return false

  isRefreshing = true
  try {
    const response = await fetch(`${API_BASE_URL}/v1/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    })

    if (!response.ok) return false

    const result = await response.json()
    // Backend wraps in { success, data: { accessToken, refreshToken, ... } }
    const data = result.data || result
    if (data.accessToken) {
      localStorage.setItem('auth_token', data.accessToken)
      if (data.refreshToken) {
        localStorage.setItem('refresh_token', data.refreshToken)
      }
      return true
    }
    return false
  } catch {
    return false
  } finally {
    isRefreshing = false
  }
}

/**
 * Redirect to login page and clear all auth data
 */
const redirectToLogin = () => {
  localStorage.removeItem('auth_token')
  localStorage.removeItem('refresh_token')
  localStorage.removeItem('user')
  window.location.href = '/login'
}

const handleResponse = async <T>(response: Response): Promise<T> => {
  const contentType = response.headers.get('content-type')
  const isJson = contentType && contentType.includes('application/json')
  const data = isJson ? await response.json() : await response.text()

  if (!response.ok) {
    // Backend sends { success: false, error: { code, message } }
    const errorMessage = data?.error?.message || data?.message || 'An error occurred'
    throw new ApiError(errorMessage, response.status, data)
  }

  // Unwrap backend's ApiResponse wrapper: { success, message, data: T }
  // If the response has a "success" field and a "data" field, extract .data
  if (isJson && typeof data === 'object' && data !== null && 'success' in data && 'data' in data) {
    return data.data as T
  }

  return data as T
}

/**
 * Make a fetch request. If it gets 401, try refreshing the token and retry once.
 */
const fetchWithRefresh = async (url: string, options: RequestInit): Promise<Response> => {
  let response = await fetch(url, options)

  // If 401 and not already a refresh request, try refreshing the token
  if (response.status === 401 && !url.includes('/v1/auth/refresh') && !url.includes('/v1/auth/signin')) {
    const refreshed = await tryRefreshToken()
    if (refreshed) {
      // Retry the original request with the new token
      const newHeaders = {
        ...Object.fromEntries(new Headers(options.headers).entries()),
        ...getAuthHeaders(),
      }
      response = await fetch(url, { ...options, headers: newHeaders })
    } else {
      // Refresh failed — session is over, redirect to login
      redirectToLogin()
    }
  }

  return response
}

export const apiClient = {
  async get<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const response = await fetchWithRefresh(`${API_BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: {
        ...defaultHeaders,
        ...getAuthHeaders(),
        ...options.headers,
      },
    })
    return handleResponse<T>(response)
  },

  async post<T, B = unknown>(endpoint: string, body: B, options: RequestOptions = {}): Promise<T> {
    const response = await fetchWithRefresh(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        ...defaultHeaders,
        ...getAuthHeaders(),
        ...options.headers,
      },
      body: JSON.stringify(body),
    })
    return handleResponse<T>(response)
  },

  async put<T, B = unknown>(endpoint: string, body: B, options: RequestOptions = {}): Promise<T> {
    const response = await fetchWithRefresh(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: {
        ...defaultHeaders,
        ...getAuthHeaders(),
        ...options.headers,
      },
      body: JSON.stringify(body),
    })
    return handleResponse<T>(response)
  },

  async patch<T, B = unknown>(endpoint: string, body: B, options: RequestOptions = {}): Promise<T> {
    const response = await fetchWithRefresh(`${API_BASE_URL}${endpoint}`, {
      method: 'PATCH',
      headers: {
        ...defaultHeaders,
        ...getAuthHeaders(),
        ...options.headers,
      },
      body: JSON.stringify(body),
    })
    return handleResponse<T>(response)
  },

  async delete<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const response = await fetchWithRefresh(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: {
        ...defaultHeaders,
        ...getAuthHeaders(),
        ...options.headers,
      },
    })
    return handleResponse<T>(response)
  },
}

export { API_BASE_URL }
