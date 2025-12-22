/**
 * Utility functions for formatting data
 */

export const formatDate = (
  date: Date | string,
  options: Intl.DateTimeFormatOptions = {}
): string => {
  const defaultOptions: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }
  return new Date(date).toLocaleDateString('en-GB', { ...defaultOptions, ...options })
}

export const formatDateISO = (date: Date | string): string => {
  return new Date(date).toISOString().split('T')[0]
}

export const formatNumber = (num: number): string => {
  return num.toLocaleString()
}

export const truncateText = (text: string, maxLength: number = 50): string => {
  if (text.length <= maxLength) return text
  return `${text.substring(0, maxLength)}...`
}

export const capitalize = (str: string): string => {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

export const camelToTitleCase = (str: string): string => {
  return str
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (s) => s.toUpperCase())
    .trim()
}
