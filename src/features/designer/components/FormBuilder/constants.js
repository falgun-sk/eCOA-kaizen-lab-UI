// Form Builder Constants

export const COMPONENT_TYPES = [
  { id: 'number', name: 'Number Input', icon: '🔢', description: 'Numeric values only' },
  { id: 'date', name: 'Date Picker', icon: '📅', description: 'Date selection' },
  { id: 'radio', name: 'Radio Button', icon: '🔘', description: 'Single choice from options' },
  { id: 'checkbox', name: 'Checkbox', icon: '☑️', description: 'Yes/No or multiple selections' },
  { id: 'dropdown', name: 'Dropdown', icon: '▼', description: 'Select from dropdown list' },
  { id: 'vas', name: 'VAS Scale', icon: '━━', description: 'Continuous slider (0-10)' },
  { id: 'image', name: 'Image Capture', icon: '📷', description: 'Capture or upload images' },
  { id: 'text', name: 'Single Line Text', icon: '📝', description: 'For names, IDs, short answers' },
  { id: 'textarea', name: 'Multi Line Text', icon: '📄', description: 'For descriptions, comments' }
]

export const DEFAULT_COMPONENT_CONFIG = {
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

export const CONDITION_OPTIONS = [
  { value: 'equals', label: 'Equals' },
  { value: 'notEquals', label: 'Not Equals' },
  { value: 'contains', label: 'Contains' },
  { value: 'greaterThan', label: 'Greater Than' },
  { value: 'lessThan', label: 'Less Than' }
]

export const TEXT_CONDITION_OPTIONS = [
  { value: 'equals', label: 'Equals' },
  { value: 'notEquals', label: 'Not Equals' },
  { value: 'contains', label: 'Contains' },
  { value: 'notContains', label: 'Not Contains' },
  { value: 'startsWith', label: 'Starts With' },
  { value: 'endsWith', label: 'Ends With' }
]

export const NUMBER_CONDITION_OPTIONS = [
  { value: 'equals', label: 'Equals' },
  { value: 'notEquals', label: 'Not Equals' },
  { value: 'greaterThan', label: 'Greater Than' },
  { value: 'greaterThanOrEqual', label: 'Greater Than or Equal' },
  { value: 'lessThan', label: 'Less Than' },
  { value: 'lessThanOrEqual', label: 'Less Than or Equal' },
  { value: 'between', label: 'Between' },
  { value: 'notBetween', label: 'Not Between' }
]

export const BRANCHING_ACTIONS = [
  { value: 'skipToField', label: 'Skip to field' },
  { value: 'showField', label: 'Show field' },
  { value: 'hideField', label: 'Hide field' },
  { value: 'endForm', label: 'End form' }
]
