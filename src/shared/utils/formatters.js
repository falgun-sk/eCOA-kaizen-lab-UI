/**
 * Utility functions for formatting data
 */

/**
 * Format a date to locale string
 * @param {Date|string} date - Date to format
 * @param {Object} options - Intl.DateTimeFormat options
 * @returns {string} Formatted date string
 */
export const formatDate = (date, options = {}) => {
  const defaultOptions = {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }
  return new Date(date).toLocaleDateString('en-GB', { ...defaultOptions, ...options })
}

/**
 * Format a date to ISO string (YYYY-MM-DD)
 * @param {Date|string} date - Date to format
 * @returns {string} ISO date string
 */
export const formatDateISO = (date) => {
  return new Date(date).toISOString().split('T')[0]
}

/**
 * Format a number with thousand separators
 * @param {number} num - Number to format
 * @returns {string} Formatted number string
 */
export const formatNumber = (num) => {
  return num.toLocaleString()
}

/**
 * Truncate text to a specified length
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
export const truncateText = (text, maxLength = 50) => {
  if (text.length <= maxLength) return text
  return `${text.substring(0, maxLength)}...`
}

/**
 * Capitalize first letter of a string
 * @param {string} str - String to capitalize
 * @returns {string} Capitalized string
 */
export const capitalize = (str) => {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

/**
 * Convert camelCase to Title Case
 * @param {string} str - camelCase string
 * @returns {string} Title Case string
 */
export const camelToTitleCase = (str) => {
  return str
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (s) => s.toUpperCase())
    .trim()
}
