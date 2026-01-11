import { useState } from 'react'
import { validateCondition } from '../../conditionEvaluator'

const Step5Conditions = ({ visitData, updateField, availableForms, visits }) => {
  const [showAddCondition, setShowAddCondition] = useState(false)

  const conditions = visitData.conditions || []

  // Field type icons for better visual scanning
  const getFieldIcon = (type) => {
    const icons = {
      number: '🔢',
      vas: '🎚️',
      text: '📝',
      select: '📋',
      dropdown: '📋',
      radio: '⚪'
    }
    return icons[type] || '📄'
  }

  // Get completion percentage for a condition
  const getConditionCompletion = (condition) => {
    let filled = 0
    let total = 5
    if (condition.sourceVisit) filled++
    if (condition.sourceForm) filled++
    if (condition.sourceField) filled++
    if (condition.operator) filled++
    if (condition.value) filled++
    if (condition.operator === 'BETWEEN' && condition.valueMax) {
      total = 6
      filled++
    }
    return Math.round((filled / total) * 100)
  }

  const addCondition = () => {
    const newCondition = {
      id: Date.now(),
      sourceVisit: '',
      sourceForm: '',
      sourceField: '',
      operator: '>',
      value: '',
      valueMax: '', // For BETWEEN operator
      logicOperator: conditions.length > 0 ? 'AND' : null
    }

    updateField('conditions', [...conditions, newCondition])
    setShowAddCondition(false)
  }

  const updateCondition = (conditionId, updates) => {
    const updatedConditions = conditions.map((c) => {
      if (c.id === conditionId) {
        return { ...c, ...updates }
      }
      return c
    })
    updateField('conditions', updatedConditions)
  }

  const removeCondition = (conditionId) => {
    updateField('conditions', conditions.filter((c) => c.id !== conditionId))
  }

  const getFormFields = (formId) => {
    if (!formId) return []
    const form = availableForms.find((f) => f.id === formId)
    if (!form) return []

    // Forms use 'components' array, not 'fields'
    const fields = form.components || form.fields || []
    return fields.filter((field) =>
      ['number', 'text', 'select', 'radio', 'dropdown', 'vas'].includes(field.type)
    )
  }

  const getFieldType = (formId, fieldId) => {
    if (!formId || !fieldId) return null
    const fields = getFormFields(formId)
    const field = fields.find((f) => f.id === fieldId)
    return field?.type || null
  }

  const getOperatorsForFieldType = (fieldType) => {
    // Numeric fields: all operators including BETWEEN
    if (['number', 'vas'].includes(fieldType)) {
      return [
        { value: '>', label: '> is greater than', symbol: '>' },
        { value: '>=', label: '≥ is greater than or equal to', symbol: '≥' },
        { value: '<', label: '< is less than', symbol: '<' },
        { value: '<=', label: '≤ is less than or equal to', symbol: '≤' },
        { value: '==', label: '= equals', symbol: '=' },
        { value: '!=', label: '≠ does not equal', symbol: '≠' },
        { value: 'BETWEEN', label: '⟺ is between (range)', symbol: '⟺' }
      ]
    }

    // Text fields: only equality operators
    if (fieldType === 'text') {
      return [
        { value: '==', label: '= equals', symbol: '=' },
        { value: '!=', label: '≠ does not equal', symbol: '≠' }
      ]
    }

    // Select/Radio/Dropdown: only equality operators
    if (['select', 'radio', 'dropdown'].includes(fieldType)) {
      return [
        { value: '==', label: '= equals', symbol: '=' },
        { value: '!=', label: '≠ does not equal', symbol: '≠' }
      ]
    }

    // Default: basic operators
    return [
      { value: '==', label: '= equals', symbol: '=' },
      { value: '!=', label: '≠ does not equal', symbol: '≠' }
    ]
  }

  const getVisitForms = (visitId) => {
    if (!visitId) return []
    const visit = visits.find((v) => v.id === visitId)
    if (!visit || !visit.forms) return []

    // Handle both number and string form IDs
    return visit.forms
      .map((formId) => {
        const normalizedFormId = typeof formId === 'string' ? parseInt(formId) : formId
        return availableForms.find((f) => f.id === normalizedFormId)
      })
      .filter(Boolean)
  }

  return (
    <div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">Conditional Logic (Optional)</h3>
      <p className="text-sm text-gray-500 mb-6">
        Set conditions that determine when this visit should occur based on previous data
      </p>

      {/* Info Banner */}
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start">
          <svg
            className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
          <div>
            <p className="text-sm font-semibold text-blue-900">Optional: Add branching logic</p>
            <p className="text-sm text-blue-800 mt-1">
              Define conditions based on form responses from earlier visits. For example: "Only
              schedule this visit if Patient Score from Visit 1 is greater than 50"
            </p>
          </div>
        </div>
      </div>

      {/* Conditions List */}
      <div className="space-y-0">
        {conditions.length > 0 ? (
          <>
            {conditions.map((condition, index) => (
              <div key={condition.id}>
                {/* Logic Operator (AND/OR) - shown between conditions */}
                {index > 0 && (
                  <div className="relative">
                    {/* AND/OR Selector with inline explanation */}
                    <div className={`flex items-center gap-4 py-3 px-6 ${
                      condition.logicOperator === 'OR' ? 'bg-purple-50 border-l-4 border-purple-400' : 'bg-blue-50 border-l-4 border-blue-400'
                    }`}>
                      {/* Operator Buttons */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => updateCondition(condition.id, { logicOperator: 'AND' })}
                          className={`px-3 py-1.5 text-xs font-bold rounded transition-all ${
                            condition.logicOperator === 'AND' || !condition.logicOperator
                              ? 'bg-blue-500 text-white shadow-sm'
                              : 'bg-white text-gray-500 border border-gray-300 hover:border-blue-300'
                          }`}
                        >
                          AND
                        </button>
                        <button
                          onClick={() => updateCondition(condition.id, { logicOperator: 'OR' })}
                          className={`px-3 py-1.5 text-xs font-bold rounded transition-all ${
                            condition.logicOperator === 'OR'
                              ? 'bg-purple-500 text-white shadow-sm'
                              : 'bg-white text-gray-500 border border-gray-300 hover:border-purple-300'
                          }`}
                        >
                          OR
                        </button>
                      </div>

                      {/* Inline Explanation */}
                      <div className="flex-1 text-xs">
                        {condition.logicOperator === 'OR' ? (
                          <p className="text-purple-700">
                            <span className="font-semibold">Either</span> the condition above{' '}
                            <span className="font-semibold">OR</span> this one must be true
                          </p>
                        ) : (
                          <p className="text-blue-700">
                            <span className="font-semibold">Both</span> the condition above{' '}
                            <span className="font-semibold">AND</span> this one must be true
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Condition Card - World-Class */}
                <div className="group bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md hover:border-gray-300 transition-all duration-200 animate-fadeIn">
                  <div className="p-4">
                    {/* Header with Progress */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {/* Completion indicator */}
                        <div className="relative w-8 h-8 flex items-center justify-center">
                          <svg className="w-8 h-8 transform -rotate-90">
                            <circle cx="16" cy="16" r="14" fill="none" stroke="#E5E7EB" strokeWidth="2"/>
                            <circle
                              cx="16" cy="16" r="14" fill="none"
                              stroke={getConditionCompletion(condition) === 100 ? "#10B981" : "#F97316"}
                              strokeWidth="2"
                              strokeDasharray={`${getConditionCompletion(condition) * 0.88} 88`}
                              className="transition-all duration-300"
                            />
                          </svg>
                          <span className="absolute text-[10px] font-bold text-gray-700">{index + 1}</span>
                        </div>

                        {/* Title with status badge */}
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-gray-900">Condition {index + 1}</span>
                            {getConditionCompletion(condition) === 100 ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium text-green-700 bg-green-50 rounded-full border border-green-200">
                                <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                                </svg>
                                Complete
                              </span>
                            ) : (
                              <span className="text-[10px] font-medium text-gray-400">
                                {getConditionCompletion(condition)}% complete
                              </span>
                            )}
                          </div>

                          {/* Live Preview - Compact */}
                          {condition.sourceVisit && condition.sourceForm && condition.sourceField && condition.value &&
                           (condition.operator !== 'BETWEEN' || condition.valueMax) && (
                            <div className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                              <span className="opacity-60">
                                {visits.find((v) => v.id === condition.sourceVisit)?.name} →
                                {availableForms.find((f) => f.id === condition.sourceForm)?.name} →
                                {(() => {
                                  const field = getFormFields(condition.sourceForm).find((f) => f.id === condition.sourceField)
                                  return field?.label || field?.text || 'Field'
                                })()}
                              </span>
                              <span className="font-semibold text-orange-600">
                                {condition.operator === 'BETWEEN'
                                  ? `${condition.value}-${condition.valueMax}`
                                  : `${getOperatorsForFieldType(getFieldType(condition.sourceForm, condition.sourceField))
                                      .find(op => op.value === condition.operator)?.symbol || condition.operator} ${condition.value}`
                                }
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => removeCondition(condition.id)}
                          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                          title="Delete condition (Del)"
                          aria-label="Delete condition"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                          </svg>
                        </button>
                      </div>
                    </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {/* Source Visit */}
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1.5">
                        From Visit <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={condition.sourceVisit || ''}
                        onChange={(e) => {
                          const visitId = parseInt(e.target.value) || ''
                          updateCondition(condition.id, {
                            sourceVisit: visitId,
                            sourceForm: '',
                            sourceField: ''
                          })
                        }}
                        className={`w-full px-3 py-2 text-sm border-2 rounded-lg transition-all duration-150 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-1 ${
                          condition.sourceVisit ? 'border-gray-300 hover:border-gray-400' : 'border-gray-300 hover:border-orange-400'
                        }`}
                      >
                        <option value="">Select visit...</option>
                        {visits && visits.length > 0 && visits
                          .filter((v) => v.id !== visitData.id)
                          .map((visit) => (
                            <option key={visit.id} value={visit.id}>
                              {visit.name}
                            </option>
                          ))}
                      </select>
                      {condition.sourceVisit && (
                        <p className="mt-1 text-xs text-green-600 flex items-center gap-1">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                          </svg>
                          Selected
                        </p>
                      )}
                    </div>

                    {/* Source Form */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Form <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={condition.sourceForm || ''}
                        onChange={(e) => {
                          const formId = parseInt(e.target.value) || ''
                          updateCondition(condition.id, {
                            sourceForm: formId,
                            sourceField: ''
                          })
                        }}
                        disabled={!condition.sourceVisit}
                        className="w-full px-3 py-2 text-sm border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                      >
                        <option value="">Select form...</option>
                        {getVisitForms(condition.sourceVisit).map((form) => (
                          <option key={form.id} value={form.id}>
                            {form.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Source Field */}
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1.5">
                        Field <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={condition.sourceField || ''}
                        onChange={(e) => {
                          const fieldId = parseInt(e.target.value) || ''
                          const fieldType = getFieldType(condition.sourceForm, fieldId)

                          // Reset operator if current operator is not valid for new field type
                          const availableOps = getOperatorsForFieldType(fieldType)
                          const currentOpValid = availableOps.some(op => op.value === condition.operator)

                          updateCondition(condition.id, {
                            sourceField: fieldId,
                            operator: currentOpValid ? condition.operator : availableOps[0]?.value || '=='
                          })
                        }}
                        disabled={!condition.sourceForm}
                        className={`w-full px-3 py-2 text-sm border-2 rounded-lg transition-all duration-150 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-1 ${
                          !condition.sourceForm
                            ? 'bg-gray-50 border-gray-200 cursor-not-allowed text-gray-400'
                            : condition.sourceField
                            ? 'border-gray-300 hover:border-gray-400'
                            : 'border-gray-300 hover:border-orange-400'
                        }`}
                      >
                        <option value="">Select field...</option>
                        {getFormFields(condition.sourceForm).map((field) => (
                          <option key={field.id} value={field.id}>
                            {getFieldIcon(field.type)} {field.label || field.text || field.placeholder || `Field ${field.id}`} · {field.type}
                          </option>
                        ))}
                      </select>
                      {condition.sourceField && (
                        <p className="mt-1 text-xs text-green-600 flex items-center gap-1">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                          </svg>
                          Selected
                        </p>
                      )}
                    </div>

                    {/* Operator */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Operator <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={condition.operator}
                        onChange={(e) => updateCondition(condition.id, { operator: e.target.value })}
                        disabled={!condition.sourceField}
                        className="w-full px-3 py-2 text-sm border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                      >
                        {getOperatorsForFieldType(getFieldType(condition.sourceForm, condition.sourceField)).map((op) => (
                          <option key={op.value} value={op.value}>
                            {op.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Value(s) */}
                    {condition.operator === 'BETWEEN' ? (
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">
                            Min Value <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={condition.value}
                            onChange={(e) => updateCondition(condition.id, { value: e.target.value })}
                            placeholder="e.g., 30"
                            className="w-full px-3 py-2 text-sm border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">
                            Max Value <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={condition.valueMax || ''}
                            onChange={(e) => updateCondition(condition.id, { valueMax: e.target.value })}
                            placeholder="e.g., 70"
                            className="w-full px-3 py-2 text-sm border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none"
                          />
                        </div>
                      </div>
                    ) : (
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                          Value <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={condition.value}
                          onChange={(e) => updateCondition(condition.id, { value: e.target.value })}
                          placeholder="e.g., 50"
                          className="w-full px-3 py-2 text-sm border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none"
                        />
                      </div>
                    )}
                  </div>
                  {/* End grid */}

                  {/* Validation Messages Only */}
                  {condition.sourceVisit && condition.sourceForm && condition.sourceField && condition.value && (
                    <>
                      {(() => {
                        const validation = validateCondition(condition)
                        const isBetweenRangeError = condition.operator === 'BETWEEN' &&
                          condition.value && condition.valueMax &&
                          parseFloat(condition.value) >= parseFloat(condition.valueMax)

                        if (!validation.valid || isBetweenRangeError) {
                          return (
                            <div className="mt-3 p-3 bg-red-50 border-l-4 border-red-500 rounded">
                              <div className="flex items-start">
                                <svg className="w-5 h-5 text-red-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                                <div>
                                  <p className="text-sm font-semibold text-red-800">Validation Error</p>
                                  <p className="text-xs text-red-700 mt-1">
                                    {isBetweenRangeError
                                      ? 'Min value must be less than max value'
                                      : validation.errors[0]
                                    }
                                  </p>
                                </div>
                              </div>
                            </div>
                          )
                        }
                        return null
                      })()}
                    </>
                  )}
                  </div>
                </div>
              </div>
            ))}

            {/* Add Another Condition Button */}
            <button
              onClick={addCondition}
              className="w-full mt-4 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-sm font-medium text-gray-600 hover:border-orange-500 hover:text-orange-600 hover:bg-orange-50 transition-all"
            >
              <svg
                className="w-4 h-4 inline-block mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Add Another Condition
            </button>
          </>
        ) : (
          /* Empty State - No Conditions */
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-1">No Conditions Set</h4>
            <p className="text-sm text-gray-500 mb-4">
              This visit will always occur. Add conditions to create branching logic.
            </p>
            <button
              onClick={addCondition}
              className="inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-semibold rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all shadow-md"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Add First Condition
            </button>
          </div>
        )}
      </div>

      {/* Simple Summary */}
      {conditions.length > 0 && (
        <div className="mt-6 p-4 bg-green-50 border-l-4 border-green-500 rounded">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="text-sm font-semibold text-green-900">
                {conditions.length} condition{conditions.length !== 1 ? 's' : ''} configured
              </p>
              <p className="text-xs text-green-700 mt-1">
                {(() => {
                  const hasOr = conditions.some((c, i) => i > 0 && c.logicOperator === 'OR')
                  if (hasOr) {
                    return 'This visit will occur if at least one of the condition groups above is satisfied'
                  }
                  return 'This visit will occur only when all conditions above are satisfied'
                })()}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Step5Conditions
