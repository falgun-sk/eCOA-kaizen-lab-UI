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

export default BasicTab
