import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

const FormBuilder = () => {
  const { studyId, formId } = useParams()
  const navigate = useNavigate()

  const [selectedComponent, setSelectedComponent] = useState(null)
  const [canvasComponents, setCanvasComponents] = useState([])
  const [showPreview, setShowPreview] = useState(false)
  const [formName, setFormName] = useState(formId ? `Form ${formId}` : 'New Form')
  const [activeTab, setActiveTab] = useState('basic') // basic, validation, logic

  // Preview state for testing logic
  const [previewValues, setPreviewValues] = useState({})
  const [previewErrors, setPreviewErrors] = useState({})

  // Available form components
  const componentTypes = [
    { id: 'text', name: 'Single Line Text', icon: '📝', description: 'For names, IDs, short answers' },
    { id: 'textarea', name: 'Multi Line Text', icon: '📄', description: 'For descriptions, comments' },
    { id: 'number', name: 'Number Input', icon: '🔢', description: 'Numeric values only' },
    { id: 'date', name: 'Date Picker', icon: '📅', description: 'Date selection' },
    { id: 'radio', name: 'Radio Button', icon: '🔘', description: 'Single choice from options' },
    { id: 'checkbox', name: 'Checkbox', icon: '☑️', description: 'Yes/No or multiple selections' },
    { id: 'dropdown', name: 'Dropdown', icon: '▼', description: 'Select from dropdown list' },
    { id: 'vas', name: 'VAS Scale', icon: '━━', description: 'Continuous slider (0-10)' },
    { id: 'image', name: 'Image Capture', icon: '📷', description: 'Capture or upload images' },
    { id: 'file', name: 'File Upload', icon: '📎', description: 'Upload documents/files' }
  ]

  // Load existing form data when editing
  useEffect(() => {
    if (formId) {
      const savedForms = localStorage.getItem(`study-${studyId}-forms`)
      if (savedForms) {
        const allForms = JSON.parse(savedForms)
        const form = allForms.find(f => f.id === parseInt(formId))
        if (form) {
          setFormName(form.name)
          setCanvasComponents(form.components || [])
        }
      }
    }
  }, [studyId, formId])

  const handleDrop = (e) => {
    e.preventDefault()
    const componentType = e.dataTransfer.getData('componentType')
    if (componentType) {
      const newComponent = {
        id: Date.now(),
        type: componentType,
        label: `${componentType} ${canvasComponents.length + 1}`,
        config: {
          required: false,
          // Validation rules
          validation: {
            minLength: '',
            maxLength: '',
            min: '',
            max: '',
            pattern: '',
            customMessage: ''
          },
          // Show/Hide logic
          showHide: {
            enabled: false,
            condition: 'equals',
            targetField: '',
            targetValue: ''
          },
          // Skip logic
          skipLogic: {
            enabled: false,
            condition: 'equals',
            targetValue: '',
            skipToField: ''
          },
          // Branching logic
          branching: {
            enabled: false,
            rules: []
          }
        }
      }
      setCanvasComponents([...canvasComponents, newComponent])
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  const handleDragStart = (e, type) => {
    e.dataTransfer.setData('componentType', type)
  }

  const removeComponent = (id) => {
    setCanvasComponents(canvasComponents.filter(c => c.id !== id))
    if (selectedComponent?.id === id) {
      setSelectedComponent(null)
    }
  }

  const updateComponent = (field, value) => {
    const updated = canvasComponents.map(c =>
      c.id === selectedComponent.id ? { ...c, [field]: value } : c
    )
    setCanvasComponents(updated)
    setSelectedComponent({ ...selectedComponent, [field]: value })
  }

  const updateConfig = (path, value) => {
    const pathArray = path.split('.')
    const updated = canvasComponents.map(c => {
      if (c.id === selectedComponent.id) {
        const newConfig = JSON.parse(JSON.stringify(c.config)) // Deep clone
        let current = newConfig
        for (let i = 0; i < pathArray.length - 1; i++) {
          current = current[pathArray[i]]
        }
        current[pathArray[pathArray.length - 1]] = value
        return { ...c, config: newConfig }
      }
      return c
    })
    setCanvasComponents(updated)

    // Update selected component
    const newConfig = JSON.parse(JSON.stringify(selectedComponent.config)) // Deep clone
    let current = newConfig
    for (let i = 0; i < pathArray.length - 1; i++) {
      current = current[pathArray[i]]
    }
    current[pathArray[pathArray.length - 1]] = value
    setSelectedComponent({ ...selectedComponent, config: newConfig })
  }

  // Update multiple config paths at once
  const updateMultipleConfigs = (updates) => {
    const updated = canvasComponents.map(c => {
      if (c.id === selectedComponent.id) {
        const newConfig = JSON.parse(JSON.stringify(c.config)) // Deep clone

        updates.forEach(({ path, value }) => {
          const pathArray = path.split('.')
          let current = newConfig
          for (let i = 0; i < pathArray.length - 1; i++) {
            current = current[pathArray[i]]
          }
          current[pathArray[pathArray.length - 1]] = value
        })

        return { ...c, config: newConfig }
      }
      return c
    })
    setCanvasComponents(updated)

    // Update selected component
    const newConfig = JSON.parse(JSON.stringify(selectedComponent.config)) // Deep clone
    updates.forEach(({ path, value }) => {
      const pathArray = path.split('.')
      let current = newConfig
      for (let i = 0; i < pathArray.length - 1; i++) {
        current = current[pathArray[i]]
      }
      current[pathArray[pathArray.length - 1]] = value
    })
    setSelectedComponent({ ...selectedComponent, config: newConfig })
  }

  // Validation engine
  const validateField = (component, value) => {
    const errors = []
    const validation = component.config?.validation || {}

    // Required check - handle various empty states
    if (component.config?.required) {
      if (value === null || value === undefined || value === '' || (typeof value === 'string' && value.trim() === '')) {
        errors.push('This field is required')
        return errors // Don't continue validation if required field is empty
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

  // Get validation summary for a component
  const getValidationSummary = (component) => {
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

  // Logic engine - check if field should be shown
  const shouldShowField = (component) => {
    if (!component.config?.showHide?.enabled) return true

    const showHide = component.config.showHide
    const targetComponent = canvasComponents.find(c => c.id === parseInt(showHide.targetField))
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

  // Branching logic engine - evaluate if any branching rule is triggered
  const evaluateBranchingRules = (componentId) => {
    const component = canvasComponents.find(c => c.id === componentId)
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

  // Check if field should be shown based on branching logic
  const shouldShowFieldWithBranching = (component, componentIndex) => {
    // First check show/hide logic
    if (!shouldShowField(component)) return false

    // Check if any previous field has branching logic that affects this field
    for (let i = 0; i < componentIndex; i++) {
      const prevComponent = canvasComponents[i]
      const triggeredRule = evaluateBranchingRules(prevComponent.id)

      if (triggeredRule) {
        // Handle different branching actions
        if (triggeredRule.action === 'hideField' && triggeredRule.actionTarget == component.id) {
          return false
        }
        if (triggeredRule.action === 'endForm') {
          // Hide all fields after the current one
          const triggerIndex = canvasComponents.findIndex(c => c.id === prevComponent.id)
          if (componentIndex > triggerIndex) {
            return false
          }
        }
      }
    }

    return true
  }

  const handlePreview = () => {
    setShowPreview(true)
    setPreviewValues({})
    setPreviewErrors({})
  }

  const handlePreviewValueChange = (componentId, value) => {
    setPreviewValues({ ...previewValues, [componentId]: value })

    // Validate on change
    const component = canvasComponents.find(c => c.id === componentId)
    const errors = validateField(component, value)
    setPreviewErrors({ ...previewErrors, [componentId]: errors })
  }

  const handleSave = () => {
    // Get existing forms for this study
    const savedForms = localStorage.getItem(`study-${studyId}-forms`)
    let allForms = savedForms ? JSON.parse(savedForms) : []

    // Create form data
    const formData = {
      id: formId ? parseInt(formId) : Date.now(),
      name: formName,
      version: formId ? 'V1.1' : 'V1.0',
      lastModified: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      modifiedBy: 'Study Designer',
      components: canvasComponents
    }

    if (formId) {
      // Update existing form
      allForms = allForms.map(f => f.id === parseInt(formId) ? formData : f)
    } else {
      // Add new form
      allForms.push(formData)
    }

    // Save back to localStorage
    localStorage.setItem(`study-${studyId}-forms`, JSON.stringify(allForms))

    console.log('Saved form:', formData)

    // Show success message
    alert(`Form "${formName}" saved successfully!\n\nComponents: ${canvasComponents.length}\nVersion: ${formData.version}`)

    // Navigate back to study detail
    setTimeout(() => {
      navigate(`/designer/studies/${studyId}`)
    }, 500)
  }

  const hasLogic = (component) => {
    return component.config?.showHide?.enabled ||
           component.config?.skipLogic?.enabled ||
           component.config?.branching?.enabled ||
           component.config?.validation?.pattern ||
           component.config?.validation?.minLength ||
           component.config?.validation?.maxLength ||
           component.config?.validation?.min ||
           component.config?.validation?.max
  }

  return (
    <div className="flex-1 flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-8 py-6">
          <button
            onClick={() => navigate(`/designer/studies/${studyId}`)}
            className="flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Study
          </button>

          <div className="flex items-center justify-between">
            <div>
              <input
                type="text"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                className="text-2xl font-semibold text-gray-900 bg-transparent border-b-2 border-transparent hover:border-gray-300 focus:border-orange-500 focus:outline-none transition-colors"
              />
              <p className="text-sm text-gray-500 mt-1">Design your form with drag-and-drop components</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handlePreview}
                disabled={canvasComponents.length === 0}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Preview
              </button>
              <button
                onClick={handleSave}
                disabled={canvasComponents.length === 0}
                className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg hover:from-orange-600 hover:to-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save Form
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Three Column Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Component Palette */}
        <div className="w-64 bg-white border-r border-gray-200 overflow-y-auto">
          <div className="p-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Components</h3>
            <div className="space-y-2">
              {componentTypes.map((component) => (
                <div
                  key={component.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, component.id)}
                  className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-lg cursor-move hover:bg-orange-50 hover:border-orange-300 transition-colors"
                >
                  <span className="text-2xl">{component.icon}</span>
                  <span className="text-sm font-medium text-gray-700">{component.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Center - Canvas */}
        <div className="flex-1 overflow-y-auto p-8">
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="min-h-full bg-white rounded-xl border-2 border-dashed border-gray-300 p-8"
          >
            {canvasComponents.length === 0 ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">Drag components here</h3>
                  <p className="text-sm text-gray-500">Start building your form by dragging components from the left</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {canvasComponents.map((component, index) => (
                  <div
                    key={component.id}
                    onClick={() => setSelectedComponent(component)}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all relative ${
                      selectedComponent?.id === component.id
                        ? 'border-orange-500 bg-orange-50'
                        : 'border-gray-200 hover:border-orange-300 bg-white'
                    }`}
                  >
                    {hasLogic(component) && (
                      <div className="absolute top-2 right-12 flex items-center gap-1">
                        {component.config?.showHide?.enabled && (
                          <span className="px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded-full" title="Show/Hide Logic">👁️</span>
                        )}
                        {component.config?.skipLogic?.enabled && (
                          <span className="px-2 py-0.5 text-xs bg-purple-100 text-purple-700 rounded-full" title="Skip Logic">⏭️</span>
                        )}
                        {component.config?.branching?.enabled && (
                          <span className="px-2 py-0.5 text-xs bg-green-100 text-green-700 rounded-full" title="Branching Logic">🔀</span>
                        )}
                        {(component.config?.validation?.pattern || component.config?.validation?.minLength || component.config?.validation?.maxLength || component.config?.validation?.min || component.config?.validation?.max) && (
                          <span className="px-2 py-0.5 text-xs bg-amber-100 text-amber-700 rounded-full" title="Validation Rules">✓</span>
                        )}
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">
                          {componentTypes.find(c => c.id === component.type)?.icon}
                        </span>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {index + 1}. {component.label}
                            {component.config?.required && <span className="text-red-500 ml-1">*</span>}
                          </div>
                          <div className="text-xs text-gray-500">{component.type}</div>
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          removeComponent(component.id)
                        }}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar - Properties & Validation */}
        <div className="w-96 bg-white border-l border-gray-200 overflow-y-auto">
          <div className="p-4">
            {selectedComponent ? (
              <>
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Component Properties</h3>

                {/* Tabs */}
                <div className="flex border-b border-gray-200 mb-4">
                  <button
                    type="button"
                    onClick={() => setActiveTab('basic')}
                    className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors cursor-pointer ${
                      activeTab === 'basic'
                        ? 'border-orange-500 text-orange-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Basic
                  </button>

                  {/* Hide Validation and Logic tabs for image/file uploads */}
                  {!['image', 'file'].includes(selectedComponent.type) && (
                    <>
                      <button
                        type="button"
                        onClick={() => setActiveTab('validation')}
                        className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors cursor-pointer ${
                          activeTab === 'validation'
                            ? 'border-orange-500 text-orange-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        Validation
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveTab('logic')}
                        className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors cursor-pointer ${
                          activeTab === 'logic'
                            ? 'border-orange-500 text-orange-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        Logic
                      </button>
                    </>
                  )}
                </div>

                {/* Basic Properties Tab */}
                {activeTab === 'basic' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Label</label>
                      <input
                        type="text"
                        value={selectedComponent.label}
                        onChange={(e) => updateComponent('label', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-2">Required Field</label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedComponent.config?.required || false}
                          onChange={(e) => updateConfig('required', e.target.checked)}
                          className="rounded text-orange-500 focus:ring-orange-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">This field is required</span>
                      </label>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Placeholder Text</label>
                      <input
                        type="text"
                        value={selectedComponent.config?.placeholder || ''}
                        onChange={(e) => updateConfig('placeholder', e.target.value)}
                        placeholder="Enter placeholder..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Help Text</label>
                      <textarea
                        value={selectedComponent.config?.helpText || ''}
                        onChange={(e) => updateConfig('helpText', e.target.value)}
                        placeholder="Enter help text..."
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                      />
                    </div>

                    {/* Default Value */}
                    {!['radio', 'dropdown', 'checkbox', 'image', 'file', 'vas'].includes(selectedComponent.type) && (
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Default Value</label>
                        <input
                          type={selectedComponent.type === 'number' ? 'number' : selectedComponent.type === 'date' ? 'date' : 'text'}
                          value={selectedComponent.config?.defaultValue || ''}
                          onChange={(e) => updateConfig('defaultValue', e.target.value)}
                          placeholder="Enter default value..."
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                      </div>
                    )}

                    {/* Options Configuration for Choice-Based Components */}
                    {['radio', 'dropdown', 'checkbox'].includes(selectedComponent.type) && (
                      <div className="border-t border-gray-200 pt-4">
                        <div className="flex items-center justify-between mb-2">
                          <label className="block text-xs font-medium text-gray-700">
                            Options/Choices
                          </label>
                          <button
                            onClick={() => {
                              const currentOptions = selectedComponent.config?.options || ['Option 1', 'Option 2', 'Option 3']
                              updateConfig('options', [...currentOptions, `Option ${currentOptions.length + 1}`])
                            }}
                            className="text-xs text-orange-600 hover:text-orange-700 font-medium"
                          >
                            + Add Option
                          </button>
                        </div>

                        <div className="space-y-2">
                          {(selectedComponent.config?.options || ['Option 1', 'Option 2', 'Option 3']).map((option, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <span className="text-xs text-gray-500 w-6">{index + 1}.</span>
                              <input
                                type="text"
                                value={option}
                                onChange={(e) => {
                                  const newOptions = [...(selectedComponent.config?.options || ['Option 1', 'Option 2', 'Option 3'])]
                                  newOptions[index] = e.target.value
                                  updateConfig('options', newOptions)
                                }}
                                className="flex-1 px-3 py-1.5 border border-gray-300 rounded text-xs focus:outline-none focus:ring-2 focus:ring-orange-500"
                                placeholder={`Option ${index + 1}`}
                              />
                              {(selectedComponent.config?.options || ['Option 1', 'Option 2', 'Option 3']).length > 2 && (
                                <button
                                  onClick={() => {
                                    const newOptions = [...(selectedComponent.config?.options || ['Option 1', 'Option 2', 'Option 3'])]
                                    newOptions.splice(index, 1)
                                    updateConfig('options', newOptions)
                                  }}
                                  className="p-1 text-red-600 hover:text-red-800"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Number/Date Specific Options */}
                    {selectedComponent.type === 'number' && (
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Step Value</label>
                        <input
                          type="number"
                          value={selectedComponent.config?.step || ''}
                          onChange={(e) => updateConfig('step', e.target.value)}
                          placeholder="1"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                        <p className="text-xs text-gray-500 mt-1">Increment/decrement value (e.g., 0.1, 1, 10)</p>
                      </div>
                    )}

                    {/* Image Capture Specific Options */}
                    {selectedComponent.type === 'image' && (
                      <div className="space-y-4 border-t border-gray-200 pt-4">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Accepted File Types</label>
                          <select
                            value={selectedComponent.config?.acceptedTypes || 'image/*'}
                            onChange={(e) => updateConfig('acceptedTypes', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                          >
                            <option value="image/*">All Images</option>
                            <option value="image/jpeg,image/png">JPEG, PNG only</option>
                            <option value="image/jpeg">JPEG only</option>
                            <option value="image/png">PNG only</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Max File Size (MB)</label>
                          <input
                            type="number"
                            value={selectedComponent.config?.maxSize || 5}
                            onChange={(e) => updateConfig('maxSize', e.target.value)}
                            placeholder="5"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                          />
                        </div>

                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id="allowCamera"
                            checked={selectedComponent.config?.allowCamera !== false}
                            onChange={(e) => updateConfig('allowCamera', e.target.checked)}
                            className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                          />
                          <label htmlFor="allowCamera" className="text-xs text-gray-700">Allow camera capture</label>
                        </div>

                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id="multipleImages"
                            checked={selectedComponent.config?.multiple || false}
                            onChange={(e) => updateConfig('multiple', e.target.checked)}
                            className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                          />
                          <label htmlFor="multipleImages" className="text-xs text-gray-700">Allow multiple images</label>
                        </div>
                      </div>
                    )}

                    {/* File Upload Specific Options */}
                    {selectedComponent.type === 'file' && (
                      <div className="space-y-4 border-t border-gray-200 pt-4">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Accepted File Types</label>
                          <select
                            value={selectedComponent.config?.acceptedTypes || '*/*'}
                            onChange={(e) => updateConfig('acceptedTypes', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                          >
                            <option value="*/*">All Files</option>
                            <option value=".pdf">PDF only</option>
                            <option value=".doc,.docx">Word Documents</option>
                            <option value=".xls,.xlsx">Excel Spreadsheets</option>
                            <option value=".pdf,.doc,.docx">PDF and Word</option>
                            <option value=".pdf,.doc,.docx,.xls,.xlsx">Common Documents</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Max File Size (MB)</label>
                          <input
                            type="number"
                            value={selectedComponent.config?.maxSize || 10}
                            onChange={(e) => updateConfig('maxSize', e.target.value)}
                            placeholder="10"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                          />
                        </div>

                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id="multipleFiles"
                            checked={selectedComponent.config?.multiple || false}
                            onChange={(e) => updateConfig('multiple', e.target.checked)}
                            className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                          />
                          <label htmlFor="multipleFiles" className="text-xs text-gray-700">Allow multiple files</label>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Validation Rules Tab */}
                {activeTab === 'validation' && (
                  <div className="space-y-4">
                    {/* Active Rules Summary */}
                    {getValidationSummary(selectedComponent).length > 0 && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                        <div className="flex items-start gap-2">
                          <svg className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <div className="flex-1">
                            <h5 className="text-xs font-semibold text-green-900 mb-1">Active Validation Rules</h5>
                            <ul className="text-xs text-green-700 space-y-0.5">
                              {getValidationSummary(selectedComponent).map((rule, idx) => (
                                <li key={idx}>• {rule}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}

                    <div>
                      <h4 className="text-xs font-semibold text-gray-900 mb-3">Validation Rules</h4>

                      {(selectedComponent.type === 'text' || selectedComponent.type === 'textarea') && (
                        <>
                          <div className="grid grid-cols-2 gap-3 mb-6">
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">Min Length</label>
                              <input
                                type="number"
                                value={selectedComponent.config?.validation?.minLength || ''}
                                onChange={(e) => updateConfig('validation.minLength', e.target.value)}
                                placeholder="0"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">Max Length</label>
                              <input
                                type="number"
                                value={selectedComponent.config?.validation?.maxLength || ''}
                                onChange={(e) => updateConfig('validation.maxLength', e.target.value)}
                                placeholder="∞"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                              />
                            </div>
                          </div>
                        </>
                      )}

                      {selectedComponent.type === 'number' && (
                        <>
                          <div className="grid grid-cols-2 gap-3 mb-6">
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">Min Value</label>
                              <input
                                type="number"
                                value={selectedComponent.config?.validation?.min || ''}
                                onChange={(e) => updateConfig('validation.min', e.target.value)}
                                placeholder="0"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">Max Value</label>
                              <input
                                type="number"
                                value={selectedComponent.config?.validation?.max || ''}
                                onChange={(e) => updateConfig('validation.max', e.target.value)}
                                placeholder="∞"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                              />
                            </div>
                          </div>
                        </>
                      )}

                        {/* Comparison Rules - Only for text, textarea, number */}
                        {(selectedComponent.type === 'text' || selectedComponent.type === 'textarea' || selectedComponent.type === 'number') && (
                          <div className="border-t border-gray-200 pt-4 mb-6">
                            <h5 className="text-xs font-semibold text-gray-900 mb-3">Comparison Rules</h5>
                            <div className="space-y-3">
                              <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Rule Type</label>
                                <select
                                  value={selectedComponent.config?.validation?.comparisonRule || ''}
                                  onChange={(e) => updateConfig('validation.comparisonRule', e.target.value)}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                                >
                                  <option value="">No comparison rule</option>
                                  <option value="equals">Equals</option>
                                  <option value="notEquals">Not Equals</option>

                                  {/* Text-specific rules */}
                                  {(selectedComponent.type === 'text' || selectedComponent.type === 'textarea') && (
                                    <>
                                      <option value="contains">Contains</option>
                                      <option value="notContains">Not Contains</option>
                                      <option value="startsWith">Starts With</option>
                                      <option value="endsWith">Ends With</option>
                                    </>
                                  )}

                                  {/* Number-specific rules */}
                                  {selectedComponent.type === 'number' && (
                                    <>
                                      <option value="greaterThan">Greater Than</option>
                                      <option value="greaterThanOrEqual">Greater Than or Equal</option>
                                      <option value="lessThan">Less Than</option>
                                      <option value="lessThanOrEqual">Less Than or Equal</option>
                                      <option value="between">Between</option>
                                      <option value="notBetween">Not Between</option>
                                    </>
                                  )}
                                </select>
                              </div>

                              {selectedComponent.config?.validation?.comparisonRule && selectedComponent.config?.validation?.comparisonRule !== '' && (
                                <>
                                  <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">
                                      {['between', 'notBetween'].includes(selectedComponent.config?.validation?.comparisonRule) ? 'First Value' : 'Compare Value'}
                                    </label>
                                    <input
                                      type="text"
                                      value={selectedComponent.config?.validation?.comparisonValue || ''}
                                      onChange={(e) => updateConfig('validation.comparisonValue', e.target.value)}
                                      placeholder="Enter value..."
                                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    />
                                  </div>

                                  {['between', 'notBetween'].includes(selectedComponent.config?.validation?.comparisonRule) && (
                                    <div>
                                      <label className="block text-xs font-medium text-gray-700 mb-1">Second Value</label>
                                      <input
                                        type="text"
                                        value={selectedComponent.config?.validation?.comparisonValue2 || ''}
                                        onChange={(e) => updateConfig('validation.comparisonValue2', e.target.value)}
                                        placeholder="Enter second value..."
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                                      />
                                    </div>
                                  )}
                                </>
                              )}
                            </div>
                          </div>
                        )}

                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Custom Error Message</label>
                        <input
                          type="text"
                          value={selectedComponent.config?.validation?.customMessage || ''}
                          onChange={(e) => updateConfig('validation.customMessage', e.target.value)}
                          placeholder="Enter custom error message..."
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Logic Tab */}
                {activeTab === 'logic' && (
                  <div className="space-y-4">
                    {/* Branching Logic */}
                    <div className="border border-gray-200 rounded-lg p-3">
                      <label className="flex items-center mb-3 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={selectedComponent.config?.branching?.enabled || false}
                          onChange={(e) => {
                            updateConfig('branching.enabled', e.target.checked)
                            if (e.target.checked && !selectedComponent.config?.branching?.rules) {
                              updateConfig('branching.rules', [])
                            }
                          }}
                          className="rounded text-orange-500 focus:ring-orange-500 cursor-pointer"
                        />
                        <span className="ml-2 text-sm font-medium text-gray-900">Branching Logic</span>
                      </label>

                      {selectedComponent.config?.branching?.enabled && (
                        <div className="pl-6 border-l-2 border-green-200 space-y-3">
                          <p className="text-xs text-gray-600">Create multiple conditional paths based on answers</p>

                          {/* Existing Rules */}
                          {selectedComponent.config?.branching?.rules?.length > 0 && (
                            <div className="space-y-2">
                              {selectedComponent.config.branching.rules.map((rule, index) => (
                                <div key={index} className="bg-green-50 border border-green-200 rounded-lg p-3">
                                  <div className="flex items-start justify-between mb-2">
                                    <span className="text-xs font-semibold text-green-900">Branch {index + 1}</span>
                                    <button
                                      onClick={() => {
                                        const newRules = [...selectedComponent.config.branching.rules]
                                        newRules.splice(index, 1)
                                        updateConfig('branching.rules', newRules)
                                      }}
                                      className="text-red-600 hover:text-red-800"
                                    >
                                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                      </svg>
                                    </button>
                                  </div>
                                  <div className="space-y-2">
                                    <div>
                                      <label className="block text-xs font-medium text-gray-700 mb-1">When answer</label>
                                      <select
                                        value={rule.condition || 'equals'}
                                        onChange={(e) => {
                                          const newRules = [...selectedComponent.config.branching.rules]
                                          newRules[index] = { ...newRules[index], condition: e.target.value }
                                          updateConfig('branching.rules', newRules)
                                        }}
                                        className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs focus:outline-none focus:ring-2 focus:ring-orange-500"
                                      >
                                        {/* Image/File specific rules */}
                                        {(selectedComponent.type === 'image' || selectedComponent.type === 'file') ? (
                                          <>
                                            <option value="uploaded">File Uploaded</option>
                                            <option value="notUploaded">File Not Uploaded</option>
                                          </>
                                        ) : (
                                          <>
                                            <option value="equals">Equals</option>
                                            <option value="notEquals">Not Equals</option>

                                            {/* Text-specific rules */}
                                            {(selectedComponent.type === 'text' || selectedComponent.type === 'textarea') && (
                                              <>
                                                <option value="contains">Contains</option>
                                                <option value="notContains">Not Contains</option>
                                                <option value="startsWith">Starts With</option>
                                                <option value="endsWith">Ends With</option>
                                              </>
                                            )}

                                            {/* Number-specific rules */}
                                            {selectedComponent.type === 'number' && (
                                              <>
                                                <option value="greaterThan">Greater Than</option>
                                                <option value="greaterThanOrEqual">Greater Than or Equal</option>
                                                <option value="lessThan">Less Than</option>
                                                <option value="lessThanOrEqual">Less Than or Equal</option>
                                                <option value="between">Between</option>
                                                <option value="notBetween">Not Between</option>
                                              </>
                                            )}
                                          </>
                                        )}
                                      </select>
                                    </div>

                                    {/* Value inputs - Hide for image/file upload conditions */}
                                    {!['uploaded', 'notUploaded'].includes(rule.condition) && (
                                      <>
                                        <div>
                                          <label className="block text-xs font-medium text-gray-700 mb-1">
                                            {['between', 'notBetween'].includes(rule.condition) ? 'First Value' : 'Value'}
                                          </label>
                                          <input
                                            type="text"
                                            value={rule.targetValue || ''}
                                            onChange={(e) => {
                                              const newRules = [...selectedComponent.config.branching.rules]
                                              newRules[index] = { ...newRules[index], targetValue: e.target.value }
                                              updateConfig('branching.rules', newRules)
                                            }}
                                            placeholder="Enter value..."
                                            className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs focus:outline-none focus:ring-2 focus:ring-orange-500"
                                          />
                                        </div>
                                        {['between', 'notBetween'].includes(rule.condition) && (
                                          <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-1">Second Value</label>
                                            <input
                                              type="text"
                                              value={rule.targetValue2 || ''}
                                              onChange={(e) => {
                                                const newRules = [...selectedComponent.config.branching.rules]
                                                newRules[index] = { ...newRules[index], targetValue2: e.target.value }
                                                updateConfig('branching.rules', newRules)
                                              }}
                                              placeholder="Enter second value..."
                                              className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs focus:outline-none focus:ring-2 focus:ring-orange-500"
                                            />
                                          </div>
                                        )}
                                      </>
                                    )}

                                    <div>
                                      <label className="block text-xs font-medium text-gray-700 mb-1">Then</label>
                                      <select
                                        value={rule.action || 'skipToField'}
                                        onChange={(e) => {
                                          const newRules = [...selectedComponent.config.branching.rules]
                                          newRules[index] = { ...newRules[index], action: e.target.value }
                                          updateConfig('branching.rules', newRules)
                                        }}
                                        className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs focus:outline-none focus:ring-2 focus:ring-orange-500"
                                      >
                                        <option value="skipToField">Skip to field</option>
                                        <option value="showField">Show field</option>
                                        <option value="hideField">Hide field</option>
                                        <option value="endForm">End form</option>
                                      </select>
                                    </div>
                                    {(rule.action === 'skipToField' || rule.action === 'showField' || rule.action === 'hideField') && (
                                      <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">Target field</label>
                                        <select
                                          value={rule.actionTarget || ''}
                                          onChange={(e) => {
                                            const newRules = [...selectedComponent.config.branching.rules]
                                            newRules[index] = { ...newRules[index], actionTarget: e.target.value }
                                            updateConfig('branching.rules', newRules)
                                          }}
                                          className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        >
                                          <option value="">Select field...</option>
                                          {canvasComponents
                                            .filter(c => c.id !== selectedComponent.id)
                                            .map(c => (
                                              <option key={c.id} value={c.id}>{c.label}</option>
                                            ))}
                                        </select>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Add Branch Rule Button */}
                          <button
                            onClick={() => {
                              const newRule = {
                                condition: 'equals',
                                targetValue: '',
                                action: 'skipToField',
                                actionTarget: ''
                              }
                              const currentRules = selectedComponent.config?.branching?.rules || []
                              updateConfig('branching.rules', [...currentRules, newRule])
                            }}
                            className="text-xs text-orange-600 hover:text-orange-700 font-medium flex items-center gap-1"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Add Branch Rule
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
                <p className="text-sm text-gray-500">Select a component to configure</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Preview Modal with Working Validation */}
      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-orange-500 to-orange-600">
              <div>
                <h2 className="text-xl font-semibold text-white">Form Preview</h2>
                <p className="text-sm text-orange-100 mt-0.5">Test validation and logic rules</p>
              </div>
              <button
                onClick={() => setShowPreview(false)}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-8 max-h-[calc(90vh-120px)] overflow-y-auto">
              <div className="max-w-2xl mx-auto">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">{formName}</h3>

                <form className="space-y-6">
                  {canvasComponents.map((component, index) => {
                    const isVisible = shouldShowFieldWithBranching(component, index)
                    if (!isVisible) return null

                    const errors = previewErrors[component.id] || []
                    const hasError = errors.length > 0
                    const triggeredBranchRule = evaluateBranchingRules(component.id)

                    return (
                      <div key={component.id} className={`bg-gray-50 p-6 rounded-lg border ${hasError ? 'border-red-300' : 'border-gray-200'}`}>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          {index + 1}. {component.label}
                          {component.config?.required && <span className="text-red-500 ml-1">*</span>}
                        </label>

                        {component.config?.helpText && (
                          <p className="text-xs text-gray-600 mb-3">{component.config.helpText}</p>
                        )}

                        {component.type === 'text' && (
                          <input
                            type="text"
                            value={previewValues[component.id] || ''}
                            onChange={(e) => handlePreviewValueChange(component.id, e.target.value)}
                            placeholder={component.config?.placeholder || 'Enter text...'}
                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                              hasError ? 'border-red-500' : 'border-gray-300'
                            }`}
                          />
                        )}

                        {component.type === 'number' && (
                          <input
                            type="number"
                            value={previewValues[component.id] || ''}
                            onChange={(e) => handlePreviewValueChange(component.id, e.target.value)}
                            placeholder={component.config?.placeholder || 'Enter number...'}
                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                              hasError ? 'border-red-500' : 'border-gray-300'
                            }`}
                          />
                        )}

                        {component.type === 'textarea' && (
                          <textarea
                            value={previewValues[component.id] || ''}
                            onChange={(e) => handlePreviewValueChange(component.id, e.target.value)}
                            placeholder={component.config?.placeholder || 'Enter text...'}
                            rows={4}
                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                              hasError ? 'border-red-500' : 'border-gray-300'
                            }`}
                          />
                        )}

                        {component.type === 'checkbox' && (
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              checked={previewValues[component.id] || false}
                              onChange={(e) => handlePreviewValueChange(component.id, e.target.checked)}
                              className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                            />
                            <span className="ml-2 text-sm text-gray-600">Check this option</span>
                          </div>
                        )}

                        {component.type === 'radio' && (
                          <div className="space-y-2">
                            {(component.config?.options || ['Option 1', 'Option 2', 'Option 3']).map((option, i) => (
                              <div key={i} className="flex items-center">
                                <input
                                  type="radio"
                                  name={`radio-${component.id}`}
                                  value={option}
                                  checked={previewValues[component.id] === option}
                                  onChange={(e) => handlePreviewValueChange(component.id, e.target.value)}
                                  className="w-4 h-4 text-orange-500 border-gray-300 focus:ring-orange-500"
                                />
                                <span className="ml-2 text-sm text-gray-600">{option}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        {component.type === 'dropdown' && (
                          <select
                            value={previewValues[component.id] || ''}
                            onChange={(e) => handlePreviewValueChange(component.id, e.target.value)}
                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                              hasError ? 'border-red-500' : 'border-gray-300'
                            }`}
                          >
                            <option value="">Select an option</option>
                            {(component.config?.options || ['Option 1', 'Option 2', 'Option 3']).map((option, i) => (
                              <option key={i} value={option}>{option}</option>
                            ))}
                          </select>
                        )}

                        {component.type === 'date' && (
                          <input
                            type="date"
                            value={previewValues[component.id] || ''}
                            onChange={(e) => handlePreviewValueChange(component.id, e.target.value)}
                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                              hasError ? 'border-red-500' : 'border-gray-300'
                            }`}
                          />
                        )}

                        {component.type === 'vas' && (
                          <div>
                            <input
                              type="range"
                              min="0"
                              max="10"
                              value={previewValues[component.id] || 5}
                              onChange={(e) => handlePreviewValueChange(component.id, e.target.value)}
                              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                            />
                            <div className="flex justify-between text-xs text-gray-500 mt-1">
                              <span>0 - No Pain</span>
                              <span className="font-medium text-orange-600">{previewValues[component.id] || 5}</span>
                              <span>10 - Worst Pain</span>
                            </div>
                          </div>
                        )}

                        {component.type === 'image' && (
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-orange-400 transition-colors">
                            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <div className="mt-2">
                              <button
                                type="button"
                                className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                              >
                                <svg className="w-5 h-5 mr-2 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                {component.config?.allowCamera !== false ? 'Take Photo or Upload' : 'Upload Image'}
                              </button>
                            </div>
                            <p className="text-xs text-gray-500 mt-2">
                              {component.config?.acceptedTypes || 'All image types'} • Max {component.config?.maxSize || 5}MB
                              {component.config?.multiple && ' • Multiple files allowed'}
                            </p>
                          </div>
                        )}

                        {component.type === 'file' && (
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-orange-400 transition-colors">
                            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                            <div className="mt-2">
                              <button
                                type="button"
                                className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                              >
                                <svg className="w-5 h-5 mr-2 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                                </svg>
                                Choose File
                              </button>
                            </div>
                            <p className="text-xs text-gray-500 mt-2">
                              {component.config?.acceptedTypes === '*/*' ? 'All file types' : component.config?.acceptedTypes || 'All file types'} • Max {component.config?.maxSize || 10}MB
                              {component.config?.multiple && ' • Multiple files allowed'}
                            </p>
                          </div>
                        )}

                        {/* Show Errors */}
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

                        {/* Show Logic Indicators */}
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
                                {triggeredBranchRule.actionTarget && ` (${canvasComponents.find(c => c.id == triggeredBranchRule.actionTarget)?.label || 'target field'})`}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </form>

                {canvasComponents.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-gray-500">No components added yet</p>
                  </div>
                )}
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
              <button
                onClick={() => setShowPreview(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setShowPreview(false)
                  handleSave()
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg hover:from-orange-600 hover:to-orange-700 transition-colors"
              >
                Save & Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default FormBuilder
