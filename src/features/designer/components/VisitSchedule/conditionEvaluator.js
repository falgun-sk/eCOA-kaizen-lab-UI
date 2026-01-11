/**
 * Condition Evaluator Utility
 *
 * Evaluates visit conditions based on form field values
 */

/**
 * Evaluates a single condition
 *
 * @param {Object} condition - The condition object
 * @param {string|number} fieldValue - The actual value from the form field
 * @returns {boolean} - Whether the condition is met
 */
export const evaluateCondition = (condition, fieldValue) => {
  if (!condition || fieldValue === null || fieldValue === undefined) {
    return false
  }

  const { operator, value, valueMax } = condition

  // Convert values to numbers for numeric comparisons
  const numericFieldValue = parseFloat(fieldValue)
  const numericValue = parseFloat(value)
  const numericValueMax = parseFloat(valueMax)

  // Handle different operators
  switch (operator) {
    case '>':
      return numericFieldValue > numericValue

    case '>=':
      return numericFieldValue >= numericValue

    case '<':
      return numericFieldValue < numericValue

    case '<=':
      return numericFieldValue <= numericValue

    case '==':
      // Try numeric comparison first, fall back to string comparison
      if (!isNaN(numericFieldValue) && !isNaN(numericValue)) {
        return numericFieldValue === numericValue
      }
      return String(fieldValue) === String(value)

    case '!=':
      // Try numeric comparison first, fall back to string comparison
      if (!isNaN(numericFieldValue) && !isNaN(numericValue)) {
        return numericFieldValue !== numericValue
      }
      return String(fieldValue) !== String(value)

    case 'BETWEEN':
      if (isNaN(numericFieldValue) || isNaN(numericValue) || isNaN(numericValueMax)) {
        return false
      }
      // Inclusive range check
      return numericFieldValue >= numericValue && numericFieldValue <= numericValueMax

    default:
      console.warn(`Unknown operator: ${operator}`)
      return false
  }
}

/**
 * Evaluates multiple conditions with logic operators (AND/OR)
 * Respects operator precedence: AND is evaluated before OR
 *
 * @param {Array} conditions - Array of condition objects
 * @param {Object} formData - Object containing form field values { visitId: { formId: { fieldId: value } } }
 * @returns {boolean} - Whether all conditions are met
 */
export const evaluateConditions = (conditions, formData) => {
  if (!conditions || conditions.length === 0) {
    return true // No conditions means visit should occur
  }

  // Evaluate each condition to get boolean results
  const evaluatedConditions = conditions.map(condition => {
    const { sourceVisit, sourceForm, sourceField, logicOperator } = condition
    const fieldValue = formData?.[sourceVisit]?.[sourceForm]?.[sourceField]
    return {
      result: evaluateCondition(condition, fieldValue),
      logicOperator: logicOperator || (condition === conditions[0] ? null : 'AND')
    }
  })

  // Handle operator precedence: AND before OR
  // Step 1: Group conditions by OR operators, evaluating AND groups first
  const orGroups = []
  let currentAndGroup = []

  for (let i = 0; i < evaluatedConditions.length; i++) {
    const { result, logicOperator } = evaluatedConditions[i]

    currentAndGroup.push(result)

    // If next operator is OR or this is the last condition, finalize current AND group
    const nextOperator = i < evaluatedConditions.length - 1 ? evaluatedConditions[i + 1].logicOperator : null
    if (nextOperator === 'OR' || i === evaluatedConditions.length - 1) {
      // Evaluate AND group: all conditions must be true
      const andResult = currentAndGroup.every(r => r)
      orGroups.push(andResult)
      currentAndGroup = []
    }
  }

  // Step 2: Evaluate OR groups: at least one group must be true
  return orGroups.some(r => r)
}

/**
 * Validates condition configuration
 *
 * @param {Object} condition - The condition object to validate
 * @returns {Object} - { valid: boolean, errors: string[] }
 */
export const validateCondition = (condition) => {
  const errors = []

  if (!condition.sourceVisit) {
    errors.push('Source visit is required')
  }

  if (!condition.sourceForm) {
    errors.push('Source form is required')
  }

  if (!condition.sourceField) {
    errors.push('Source field is required')
  }

  if (!condition.operator) {
    errors.push('Operator is required')
  }

  if (!condition.value && condition.value !== 0) {
    errors.push('Value is required')
  }

  if (condition.operator === 'BETWEEN') {
    if (!condition.valueMax && condition.valueMax !== 0) {
      errors.push('Max value is required for BETWEEN operator')
    }

    if (condition.value && condition.valueMax) {
      const minValue = parseFloat(condition.value)
      const maxValue = parseFloat(condition.valueMax)

      if (!isNaN(minValue) && !isNaN(maxValue) && minValue >= maxValue) {
        errors.push('Min value must be less than max value for BETWEEN operator')
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors
  }
}

/**
 * Gets a human-readable description of a condition
 *
 * @param {Object} condition - The condition object
 * @param {Array} visits - Array of visit objects
 * @param {Array} forms - Array of form objects
 * @returns {string} - Human-readable condition description
 */
export const getConditionDescription = (condition, visits, forms) => {
  const visit = visits?.find(v => v.id === condition.sourceVisit)
  const form = forms?.find(f => f.id === condition.sourceForm)

  const visitName = visit?.name || 'Unknown Visit'
  const formName = form?.name || 'Unknown Form'

  // Get field name from form components
  let fieldName = 'Unknown Field'
  if (form) {
    const field = (form.components || form.fields || []).find(f => f.id === condition.sourceField)
    fieldName = field?.label || field?.text || field?.placeholder || `Field ${condition.sourceField}`
  }

  const operatorText = {
    '>': 'is greater than',
    '>=': 'is greater than or equal to',
    '<': 'is less than',
    '<=': 'is less than or equal to',
    '==': 'equals',
    '!=': 'does not equal',
    'BETWEEN': 'is between'
  }[condition.operator] || condition.operator

  if (condition.operator === 'BETWEEN') {
    return `${visitName} → ${formName} → ${fieldName} ${operatorText} ${condition.value} and ${condition.valueMax}`
  }

  return `${visitName} → ${formName} → ${fieldName} ${operatorText} ${condition.value}`
}

export default {
  evaluateCondition,
  evaluateConditions,
  validateCondition,
  getConditionDescription
}
