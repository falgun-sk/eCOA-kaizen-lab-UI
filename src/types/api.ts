/**
 * API Types
 */

export interface ApiError {
  message: string
  status: number
  data?: unknown
}

export interface ApiResponse<T> {
  data: T
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
}

export interface SuccessResponse {
  success: boolean
  message?: string
}

// Request options
export interface RequestOptions {
  headers?: Record<string, string>
}

// Query params helper
export type QueryParams = Record<string, string | number | boolean | undefined>
