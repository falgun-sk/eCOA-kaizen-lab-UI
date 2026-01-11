const Step3Forms = ({ visitData, updateField, availableForms }) => {
  const toggleForm = (formId) => {
    const isAssigned = visitData.forms.includes(formId)
    const updatedForms = isAssigned
      ? visitData.forms.filter((f) => f !== formId)
      : [...visitData.forms, formId]

    updateField('forms', updatedForms)

    // Update form settings
    if (!isAssigned) {
      updateField('formSettings', {
        ...visitData.formSettings,
        [formId]: { startDay: 0, duration: 7, required: true }
      })
    } else {
      const { [formId]: removed, ...rest } = visitData.formSettings
      updateField('formSettings', rest)
    }
  }

  return (
    <div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">Assign Forms</h3>
      <p className="text-sm text-gray-500 mb-6">
        Select which forms should be completed at this visit
      </p>

      <div className="space-y-3">
        {availableForms.length > 0 ? (
          <>
            {availableForms.map((form) => {
              const isChecked = visitData.forms.includes(form.id)
              return (
                <label
                  key={form.id}
                  className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    isChecked
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-gray-300 hover:border-orange-300 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleForm(form.id)}
                    className="w-5 h-5 rounded text-orange-500 focus:ring-orange-500 focus:ring-2"
                  />
                  <div className="ml-3 flex-1">
                    <div className="text-sm font-semibold text-gray-900">{form.name}</div>
                    <div className="text-xs text-gray-500">{form.version || 'Version 1.0'}</div>
                  </div>
                  {isChecked && (
                    <svg
                      className="w-5 h-5 text-orange-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </label>
              )
            })}

            {/* Summary */}
            {visitData.forms.length > 0 ? (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-start">
                  <svg
                    className="w-5 h-5 text-green-600 mt-0.5 mr-3 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div>
                    <p className="text-sm font-semibold text-green-900">
                      {visitData.forms.length} form{visitData.forms.length !== 1 ? 's' : ''}{' '}
                      selected
                    </p>
                    <p className="text-sm text-green-800 mt-1">
                      Forms will be available on the visit day for 7 days by default
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
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
                    <p className="text-sm font-semibold text-blue-900">No forms selected</p>
                    <p className="text-sm text-blue-800 mt-1">
                      You can assign forms later if needed
                    </p>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-1">No Forms Available</h4>
            <p className="text-sm text-gray-500 mb-4">
              Create forms in the Form Builder first, then assign them to visits
            </p>
          </div>
        )}
      </div>

      {/* Optional: Advanced Form Configuration Preview */}
      {visitData.forms.length > 0 && (
        <details className="mt-6 border-2 border-gray-200 rounded-lg">
          <summary className="px-4 py-3 cursor-pointer hover:bg-gray-50 font-semibold text-sm text-gray-700">
            Advanced: Customize form timing (optional)
          </summary>
          <div className="px-4 py-4 border-t space-y-3 bg-gray-50">
            <p className="text-xs text-gray-600 mb-3">
              By default, forms are available on the visit day for 7 days. Customize per form if needed.
            </p>
            {visitData.forms.map((formId) => {
              const form = availableForms.find((f) => f.id === formId)
              if (!form) return null

              const settings = visitData.formSettings[formId] || {
                startDay: 0,
                duration: 7,
                required: true
              }

              return (
                <div key={formId} className="p-3 bg-white rounded-lg border border-gray-200">
                  <p className="text-sm font-medium text-gray-900 mb-2">{form.name}</p>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Start Day</label>
                      <input
                        type="number"
                        value={settings.startDay}
                        onChange={(e) =>
                          updateField('formSettings', {
                            ...visitData.formSettings,
                            [formId]: { ...settings, startDay: parseInt(e.target.value) || 0 }
                          })
                        }
                        className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:border-orange-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Duration (days)</label>
                      <input
                        type="number"
                        value={settings.duration}
                        onChange={(e) =>
                          updateField('formSettings', {
                            ...visitData.formSettings,
                            [formId]: { ...settings, duration: parseInt(e.target.value) || 7 }
                          })
                        }
                        className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:border-orange-500 focus:outline-none"
                      />
                    </div>
                    <div className="flex items-end">
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.required !== false}
                          onChange={(e) =>
                            updateField('formSettings', {
                              ...visitData.formSettings,
                              [formId]: { ...settings, required: e.target.checked }
                            })
                          }
                          className="rounded text-orange-500 focus:ring-orange-500 mr-1"
                        />
                        <span className="text-xs text-gray-700">Required</span>
                      </label>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </details>
      )}
    </div>
  )
}

export default Step3Forms
