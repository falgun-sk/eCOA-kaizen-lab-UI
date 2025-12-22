/**
 * API Client - Base HTTP client for all API requests
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

const handleResponse = async <T>(response: Response): Promise<T> => {
  const contentType = response.headers.get('content-type')
  const isJson = contentType && contentType.includes('application/json')
  const data = isJson ? await response.json() : await response.text()

  if (!response.ok) {
    throw new ApiError(
      data?.message || 'An error occurred',
      response.status,
      data
    )
  }

  return data as T
}

export const apiClient = {
  async get<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
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
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
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
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
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
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
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
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
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
