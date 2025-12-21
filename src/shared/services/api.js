// API Base URL from environment variables
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

/**
 * Generic API request function
 * Handles authentication, headers, and error handling
 */
async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem('authToken')

  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config)

    // Handle different response types
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'An error occurred' }))
      throw new Error(error.message || `HTTP ${response.status}: ${response.statusText}`)
    }

    // Handle no-content responses
    if (response.status === 204) {
      return null
    }

    return await response.json()
  } catch (error) {
    console.error('API Request Error:', error)
    throw error
  }
}

// ============================================
// Authentication API
// ============================================
export const authAPI = {
  /**
   * Login user
   * @param {Object} credentials - { username, password }
   * @returns {Promise<Object>} { token, user }
   */
  login: (credentials) =>
    apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    }),

  /**
   * Send password reset email
   * @param {string} email - User email
   * @returns {Promise<Object>} Success message
   */
  forgotPassword: (email) =>
    apiRequest('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email })
    }),

  /**
   * Get current user info
   * @returns {Promise<Object>} User object
   */
  getCurrentUser: () =>
    apiRequest('/auth/me'),

  /**
   * Logout user
   * @returns {Promise<Object>} Success message
   */
  logout: () =>
    apiRequest('/auth/logout', { method: 'POST' })
}

// ============================================
// Studies API
// ============================================
export const studiesAPI = {
  /**
   * Get all studies
   * @param {Object} params - { search, status }
   * @returns {Promise<Array>} List of studies
   */
  getAll: (params = {}) => {
    const query = new URLSearchParams(
      Object.entries(params).filter(([_, value]) => value !== undefined && value !== '')
    ).toString()
    return apiRequest(`/studies${query ? `?${query}` : ''}`)
  },

  /**
   * Get study by ID
   * @param {number} id - Study ID
   * @returns {Promise<Object>} Study object
   */
  getById: (id) =>
    apiRequest(`/studies/${id}`),

  /**
   * Create new study
   * @param {Object} data - Study data
   * @returns {Promise<Object>} Created study
   */
  create: (data) =>
    apiRequest('/studies', {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  /**
   * Update study
   * @param {number} id - Study ID
   * @param {Object} data - Updated study data
   * @returns {Promise<Object>} Updated study
   */
  update: (id, data) =>
    apiRequest(`/studies/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),

  /**
   * Delete study
   * @param {number} id - Study ID
   * @returns {Promise<Object>} Success message
   */
  delete: (id) =>
    apiRequest(`/studies/${id}`, { method: 'DELETE' })
}

// ============================================
// Users API
// ============================================
export const usersAPI = {
  /**
   * Get all users with optional filters
   * @param {Object} params - { search, role, status }
   * @returns {Promise<Array>} List of users
   */
  getAll: (params = {}) => {
    const query = new URLSearchParams(
      Object.entries(params).filter(([_, value]) => value && value !== 'all')
    ).toString()
    return apiRequest(`/users${query ? `?${query}` : ''}`)
  },

  /**
   * Get user by ID
   * @param {number} id - User ID
   * @returns {Promise<Object>} User object
   */
  getById: (id) =>
    apiRequest(`/users/${id}`),

  /**
   * Create new user
   * @param {Object} data - { name, email, role, status }
   * @returns {Promise<Object>} Created user
   */
  create: (data) =>
    apiRequest('/users', {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  /**
   * Update user
   * @param {number} id - User ID
   * @param {Object} data - { name, email, role, status }
   * @returns {Promise<Object>} Updated user
   */
  update: (id, data) =>
    apiRequest(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),

  /**
   * Delete user
   * @param {number} id - User ID
   * @returns {Promise<Object>} Success message
   */
  delete: (id) =>
    apiRequest(`/users/${id}`, { method: 'DELETE' }),

  /**
   * Assign role to user
   * @param {number} userId - User ID
   * @param {string} role - Role name
   * @returns {Promise<Object>} Updated user
   */
  assignRole: (userId, role) =>
    apiRequest(`/users/${userId}/role`, {
      method: 'PUT',
      body: JSON.stringify({ role })
    })
}

// ============================================
// Patients API (Future)
// ============================================
export const patientsAPI = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString()
    return apiRequest(`/patients${query ? `?${query}` : ''}`)
  }
}

// ============================================
// Reports API (Future)
// ============================================
export const reportsAPI = {
  getAll: () => apiRequest('/reports')
}

// Export API_BASE_URL for debugging
export { API_BASE_URL }
