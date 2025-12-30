// Form Builder Utility Functions

/**
 * Validates a field value against component configuration
 * @param {Object} component - The form component
 * @param {any} value - The value to validate
 * @returns {string[]} Array of error messages
 */
export const validateField = (component, value) => {
  const errors = []
  const validation = component.config?.validation || {}

  // Required check
  if (component.config?.required) {
    if (value === null || value === undefined || value === '' || (typeof value === 'string' && value.trim() === '')) {
      errors.push('This field is required')
      return errors
    }
  }

  // Only validate if there's a value
  if (value && value !== '') {
    const valueStr = String(value)

    // Min/Max length for text
    if (validation.minLength && validation.minLength !== '') {
      if (valueStr.length < parseInt(validation.minLength)) {
        errors.push(`Minimum length is ${validation.minLength} characters (current: ${valueStr.length})`)
      }
    }
    if (validation.maxLength && validation.maxLength !== '') {
      if (valueStr.length > parseInt(validation.maxLength)) {
        errors.push(`Maximum length is ${validation.maxLength} characters (current: ${valueStr.length})`)
      }
    }

    // Min/Max for numbers
    if (validation.min && validation.min !== '') {
      const numValue = parseFloat(value)
      const minValue = parseFloat(validation.min)
      if (!isNaN(numValue) && !isNaN(minValue) && numValue < minValue) {
        errors.push(`Minimum value is ${validation.min}`)
      }
    }
    if (validation.max && validation.max !== '') {
      const numValue = parseFloat(value)
      const maxValue = parseFloat(validation.max)
      if (!isNaN(numValue) && !isNaN(maxValue) && numValue > maxValue) {
        errors.push(`Maximum value is ${validation.max}`)
      }
    }

    // Pattern validation
    if (validation.pattern && validation.pattern.trim() !== '') {
      try {
        const regex = new RegExp(validation.pattern)
        if (!regex.test(valueStr)) {
          errors.push(validation.customMessage || 'Invalid format')
        }
      } catch (e) {
        console.error('Invalid regex pattern:', e)
        errors.push('Invalid validation pattern configured')
      }
    }
  }

  return errors
}

/**
 * Get a summary of validation rules for a component
 * @param {Object} component - The form component
 * @returns {string[]} Array of rule descriptions
 */
export const getValidationSummary = (component) => {
  const rules = []
  const validation = component.config?.validation || {}

  if (component.config?.required) {
    rules.push('Required field')
  }
  if (validation.minLength) {
    rules.push(`Min length: ${validation.minLength}`)
  }
  if (validation.maxLength) {
    rules.push(`Max length: ${validation.maxLength}`)
  }
  if (validation.min) {
    rules.push(`Min value: ${validation.min}`)
  }
  if (validation.max) {
    rules.push(`Max value: ${validation.max}`)
  }
  if (validation.pattern) {
    rules.push(`Pattern: ${validation.pattern.substring(0, 20)}${validation.pattern.length > 20 ? '...' : ''}`)
  }

  return rules
}

/**
 * Check if a component has any logic configured
 * @param {Object} component - The form component
 * @returns {boolean}
 */
export const hasLogic = (component) => {
  return component.config?.showHide?.enabled ||
         component.config?.skipLogic?.enabled ||
         component.config?.branching?.enabled ||
         component.config?.validation?.pattern ||
         component.config?.validation?.minLength ||
         component.config?.validation?.maxLength ||
         component.config?.validation?.min ||
         component.config?.validation?.max
}

/**
 * Create a new component with default configuration
 * @param {string} type - Component type
 * @param {number} index - Component index for labeling
 * @returns {Object} New component object
 */
export const createNewComponent = (type, index) => {
  // Generate better labels for different component types
  let label
  switch (type) {
    case 'vas':
      label = `VAS Scale ${index + 1}`
      break
    case 'text':
      label = `Text Field ${index + 1}`
      break
    case 'textarea':
      label = `Text Area ${index + 1}`
      break
    case 'number':
      label = `Number Field ${index + 1}`
      break
    case 'date':
      label = `Date Field ${index + 1}`
      break
    case 'radio':
      label = `Radio Group ${index + 1}`
      break
    case 'checkbox':
      label = `Checkbox ${index + 1}`
      break
    case 'dropdown':
      label = `Dropdown ${index + 1}`
      break
    case 'image':
      label = `Image Capture ${index + 1}`
      break
    default:
      label = `${type} ${index + 1}`
  }

  const baseConfig = {
    id: Date.now(),
    type,
    label,
    config: {
      required: false,
      validation: {
        minLength: '',
        maxLength: '',
        min: '',
        max: '',
        pattern: '',
        customMessage: ''
      },
      showHide: {
        enabled: false,
        condition: 'equals',
        targetField: '',
        targetValue: ''
      },
      skipLogic: {
        enabled: false,
        condition: 'equals',
        targetValue: '',
        skipToField: ''
      },
      branching: {
        enabled: false,
        rules: []
      }
    }
  }

  // Add VAS-specific defaults
  if (type === 'vas') {
    baseConfig.config.vasMin = 0
    baseConfig.config.vasMax = 10
    baseConfig.config.vasOrientation = 'vertical'
    baseConfig.config.vasMinLabel = ''
    baseConfig.config.vasMaxLabel = ''
    baseConfig.config.vasInterval = 1
  }

  return baseConfig
}

/**
 * Deep clone an object
 * @param {Object} obj - Object to clone
 * @returns {Object} Cloned object
 */
export const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj))
}

/**
 * Update a nested property in an object by path
 * @param {Object} obj - Object to update
 * @param {string} path - Dot-separated path (e.g., 'validation.minLength')
 * @param {any} value - Value to set
 * @returns {Object} Updated object
 */
export const setNestedValue = (obj, path, value) => {
  const clone = deepClone(obj)
  const pathArray = path.split('.')
  let current = clone

  for (let i = 0; i < pathArray.length - 1; i++) {
    current = current[pathArray[i]]
  }
  current[pathArray[pathArray.length - 1]] = value

  return clone
}
