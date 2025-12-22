import { getValidationSummary } from '../utils'

const ValidationTab = ({ component, onUpdateConfig }) => {
  const validationRules = getValidationSummary(component)

  return (
    <div className="space-y-4">
      {/* Active Rules Summary */}
      {validationRules.length > 0 && (
        <ValidationSummary rules={validationRules} />
      )}

      <div>
        <h4 className="text-xs font-semibold text-gray-900 mb-3">Validation Rules</h4>

        {/* Text validation */}
        {(component.type === 'text' || component.type === 'textarea') && (
          <TextValidation component={component} onUpdateConfig={onUpdateConfig} />
        )}

        {/* Number validation */}
        {component.type === 'number' && (
          <NumberValidation component={component} onUpdateConfig={onUpdateConfig} />
        )}

        {/* Comparison Rules */}
        {(component.type === 'text' || component.type === 'textarea' || component.type === 'number') && (
          <ComparisonRules component={component} onUpdateConfig={onUpdateConfig} />
        )}

        {/* Custom Error Message */}
        <div className="mt-4">
          <label className="block text-xs font-medium text-gray-700 mb-1">Custom Error Message</label>
          <input
            type="text"
            value={component.config?.validation?.customMessage || ''}
            onChange={(e) => onUpdateConfig('validation.customMessage', e.target.value)}
            placeholder="Enter custom error message..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
      </div>
    </div>
  )
}

const ValidationSummary = ({ rules }) => (
  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
    <div className="flex items-start gap-2">
      <svg className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
      <div className="flex-1">
        <h5 className="text-xs font-semibold text-green-900 mb-1">Active Validation Rules</h5>
        <ul className="text-xs text-green-700 space-y-0.5">
          {rules.map((rule, idx) => (
            <li key={idx}>• {rule}</li>
          ))}
        </ul>
      </div>
    </div>
  </div>
)

const TextValidation = ({ component, onUpdateConfig }) => (
  <div className="grid grid-cols-2 gap-3 mb-6">
    <div>
      <label className="block text-xs font-medium text-gray-700 mb-1">Min Length</label>
      <input
        type="number"
        value={component.config?.validation?.minLength || ''}
        onChange={(e) => onUpdateConfig('validation.minLength', e.target.value)}
        placeholder="0"
        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
      />
    </div>
    <div>
      <label className="block text-xs font-medium text-gray-700 mb-1">Max Length</label>
      <input
        type="number"
        value={component.config?.validation?.maxLength || ''}
        onChange={(e) => onUpdateConfig('validation.maxLength', e.target.value)}
        placeholder="∞"
        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
      />
    </div>
  </div>
)

const NumberValidation = ({ component, onUpdateConfig }) => (
  <div className="grid grid-cols-2 gap-3 mb-6">
    <div>
      <label className="block text-xs font-medium text-gray-700 mb-1">Min Value</label>
      <input
        type="number"
        value={component.config?.validation?.min || ''}
        onChange={(e) => onUpdateConfig('validation.min', e.target.value)}
        placeholder="0"
        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
      />
    </div>
    <div>
      <label className="block text-xs font-medium text-gray-700 mb-1">Max Value</label>
      <input
        type="number"
        value={component.config?.validation?.max || ''}
        onChange={(e) => onUpdateConfig('validation.max', e.target.value)}
        placeholder="∞"
        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
      />
    </div>
  </div>
)

const ComparisonRules = ({ component, onUpdateConfig }) => {
  const comparisonRule = component.config?.validation?.comparisonRule || ''

  const getConditionOptions = () => {
    const baseOptions = [
      { value: '', label: 'No comparison rule' },
      { value: 'equals', label: 'Equals' },
      { value: 'notEquals', label: 'Not Equals' }
    ]

    if (component.type === 'text' || component.type === 'textarea') {
      return [
        ...baseOptions,
        { value: 'contains', label: 'Contains' },
        { value: 'notContains', label: 'Not Contains' },
        { value: 'startsWith', label: 'Starts With' },
        { value: 'endsWith', label: 'Ends With' }
      ]
    }

    if (component.type === 'number') {
      return [
        ...baseOptions,
        { value: 'greaterThan', label: 'Greater Than' },
        { value: 'greaterThanOrEqual', label: 'Greater Than or Equal' },
        { value: 'lessThan', label: 'Less Than' },
        { value: 'lessThanOrEqual', label: 'Less Than or Equal' },
        { value: 'between', label: 'Between' },
        { value: 'notBetween', label: 'Not Between' }
      ]
    }

    return baseOptions
  }

  return (
    <div className="border-t border-gray-200 pt-4 mb-6">
      <h5 className="text-xs font-semibold text-gray-900 mb-3">Comparison Rules</h5>
      <div className="space-y-3">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Rule Type</label>
          <select
            value={comparisonRule}
            onChange={(e) => onUpdateConfig('validation.comparisonRule', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            {getConditionOptions().map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>

        {comparisonRule && comparisonRule !== '' && (
          <>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                {['between', 'notBetween'].includes(comparisonRule) ? 'First Value' : 'Compare Value'}
              </label>
              <input
                type="text"
                value={component.config?.validation?.comparisonValue || ''}
                onChange={(e) => onUpdateConfig('validation.comparisonValue', e.target.value)}
                placeholder="Enter value..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            {['between', 'notBetween'].includes(comparisonRule) && (
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Second Value</label>
                <input
                  type="text"
                  value={component.config?.validation?.comparisonValue2 || ''}
                  onChange={(e) => onUpdateConfig('validation.comparisonValue2', e.target.value)}
                  placeholder="Enter second value..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default ValidationTab
