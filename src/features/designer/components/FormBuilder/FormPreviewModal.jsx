import { useState } from 'react'
import { validateField } from './utils'

const FormPreviewModal = ({
  isOpen,
  formName,
  components,
  onClose
}) => {
  const [previewValues, setPreviewValues] = useState({})
  const [previewErrors, setPreviewErrors] = useState({})
  const [currentIndex, setCurrentIndex] = useState(0)

  if (!isOpen) return null

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  const handleNext = () => {
    const visibleCount = components.filter((comp, idx) => shouldShowFieldWithBranching(comp, idx)).length
    if (currentIndex < visibleCount - 1) {
      setCurrentIndex(currentIndex + 1)
    }
  }

  const handleValueChange = (componentId, value) => {
    setPreviewValues({ ...previewValues, [componentId]: value })

    const component = components.find(c => c.id === componentId)
    const errors = validateField(component, value)
    setPreviewErrors({ ...previewErrors, [componentId]: errors })
  }

  const shouldShowField = (component) => {
    if (!component.config?.showHide?.enabled) return true

    const showHide = component.config.showHide
    const targetComponent = components.find(c => c.id === parseInt(showHide.targetField))
    if (!targetComponent) return true

    const targetValue = previewValues[targetComponent.id]
    const expectedValue = showHide.targetValue

    switch (showHide.condition) {
      case 'equals':
        return targetValue == expectedValue
      case 'notEquals':
        return targetValue != expectedValue
      case 'contains':
        return String(targetValue).includes(expectedValue)
      case 'greaterThan':
        return parseFloat(targetValue) > parseFloat(expectedValue)
      case 'lessThan':
        return parseFloat(targetValue) < parseFloat(expectedValue)
      default:
        return true
    }
  }

  const evaluateBranchingRules = (componentId) => {
    const component = components.find(c => c.id === componentId)
    if (!component?.config?.branching?.enabled || !component.config?.branching?.rules) return null

    const value = previewValues[componentId]
    const rules = component.config.branching.rules

    for (const rule of rules) {
      let conditionMet = false

      switch (rule.condition) {
        case 'equals':
          conditionMet = value == rule.targetValue
          break
        case 'notEquals':
          conditionMet = value != rule.targetValue
          break
        case 'contains':
          conditionMet = String(value || '').includes(rule.targetValue)
          break
        case 'greaterThan':
          conditionMet = parseFloat(value) > parseFloat(rule.targetValue)
          break
        case 'lessThan':
          conditionMet = parseFloat(value) < parseFloat(rule.targetValue)
          break
        default:
          conditionMet = false
      }

      if (conditionMet) {
        return rule
      }
    }

    return null
  }

  const shouldShowFieldWithBranching = (component, componentIndex) => {
    if (!shouldShowField(component)) return false

    for (let i = 0; i < componentIndex; i++) {
      const prevComponent = components[i]
      const triggeredRule = evaluateBranchingRules(prevComponent.id)

      if (triggeredRule) {
        if (triggeredRule.action === 'hideField' && triggeredRule.actionTarget == component.id) {
          return false
        }
        if (triggeredRule.action === 'endForm') {
          const triggerIndex = components.findIndex(c => c.id === prevComponent.id)
          if (componentIndex > triggerIndex) {
            return false
          }
        }
      }
    }

    return true
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-orange-500 to-orange-600">
          <div>
            <h2 className="text-xl font-semibold text-white">Form Preview</h2>
            <p className="text-sm text-orange-100 mt-0.5">Test validation and logic rules</p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-8 max-h-[calc(90vh-200px)] overflow-y-auto">
          <div className="max-w-2xl mx-auto">
            {/* Progress Indicator */}
            {components.length > 0 && (
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{formName}</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Question {currentIndex + 1} of {components.filter((comp, idx) => shouldShowFieldWithBranching(comp, idx)).length}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-sm text-gray-500">
                    {Math.round(((currentIndex + 1) / components.filter((comp, idx) => shouldShowFieldWithBranching(comp, idx)).length) * 100)}% Complete
                  </div>
                  <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-orange-500 to-orange-600 transition-all duration-300"
                      style={{ width: `${((currentIndex + 1) / components.filter((comp, idx) => shouldShowFieldWithBranching(comp, idx)).length) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            )}

            <form className="min-h-[300px]">
              {components.map((component, index) => {
                const isVisible = shouldShowFieldWithBranching(component, index)
                if (!isVisible) return null

                // Get the visible index
                const visibleComponents = components.filter((comp, idx) => shouldShowFieldWithBranching(comp, idx))
                const visibleIndex = visibleComponents.findIndex(c => c.id === component.id)

                // Only show the current component
                if (visibleIndex !== currentIndex) return null

                const errors = previewErrors[component.id] || []
                const hasError = errors.length > 0
                const triggeredBranchRule = evaluateBranchingRules(component.id)

                return (
                  <PreviewField
                    key={component.id}
                    component={component}
                    index={index}
                    value={previewValues[component.id]}
                    errors={errors}
                    hasError={hasError}
                    triggeredBranchRule={triggeredBranchRule}
                    allComponents={components}
                    onChange={(value) => handleValueChange(component.id, value)}
                  />
                )
              })}
            </form>

            {components.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No components added yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Footer */}
        {components.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
            <button
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Previous
            </button>

            <div className="text-sm text-gray-600">
              {currentIndex + 1} / {components.filter((comp, idx) => shouldShowFieldWithBranching(comp, idx)).length}
            </div>

            <button
              onClick={handleNext}
              disabled={currentIndex >= components.filter((comp, idx) => shouldShowFieldWithBranching(comp, idx)).length - 1}
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg text-sm font-semibold hover:from-orange-600 hover:to-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

const PreviewField = ({
  component,
  index,
  value,
  errors,
  hasError,
  triggeredBranchRule,
  allComponents,
  onChange
}) => {
  return (
    <div className={`bg-gray-50 p-6 rounded-lg border ${hasError ? 'border-red-300' : 'border-gray-200'}`}>
      <label className="block text-sm font-medium text-gray-900 mb-2">
        {index + 1}. {component.label}
        {component.config?.required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {component.config?.helpText && (
        <p className="text-xs text-gray-600 mb-3">{component.config.helpText}</p>
      )}

      <FieldInput
        component={component}
        value={value}
        hasError={hasError}
        onChange={onChange}
      />

      {/* Errors */}
      {hasError && (
        <div className="mt-2 space-y-1">
          {errors.map((error, i) => (
            <p key={i} className="text-xs text-red-600 flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </p>
          ))}
        </div>
      )}

      {/* Logic Indicators */}
      <LogicIndicators
        component={component}
        triggeredBranchRule={triggeredBranchRule}
        allComponents={allComponents}
      />
    </div>
  )
}

const FieldInput = ({ component, value, hasError, onChange }) => {
  const inputClass = `w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
    hasError ? 'border-red-500' : 'border-gray-300'
  }`

  switch (component.type) {
    case 'text':
      return (
        <input
          type="text"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={component.config?.placeholder || 'Enter text...'}
          className={inputClass}
        />
      )

    case 'number':
      return (
        <input
          type="number"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={component.config?.placeholder || 'Enter number...'}
          className={inputClass}
        />
      )

    case 'textarea':
      return (
        <textarea
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={component.config?.placeholder || 'Enter text...'}
          rows={4}
          className={inputClass}
        />
      )

    case 'checkbox':
      return (
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={value || false}
            onChange={(e) => onChange(e.target.checked)}
            className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
          />
          <span className="ml-2 text-sm text-gray-600">Check this option</span>
        </div>
      )

    case 'radio':
      return (
        <div className="space-y-2">
          {(component.config?.options || ['Option 1', 'Option 2', 'Option 3']).map((option, i) => (
            <div key={i} className="flex items-center">
              <input
                type="radio"
                name={`radio-${component.id}`}
                value={option}
                checked={value === option}
                onChange={(e) => onChange(e.target.value)}
                className="w-4 h-4 text-orange-500 border-gray-300 focus:ring-orange-500"
              />
              <span className="ml-2 text-sm text-gray-600">{option}</span>
            </div>
          ))}
        </div>
      )

    case 'dropdown':
      return (
        <select
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          className={inputClass}
        >
          <option value="">Select an option</option>
          {(component.config?.options || ['Option 1', 'Option 2', 'Option 3']).map((option, i) => (
            <option key={i} value={option}>{option}</option>
          ))}
        </select>
      )

    case 'date':
      return (
        <input
          type="date"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          className={inputClass}
        />
      )

    case 'vas': {
      const minValue = component.config?.vasMin !== undefined ? component.config.vasMin : 0
      const maxValue = component.config?.vasMax !== undefined ? component.config.vasMax : 10
      const interval = component.config?.vasInterval || 1
      const minLabel = component.config?.vasMinLabel || ''
      const maxLabel = component.config?.vasMaxLabel || ''
      const midValue = minValue + Math.floor((maxValue - minValue) / 2)

      // Always render VAS scales vertically with world-class design
      return (
        <div className="flex items-center justify-center gap-8 py-6">
          {/* Vertical Scale Container */}
          <div className="flex flex-col items-center bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            {/* Top Label (Max) */}
            <div className="flex flex-col items-center mb-4">
              <div className="text-lg font-semibold text-gray-900 mb-1.5">{maxValue}</div>
              {maxLabel && (
                <div className="px-2.5 py-1 bg-orange-50 rounded-lg border border-orange-100">
                  <span className="text-xs font-medium text-orange-700">{maxLabel}</span>
                </div>
              )}
            </div>

            {/* Vertical Slider with Scale Marks */}
            <div className="relative flex items-center gap-3">
              {/* Scale Track Background */}
              <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-48 bg-gradient-to-b from-orange-500 via-orange-400 to-orange-300 rounded-full opacity-20"></div>

              {/* Slider Input */}
              <input
                type="range"
                min={minValue}
                max={maxValue}
                step={interval}
                value={value || midValue}
                onChange={(e) => onChange(e.target.value)}
                orient="vertical"
                className="h-48 cursor-pointer relative z-10"
                style={{
                  writingMode: 'bt-lr',
                  WebkitAppearance: 'slider-vertical',
                  width: '8px'
                }}
              />
            </div>

            {/* Bottom Label (Min) */}
            <div className="flex flex-col items-center mt-4">
              <div className="text-lg font-semibold text-gray-900 mb-1.5">{minValue}</div>
              {minLabel && (
                <div className="px-2.5 py-1 bg-orange-50 rounded-lg border border-orange-100">
                  <span className="text-xs font-medium text-orange-700">{minLabel}</span>
                </div>
              )}
            </div>
          </div>

          {/* Current Value Display */}
          <div className="flex flex-col items-center justify-center min-w-[100px] p-5 bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-2xl border border-orange-200 shadow-sm">
            <div className="text-xs font-medium text-gray-500 mb-2">Your Selection</div>
            <div className="text-4xl font-bold text-orange-600">{value || midValue}</div>
          </div>
        </div>
      )
    }

    case 'image':
      return (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-orange-400 transition-colors">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <div className="mt-2">
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              {component.config?.allowCamera !== false ? 'Take Photo or Upload' : 'Upload Image'}
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {component.config?.acceptedTypes || 'All image types'} - Max {component.config?.maxSize || 5}MB
          </p>
        </div>
      )

    case 'file':
      return (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-orange-400 transition-colors">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <div className="mt-2">
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Choose File
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {component.config?.acceptedTypes === '*/*' ? 'All file types' : component.config?.acceptedTypes || 'All file types'} - Max {component.config?.maxSize || 10}MB
          </p>
        </div>
      )

    default:
      return null
  }
}

const LogicIndicators = ({ component, triggeredBranchRule, allComponents }) => (
  <>
    {component.config?.showHide?.enabled && (
      <p className="text-xs text-blue-600 mt-2 flex items-center">
        <span className="mr-1">👁️</span>
        Conditional visibility enabled
      </p>
    )}
    {component.config?.skipLogic?.enabled && (
      <p className="text-xs text-purple-600 mt-2 flex items-center">
        <span className="mr-1">⏭️</span>
        Skip logic enabled
      </p>
    )}
    {component.config?.branching?.enabled && component.config?.branching?.rules?.length > 0 && (
      <div className="mt-2">
        <p className="text-xs text-green-600 flex items-center mb-1">
          <span className="mr-1">🔀</span>
          Branching logic enabled ({component.config.branching.rules.length} rule{component.config.branching.rules.length !== 1 ? 's' : ''})
        </p>
        {triggeredBranchRule && (
          <div className="ml-5 mt-1 p-2 bg-green-100 border border-green-300 rounded text-xs text-green-800">
            <strong>Rule triggered:</strong> {triggeredBranchRule.condition} "{triggeredBranchRule.targetValue}" → {triggeredBranchRule.action}
            {triggeredBranchRule.actionTarget && ` (${allComponents.find(c => c.id == triggeredBranchRule.actionTarget)?.label || 'target field'})`}
          </div>
        )}
      </div>
    )}
  </>
)

export default FormPreviewModal
