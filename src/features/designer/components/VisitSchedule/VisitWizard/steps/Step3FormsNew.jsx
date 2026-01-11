import { useState } from 'react'

const Step3FormsNew = ({ visitData, updateField, availableForms }) => {
  const [draggedForm, setDraggedForm] = useState(null)
  const [dragOverColumn, setDragOverColumn] = useState(null)

  const assignedForms = visitData.forms || []
  const unassignedForms = availableForms.filter((form) => !assignedForms.includes(form.id))

  const handleDragStart = (e, form, sourceColumn) => {
    setDraggedForm({ ...form, sourceColumn })
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/html', e.currentTarget)
  }

  const handleDragEnd = () => {
    setDraggedForm(null)
    setDragOverColumn(null)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDragEnter = (column) => {
    setDragOverColumn(column)
  }

  const handleDragLeave = () => {
    setDragOverColumn(null)
  }

  const handleDrop = (e, targetColumn) => {
    e.preventDefault()
    setDragOverColumn(null)

    if (!draggedForm) return

    // Moving from available to assigned
    if (draggedForm.sourceColumn === 'available' && targetColumn === 'assigned') {
      if (!assignedForms.includes(draggedForm.id)) {
        updateField('forms', [...assignedForms, draggedForm.id])
        updateField('formSettings', {
          ...visitData.formSettings,
          [draggedForm.id]: { startDay: 0, duration: 1, required: true }
        })
      }
    }

    // Moving from assigned to available
    if (draggedForm.sourceColumn === 'assigned' && targetColumn === 'available') {
      updateField('forms', assignedForms.filter((id) => id !== draggedForm.id))
      const { [draggedForm.id]: removed, ...rest } = visitData.formSettings
      updateField('formSettings', rest)
    }

    setDraggedForm(null)
  }

  const updateFormSetting = (formId, field, value) => {
    updateField('formSettings', {
      ...visitData.formSettings,
      [formId]: {
        ...visitData.formSettings[formId],
        [field]: value
      }
    })
  }

  return (
    <div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">Assign Forms</h3>
      <p className="text-sm text-gray-500 mb-6">
        Drag forms from the available list to assign them to this visit
      </p>

      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* Left Column: Available Forms */}
        <div
          className={`border-2 rounded-lg transition-all ${
            dragOverColumn === 'available'
              ? 'border-orange-500 bg-orange-50'
              : 'border-gray-300 bg-gray-50'
          }`}
          onDragOver={handleDragOver}
          onDragEnter={() => handleDragEnter('available')}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, 'available')}
        >
          <div className="p-4 bg-gray-100 border-b border-gray-300">
            <h4 className="text-sm font-semibold text-gray-900 flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Available Forms ({unassignedForms.length})
            </h4>
          </div>

          <div className="p-4 space-y-2 min-h-[300px] max-h-[400px] overflow-y-auto">
            {unassignedForms.length > 0 ? (
              unassignedForms.map((form) => (
                <div
                  key={form.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, form, 'available')}
                  onDragEnd={handleDragEnd}
                  className="p-3 bg-white border-2 border-gray-300 rounded-lg cursor-move hover:border-orange-400 hover:shadow-md transition-all group"
                >
                  <div className="flex items-center">
                    <svg
                      className="w-5 h-5 text-gray-400 mr-3 group-hover:text-orange-500 transition-colors"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 8h16M4 16h16"
                      />
                    </svg>
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-gray-900">{form.name}</div>
                      <div className="text-xs text-gray-500">{form.version || 'Version 1.0'}</div>
                    </div>
                    <svg
                      className="w-5 h-5 text-gray-300 group-hover:text-orange-500 transition-colors"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-400">
                <div className="text-center">
                  <svg
                    className="w-12 h-12 mx-auto mb-2 text-gray-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <p className="text-sm">All forms assigned</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Assigned Forms */}
        <div
          className={`border-2 rounded-lg transition-all ${
            dragOverColumn === 'assigned'
              ? 'border-orange-500 bg-orange-50'
              : 'border-gray-300 bg-white'
          }`}
          onDragOver={handleDragOver}
          onDragEnter={() => handleDragEnter('assigned')}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, 'assigned')}
        >
          <div className="p-4 bg-orange-500 border-b border-orange-600">
            <h4 className="text-sm font-semibold text-white flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                />
              </svg>
              Assigned to Visit ({assignedForms.length})
            </h4>
          </div>

          <div className="p-4 space-y-3 min-h-[300px] max-h-[400px] overflow-y-auto">
            {assignedForms.length > 0 ? (
              assignedForms.map((formId) => {
                const form = availableForms.find((f) => f.id === formId)
                if (!form) return null

                const settings = visitData.formSettings[formId] || {
                  startDay: 0,
                  duration: 1,
                  required: true
                }

                return (
                  <div key={formId}>
                    {/* Form Card */}
                    <div
                      draggable
                      onDragStart={(e) => handleDragStart(e, form, 'assigned')}
                      onDragEnd={handleDragEnd}
                      className="p-3 bg-orange-50 border-2 border-orange-300 rounded-lg cursor-move hover:border-orange-500 hover:shadow-md transition-all group"
                    >
                      <div className="flex items-center">
                        <svg
                          className="w-5 h-5 text-orange-400 mr-3 group-hover:text-orange-600 transition-colors"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 8h16M4 16h16"
                          />
                        </svg>
                        <div className="flex-1">
                          <div className="text-sm font-semibold text-gray-900">{form.name}</div>
                          <div className="text-xs text-gray-600">{form.version || 'Version 1.0'}</div>
                        </div>
                        <svg
                          className="w-5 h-5 text-orange-300 group-hover:text-orange-600 transition-colors"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 17l-5-5m0 0l5-5m-5 5h12"
                          />
                        </svg>
                      </div>
                    </div>

                    {/* Form Settings */}
                    <div className="mt-2 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Start Day
                          </label>
                          <input
                            type="number"
                            value={settings.startDay}
                            onChange={(e) => {
                              const value = e.target.value === '' ? 0 : parseInt(e.target.value)
                              updateFormSetting(formId, 'startDay', isNaN(value) ? 0 : value)
                            }}
                            className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:border-orange-500 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Duration (days)
                          </label>
                          <input
                            type="number"
                            min="1"
                            value={settings.duration}
                            onChange={(e) => {
                              const value = e.target.value === '' ? 1 : parseInt(e.target.value)
                              updateFormSetting(formId, 'duration', Math.max(1, isNaN(value) ? 1 : value))
                            }}
                            className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:border-orange-500 focus:outline-none"
                          />
                        </div>
                        <div className="flex items-end">
                          <label className="flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={settings.required !== false}
                              onChange={(e) =>
                                updateFormSetting(formId, 'required', e.target.checked)
                              }
                              className="rounded text-orange-500 focus:ring-orange-500 mr-1.5"
                            />
                            <span className="text-xs font-medium text-gray-700">Required</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-400">
                <div className="text-center">
                  <svg
                    className="w-12 h-12 mx-auto mb-2 text-gray-300"
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
                  <p className="text-sm font-semibold">No forms assigned</p>
                  <p className="text-xs mt-1">Drag forms here to assign</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
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
            <p className="text-sm font-semibold text-blue-900">How to assign forms</p>
            <ul className="text-sm text-blue-800 mt-1 space-y-1">
              <li>• Drag forms from left to right to assign them to this visit</li>
              <li>• Drag forms from right to left to unassign them</li>
              <li>• Customize start day, duration, and required status for each form</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Summary */}
      {assignedForms.length > 0 && (
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
                {assignedForms.length} form{assignedForms.length !== 1 ? 's' : ''} assigned to this
                visit
              </p>
              <p className="text-sm text-green-800 mt-1">
                Forms will be available to participants according to their configured settings
              </p>
            </div>
          </div>
        </div>
      )}

      {availableForms.length === 0 && (
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
  )
}

export default Step3FormsNew
