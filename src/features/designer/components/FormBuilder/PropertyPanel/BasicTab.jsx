const BasicTab = ({ component, onUpdateComponent, onUpdateConfig }) => {
  return (
    <div className="space-y-4">
      {/* Label */}
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">Label</label>
        <input
          type="text"
          value={component.label}
          onChange={(e) => onUpdateComponent('label', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>

      {/* Required Field */}
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-2">Required Field</label>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={component.config?.required || false}
            onChange={(e) => onUpdateConfig('required', e.target.checked)}
            className="rounded text-orange-500 focus:ring-orange-500"
          />
          <span className="ml-2 text-sm text-gray-700">This field is required</span>
        </label>
      </div>

      {/* Placeholder Text */}
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">Placeholder Text</label>
        <input
          type="text"
          value={component.config?.placeholder || ''}
          onChange={(e) => onUpdateConfig('placeholder', e.target.value)}
          placeholder="Enter placeholder..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>

      {/* Help Text */}
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">Help Text</label>
        <textarea
          value={component.config?.helpText || ''}
          onChange={(e) => onUpdateConfig('helpText', e.target.value)}
          placeholder="Enter help text..."
          rows={2}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
        />
      </div>

      {/* Default Value - Not for choice-based components */}
      {!['radio', 'dropdown', 'checkbox', 'image', 'file', 'vas'].includes(component.type) && (
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Default Value</label>
          <input
            type={component.type === 'number' ? 'number' : component.type === 'date' ? 'date' : 'text'}
            value={component.config?.defaultValue || ''}
            onChange={(e) => onUpdateConfig('defaultValue', e.target.value)}
            placeholder="Enter default value..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
      )}

      {/* Options for choice-based components */}
      {['radio', 'dropdown', 'checkbox'].includes(component.type) && (
        <OptionsConfig component={component} onUpdateConfig={onUpdateConfig} />
      )}

      {/* Number specific options */}
      {component.type === 'number' && (
        <NumberConfig component={component} onUpdateConfig={onUpdateConfig} />
      )}

      {/* Image specific options */}
      {component.type === 'image' && (
        <ImageConfig component={component} onUpdateConfig={onUpdateConfig} />
      )}

      {/* File specific options */}
      {component.type === 'file' && (
        <FileConfig component={component} onUpdateConfig={onUpdateConfig} />
      )}

      {/* VAS Scale specific options */}
      {component.type === 'vas' && (
        <VASConfig component={component} onUpdateConfig={onUpdateConfig} />
      )}
    </div>
  )
}

const OptionsConfig = ({ component, onUpdateConfig }) => {
  const options = component.config?.options || ['Option 1', 'Option 2', 'Option 3']

  return (
    <div className="border-t border-gray-200 pt-4">
      <div className="flex items-center justify-between mb-2">
        <label className="block text-xs font-medium text-gray-700">Options/Choices</label>
        <button
          onClick={() => onUpdateConfig('options', [...options, `Option ${options.length + 1}`])}
          className="text-xs text-orange-600 hover:text-orange-700 font-medium"
        >
          + Add Option
        </button>
      </div>

      <div className="space-y-2">
        {options.map((option, index) => (
          <div key={index} className="flex items-center gap-2">
            <span className="text-xs text-gray-500 w-6">{index + 1}.</span>
            <input
              type="text"
              value={option}
              onChange={(e) => {
                const newOptions = [...options]
                newOptions[index] = e.target.value
                onUpdateConfig('options', newOptions)
              }}
              className="flex-1 px-3 py-1.5 border border-gray-300 rounded text-xs focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder={`Option ${index + 1}`}
            />
            {options.length > 2 && (
              <button
                onClick={() => {
                  const newOptions = [...options]
                  newOptions.splice(index, 1)
                  onUpdateConfig('options', newOptions)
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
  )
}

const NumberConfig = ({ component, onUpdateConfig }) => (
  <div>
    <label className="block text-xs font-medium text-gray-700 mb-1">Step Value</label>
    <input
      type="number"
      value={component.config?.step || ''}
      onChange={(e) => onUpdateConfig('step', e.target.value)}
      placeholder="1"
      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
    />
    <p className="text-xs text-gray-500 mt-1">Increment/decrement value (e.g., 0.1, 1, 10)</p>
  </div>
)

const ImageConfig = ({ component, onUpdateConfig }) => (
  <div className="space-y-4 border-t border-gray-200 pt-4">
    <div>
      <label className="block text-xs font-medium text-gray-700 mb-1">Accepted File Types</label>
      <select
        value={component.config?.acceptedTypes || 'image/*'}
        onChange={(e) => onUpdateConfig('acceptedTypes', e.target.value)}
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
        value={component.config?.maxSize || 5}
        onChange={(e) => onUpdateConfig('maxSize', e.target.value)}
        placeholder="5"
        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
      />
    </div>

    <div className="flex items-center gap-2">
      <input
        type="checkbox"
        id="allowCamera"
        checked={component.config?.allowCamera !== false}
        onChange={(e) => onUpdateConfig('allowCamera', e.target.checked)}
        className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
      />
      <label htmlFor="allowCamera" className="text-xs text-gray-700">Allow camera capture</label>
    </div>

    <div className="flex items-center gap-2">
      <input
        type="checkbox"
        id="multipleImages"
        checked={component.config?.multiple || false}
        onChange={(e) => onUpdateConfig('multiple', e.target.checked)}
        className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
      />
      <label htmlFor="multipleImages" className="text-xs text-gray-700">Allow multiple images</label>
    </div>
  </div>
)

const FileConfig = ({ component, onUpdateConfig }) => (
  <div className="space-y-4 border-t border-gray-200 pt-4">
    <div>
      <label className="block text-xs font-medium text-gray-700 mb-1">Accepted File Types</label>
      <select
        value={component.config?.acceptedTypes || '*/*'}
        onChange={(e) => onUpdateConfig('acceptedTypes', e.target.value)}
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
        value={component.config?.maxSize || 10}
        onChange={(e) => onUpdateConfig('maxSize', e.target.value)}
        placeholder="10"
        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
      />
    </div>

    <div className="flex items-center gap-2">
      <input
        type="checkbox"
        id="multipleFiles"
        checked={component.config?.multiple || false}
        onChange={(e) => onUpdateConfig('multiple', e.target.checked)}
        className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
      />
      <label htmlFor="multipleFiles" className="text-xs text-gray-700">Allow multiple files</label>
    </div>
  </div>
)

const VASConfig = ({ component, onUpdateConfig }) => {
  // ========== VALUE EXTRACTION ==========
  // Extract values from config with proper defaults
  const vasMin = component.config?.vasMin ?? 0
  const vasMax = component.config?.vasMax ?? 10
  const vasInterval = component.config?.vasInterval // Can be undefined

  // ========== RANGE CALCULATION ==========
  // Calculate the actual range of the scale
  const range = Math.abs(vasMax - vasMin)

  // ========== SUGGESTED INTERVAL LOGIC ==========
  // Calculate smart suggested interval based on range
  const getSuggestedInterval = (rangeValue) => {
    if (rangeValue <= 0) return 1
    if (rangeValue <= 10) return 1
    if (rangeValue <= 20) return 2
    if (rangeValue <= 50) return 5
    if (rangeValue <= 100) return 10
    if (rangeValue <= 200) return 20
    if (rangeValue <= 500) return 50
    if (rangeValue <= 1000) return 100
    // For larger ranges, use range/10 rounded to nearest 10
    return Math.ceil(rangeValue / 100) * 10
  }

  const suggestedInterval = getSuggestedInterval(range)

  // ========== VALIDATION ==========
  // Check if the interval is valid
  const validateInterval = (interval, rangeValue) => {
    if (interval === undefined || interval === null) return { isValid: true, error: null }
    if (interval <= 0) return { isValid: false, error: 'Interval must be greater than 0' }
    if (rangeValue > 0 && interval > rangeValue) {
      return {
        isValid: false,
        error: `Interval (${interval}) cannot be larger than the range (${rangeValue})`
      }
    }
    return { isValid: true, error: null }
  }

  const validation = validateInterval(vasInterval, range)

  // ========== EVENT HANDLERS ==========
  const handleMinChange = (e) => {
    const value = parseFloat(e.target.value)
    onUpdateConfig('vasMin', isNaN(value) ? 0 : value)
  }

  const handleMaxChange = (e) => {
    const value = parseFloat(e.target.value)
    onUpdateConfig('vasMax', isNaN(value) ? 10 : value)
  }

  const handleIntervalChange = (e) => {
    const inputValue = e.target.value.trim()

    // If empty, clear the interval
    if (inputValue === '') {
      onUpdateConfig('vasInterval', undefined)
      return
    }

    // Parse the numeric value
    const numValue = parseFloat(inputValue)

    // Validate and save only if it's a valid positive number
    if (!isNaN(numValue) && numValue > 0) {
      onUpdateConfig('vasInterval', numValue)
    }
  }

  return (
    <div className="space-y-4 border-t border-gray-200 pt-4">
      {/* ========== SCALE RANGE ========== */}
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-2">Scale Range</label>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-gray-600 mb-1">Min Value</label>
            <input
              type="number"
              value={vasMin}
              onChange={handleMinChange}
              step="any"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Max Value</label>
            <input
              type="number"
              value={vasMax}
              onChange={handleMaxChange}
              step="any"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Range: {range} {range !== 10 && '(Default: 0-10)'} • Orientation: Vertical
        </p>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-700 mb-2">Scale Labels</label>
        <div className="space-y-3">
          <div>
            <label className="block text-xs text-gray-600 mb-1">Min Label</label>
            <input
              type="text"
              value={component.config?.vasMinLabel || ''}
              onChange={(e) => onUpdateConfig('vasMinLabel', e.target.value)}
              placeholder="e.g., No Pain"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Max Label</label>
            <input
              type="text"
              value={component.config?.vasMaxLabel || ''}
              onChange={(e) => onUpdateConfig('vasMaxLabel', e.target.value)}
              placeholder="e.g., Worst Pain"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-1">Optional labels to describe min/max values</p>
      </div>

      {/* ========== INTERVAL ========== */}
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-2">Interval</label>
        <input
          type="number"
          value={vasInterval ?? ''}
          onChange={handleIntervalChange}
          step="any"
          min="0.01"
          placeholder={`${suggestedInterval} (suggested for range ${range})`}
          className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors ${
            !validation.isValid ? 'border-red-500 bg-red-50' : 'border-gray-300'
          }`}
        />

        {/* Help Text */}
        <p className="text-xs text-gray-500 mt-1">
          Step size for scale markers. Examples: 1 → (0, 1, 2...), 10 → (0, 10, 20...), 2.5 → (0, 2.5, 5...). Accepts decimals.
        </p>

        {/* Validation Error */}
        {!validation.isValid && (
          <div className="mt-2 p-3 bg-red-50 border border-red-300 rounded-lg animate-shake">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-red-600 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div className="flex-1">
                <p className="text-sm font-semibold text-red-800 mb-1">Invalid Configuration</p>
                <p className="text-sm text-red-700 mb-2">{validation.error}</p>

                <div className="bg-white rounded p-2 border border-red-200 text-xs font-mono space-y-1">
                  <div className="grid grid-cols-2 gap-2">
                    <div>Min Value: <strong>{vasMin}</strong></div>
                    <div>Max Value: <strong>{vasMax}</strong></div>
                    <div>Range: <strong>{range}</strong></div>
                    <div>Interval: <strong className="text-red-600">{vasInterval}</strong></div>
                  </div>
                </div>

                <p className="text-xs text-red-700 mt-2 font-medium">
                  ✓ Solution: Set interval to {suggestedInterval} or less (max: {range})
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default BasicTab
