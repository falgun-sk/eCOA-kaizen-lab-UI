const LogicTab = ({ component, allComponents, onUpdateConfig }) => {
  return (
    <div className="space-y-4">
      <BranchingLogic
        component={component}
        allComponents={allComponents}
        onUpdateConfig={onUpdateConfig}
      />
    </div>
  )
}

const BranchingLogic = ({ component, allComponents, onUpdateConfig }) => {
  const isEnabled = component.config?.branching?.enabled || false
  const rules = component.config?.branching?.rules || []

  const getConditionOptions = () => {
    if (component.type === 'image' || component.type === 'file') {
      return [
        { value: 'uploaded', label: 'File Uploaded' },
        { value: 'notUploaded', label: 'File Not Uploaded' }
      ]
    }

    const baseOptions = [
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

  const handleToggle = (checked) => {
    onUpdateConfig('branching.enabled', checked)
    if (checked && !component.config?.branching?.rules) {
      onUpdateConfig('branching.rules', [])
    }
  }

  const handleAddRule = () => {
    const newRule = {
      condition: 'equals',
      targetValue: '',
      action: 'skipToField',
      actionTarget: ''
    }
    onUpdateConfig('branching.rules', [...rules, newRule])
  }

  const handleUpdateRule = (index, field, value) => {
    const newRules = [...rules]
    newRules[index] = { ...newRules[index], [field]: value }
    onUpdateConfig('branching.rules', newRules)
  }

  const handleRemoveRule = (index) => {
    const newRules = [...rules]
    newRules.splice(index, 1)
    onUpdateConfig('branching.rules', newRules)
  }

  return (
    <div className="border border-gray-200 rounded-lg p-3">
      <label className="flex items-center mb-3 cursor-pointer select-none">
        <input
          type="checkbox"
          checked={isEnabled}
          onChange={(e) => handleToggle(e.target.checked)}
          className="rounded text-orange-500 focus:ring-orange-500 cursor-pointer"
        />
        <span className="ml-2 text-sm font-medium text-gray-900">Branching Logic</span>
      </label>

      {isEnabled && (
        <div className="pl-6 border-l-2 border-green-200 space-y-3">
          <p className="text-xs text-gray-600">Create multiple conditional paths based on answers</p>

          {/* Existing Rules */}
          {rules.length > 0 && (
            <div className="space-y-2">
              {rules.map((rule, index) => (
                <BranchRule
                  key={index}
                  rule={rule}
                  index={index}
                  component={component}
                  allComponents={allComponents}
                  conditionOptions={getConditionOptions()}
                  onUpdate={(field, value) => handleUpdateRule(index, field, value)}
                  onRemove={() => handleRemoveRule(index)}
                />
              ))}
            </div>
          )}

          {/* Add Rule Button */}
          <button
            onClick={handleAddRule}
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
  )
}

const BranchRule = ({ rule, index, component, allComponents, conditionOptions, onUpdate, onRemove }) => {
  const showValueInput = !['uploaded', 'notUploaded'].includes(rule.condition)
  const showSecondValue = ['between', 'notBetween'].includes(rule.condition)
  const showTargetField = ['skipToField', 'showField', 'hideField'].includes(rule.action)

  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
      <div className="flex items-start justify-between mb-2">
        <span className="text-xs font-semibold text-green-900">Branch {index + 1}</span>
        <button onClick={onRemove} className="text-red-600 hover:text-red-800">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>

      <div className="space-y-2">
        {/* Condition */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">When answer</label>
          <select
            value={rule.condition || 'equals'}
            onChange={(e) => onUpdate('condition', e.target.value)}
            className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            {conditionOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>

        {/* Value Input */}
        {showValueInput && (
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              {showSecondValue ? 'First Value' : 'Value'}
            </label>
            <input
              type="text"
              value={rule.targetValue || ''}
              onChange={(e) => onUpdate('targetValue', e.target.value)}
              placeholder="Enter value..."
              className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
        )}

        {/* Second Value for between/notBetween */}
        {showSecondValue && (
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Second Value</label>
            <input
              type="text"
              value={rule.targetValue2 || ''}
              onChange={(e) => onUpdate('targetValue2', e.target.value)}
              placeholder="Enter second value..."
              className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
        )}

        {/* Action */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Then</label>
          <select
            value={rule.action || 'skipToField'}
            onChange={(e) => onUpdate('action', e.target.value)}
            className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="skipToField">Skip to field</option>
            <option value="showField">Show field</option>
            <option value="hideField">Hide field</option>
            <option value="endForm">End form</option>
          </select>
        </div>

        {/* Target Field */}
        {showTargetField && (
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Target field</label>
            <select
              value={rule.actionTarget || ''}
              onChange={(e) => onUpdate('actionTarget', e.target.value)}
              className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="">Select field...</option>
              {allComponents
                .filter(c => c.id !== component.id)
                .map(c => (
                  <option key={c.id} value={c.id}>{c.label}</option>
                ))}
            </select>
          </div>
        )}
      </div>
    </div>
  )
}

export default LogicTab
