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

  const visibleComponents = components.filter((comp, idx) => shouldShowFieldWithBranching(comp, idx))
  const totalQuestions = visibleComponents.length

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 overflow-y-auto">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
      >
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <div className="flex items-center justify-center py-4">
        {/* Mobile Device Frame */}
        <div className="w-full max-w-md flex-shrink-0">
          {/* Phone Frame */}
          <div className="bg-white rounded-[3rem] shadow-2xl border-[14px] border-gray-900 overflow-hidden flex-shrink-0">
            {/* Phone Notch */}
            <div className="bg-gray-900 h-6 flex-shrink-0 flex items-center justify-center">
              <div className="w-32 h-4 bg-black rounded-b-2xl"></div>
            </div>

            {/* Phone Screen Content */}
            <div className="bg-gradient-to-b from-white to-gray-50 h-[580px] flex-shrink-0 flex flex-col">
              {/* App Header */}
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-3 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                      <span className="text-orange-600 font-bold text-sm">eC</span>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold">{formName}</h3>
                      <p className="text-xs text-orange-100">Clinical Study</p>
                    </div>
                  </div>
                </div>
              </div>

              {components.length > 0 ? (
                <>
                  {/* Progress Bar */}
                  <div className="px-5 pt-4 pb-3 bg-white">
                    <div className="flex items-center justify-between mb-3 text-xs font-medium text-gray-600">
                      <span className="flex items-center space-x-1">
                        <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span>Question {currentIndex + 1}/{totalQuestions}</span>
                      </span>
                      <span className="px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full text-xs font-semibold">
                        {Math.round(((currentIndex + 1) / totalQuestions) * 100)}% Complete
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 shadow-inner">
                      <div
                        className="bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 h-2.5 rounded-full transition-all duration-500 shadow-sm"
                        style={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Question Content */}
                  <div className="flex-1 px-6 py-6 overflow-y-auto">
                    {components.map((component, index) => {
                      const isVisible = shouldShowFieldWithBranching(component, index)
                      if (!isVisible) return null

                      const visibleIndex = visibleComponents.findIndex(c => c.id === component.id)
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
                  </div>

                  {/* Navigation Buttons */}
                  <div className="px-6 py-4 border-t-2 border-gray-200 bg-white">
                    <div className="flex items-center justify-between gap-3 mb-4">
                      <button
                        onClick={handlePrevious}
                        disabled={currentIndex === 0}
                        className={`flex-1 inline-flex items-center justify-center px-4 py-3 border-2 rounded-xl font-semibold transition-all duration-200 ${
                          currentIndex === 0
                            ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                            : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 active:scale-95'
                        }`}
                      >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Previous
                      </button>
                      <button
                        onClick={handleNext}
                        disabled={currentIndex >= totalQuestions - 1}
                        className="flex-1 inline-flex items-center justify-center px-4 py-3 rounded-xl font-semibold transition-all duration-200 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white border-2 border-transparent active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                        <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>

                    {/* Progress Dots */}
                    <div className="flex items-center justify-center gap-2">
                      {visibleComponents.map((_, index) => (
                        <div
                          key={index}
                          className={`h-2 rounded-full transition-all duration-300 ${
                            index === currentIndex
                              ? 'w-8 bg-orange-500'
                              : index < currentIndex
                              ? 'w-2 bg-green-500'
                              : 'w-2 bg-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-gray-500">
                  <p>No components added yet</p>
                </div>
              )}

              {/* Phone Home Indicator */}
              <div className="bg-gray-900 h-6 flex-shrink-0 flex items-center justify-center">
                <div className="w-24 h-1 bg-gray-600 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
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
    <div>
      <div className="mb-6">
        <div className="flex items-start space-x-2 mb-3">
          {component.config?.required && (
            <span className="flex-shrink-0 w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-xs font-bold">
              *
            </span>
          )}
          <h2 className="text-xl font-bold text-gray-900 leading-tight">
            {component.label}
          </h2>
        </div>
        {component.config?.helpText && (
          <div className="flex items-start space-x-2 bg-blue-50 border-l-4 border-blue-400 p-3 rounded-r-lg">
            <svg className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-blue-800">{component.config.helpText}</p>
          </div>
        )}
      </div>

      <FieldInput
        component={component}
        value={value}
        hasError={hasError}
        onChange={onChange}
      />

      {/* Errors */}
      {hasError && (
        <div className="mt-3 space-y-1">
          {errors.map((error, i) => (
            <div key={i} className="flex items-start space-x-2 bg-red-50 border-l-4 border-red-400 p-3 rounded-r-lg">
              <svg className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <p className="text-sm text-red-800">{error}</p>
            </div>
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
