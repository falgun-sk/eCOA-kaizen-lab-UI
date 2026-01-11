import { useState } from 'react'

/**
 * MobileFormPreview Component
 *
 * A reusable mobile phone frame preview component for forms
 * Shows forms exactly as users will see them on mobile devices
 *
 * @param {Object} form - The form object to preview
 * @param {boolean} isOpen - Whether the modal is open
 * @param {function} onClose - Callback to close the modal
 */
const MobileFormPreview = ({ form, isOpen, onClose }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [formValues, setFormValues] = useState({})
  const [isCompleted, setIsCompleted] = useState(false)

  if (!isOpen || !form) return null

  const handleInputChange = (componentId, value) => {
    setFormValues(prev => ({
      ...prev,
      [componentId]: value
    }))
  }

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  const handleNextQuestion = () => {
    if (form && currentQuestionIndex < form.components.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    } else if (currentQuestionIndex === form.components.length - 1) {
      // Form completed - show completion screen
      setIsCompleted(true)
    }
  }

  const handleClose = () => {
    setCurrentQuestionIndex(0)
    setFormValues({})
    setIsCompleted(false)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 overflow-y-auto">
      {/* Close Button */}
      <button
        onClick={handleClose}
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
                      <h3 className="text-sm font-semibold">{form.name}</h3>
                      <p className="text-xs text-orange-100">Clinical Study</p>
                    </div>
                  </div>
                </div>
              </div>

              {isCompleted ? (
                /* Completion Screen */
                <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
                  <div className="text-center">
                    {/* Success Icon */}
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-6">
                      <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>

                    {/* Success Message */}
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">Form Completed!</h2>
                    <p className="text-gray-600 mb-2">Thank you for completing this form.</p>
                    <p className="text-sm text-gray-500 mb-8">Your responses have been recorded.</p>

                    {/* Submission Details */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-6">
                      <div className="text-sm text-gray-700">
                        <div className="flex justify-between mb-2">
                          <span className="font-medium">Form:</span>
                          <span>{form.name}</span>
                        </div>
                        <div className="flex justify-between mb-2">
                          <span className="font-medium">Questions:</span>
                          <span>{form.components.length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">Completed:</span>
                          <span>{new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      </div>
                    </div>

                    {/* Close Button */}
                    <button
                      onClick={handleClose}
                      className="w-full inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-md"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Close Preview
                    </button>
                  </div>
                </div>
              ) : form.components && form.components.length > 0 ? (
                <>
                  {/* Progress Bar */}
                  <div className="px-5 pt-4 pb-3 bg-white">
                    <div className="flex items-center justify-between mb-3 text-xs font-medium text-gray-600">
                      <span className="flex items-center space-x-1">
                        <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span>Question {currentQuestionIndex + 1}/{form.components.length}</span>
                      </span>
                      <span className="px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full text-xs font-semibold">
                        {Math.round(((currentQuestionIndex + 1) / form.components.length) * 100)}% Complete
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 shadow-inner">
                      <div
                        className="bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 h-2.5 rounded-full transition-all duration-500 shadow-sm"
                        style={{ width: `${((currentQuestionIndex + 1) / form.components.length) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Question Content */}
                  <div className="flex-1 px-6 py-6 overflow-y-auto">
                    {(() => {
                      const component = form.components[currentQuestionIndex];
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

                          {/* Text Input */}
                          {component.type === 'text' && (
                            <input
                              type="text"
                              value={formValues[component.id] || ''}
                              onChange={(e) => handleInputChange(component.id, e.target.value)}
                              placeholder={component.config?.placeholder || 'Enter text...'}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            />
                          )}

                          {/* Number Input */}
                          {component.type === 'number' && (
                            <input
                              type="number"
                              value={formValues[component.id] || ''}
                              onChange={(e) => handleInputChange(component.id, e.target.value)}
                              placeholder={component.config?.placeholder || 'Enter number...'}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            />
                          )}

                          {/* Textarea */}
                          {component.type === 'textarea' && (
                            <textarea
                              value={formValues[component.id] || ''}
                              onChange={(e) => handleInputChange(component.id, e.target.value)}
                              placeholder={component.config?.placeholder || 'Enter text...'}
                              rows={4}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            />
                          )}

                          {/* Checkbox */}
                          {component.type === 'checkbox' && (
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                checked={formValues[component.id] || false}
                                onChange={(e) => handleInputChange(component.id, e.target.checked)}
                                className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                              />
                              <span className="ml-2 text-sm text-gray-700">Check this option</span>
                            </div>
                          )}

                          {/* Radio Buttons */}
                          {component.type === 'radio' && (
                            <div className="space-y-2">
                              {(component.config?.options || ['Option 1', 'Option 2', 'Option 3']).map((option, i) => (
                                <div key={i} className="flex items-center">
                                  <input
                                    type="radio"
                                    name={`radio-${component.id}`}
                                    value={option}
                                    checked={formValues[component.id] === option}
                                    onChange={(e) => handleInputChange(component.id, e.target.value)}
                                    className="w-4 h-4 text-orange-500 border-gray-300 focus:ring-orange-500"
                                  />
                                  <span className="ml-2 text-sm text-gray-700">{option}</span>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Dropdown */}
                          {component.type === 'dropdown' && (
                            <select
                              value={formValues[component.id] || ''}
                              onChange={(e) => handleInputChange(component.id, e.target.value)}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white"
                            >
                              <option value="">Select an option...</option>
                              {(component.config?.options || ['Option 1', 'Option 2', 'Option 3']).map((option, i) => (
                                <option key={i} value={option}>{option}</option>
                              ))}
                            </select>
                          )}

                          {/* Date Picker */}
                          {component.type === 'date' && (
                            <input
                              type="date"
                              value={formValues[component.id] || ''}
                              onChange={(e) => handleInputChange(component.id, e.target.value)}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            />
                          )}

                          {/* VAS Scale */}
                          {component.type === 'vas' && (
                            <div className="flex items-center justify-center gap-6 py-4">
                              <div className="flex flex-col items-center bg-white rounded-xl border border-gray-200 p-4">
                                <div className="text-sm font-semibold text-gray-900 mb-3">10</div>
                                <input
                                  type="range"
                                  min="0"
                                  max="10"
                                  value={formValues[component.id] !== undefined ? formValues[component.id] : 5}
                                  onChange={(e) => handleInputChange(component.id, e.target.value)}
                                  orient="vertical"
                                  className="h-32 cursor-pointer"
                                  style={{
                                    writingMode: 'bt-lr',
                                    WebkitAppearance: 'slider-vertical',
                                    width: '8px'
                                  }}
                                />
                                <div className="text-sm font-semibold text-gray-900 mt-3">0</div>
                              </div>
                              <div className="flex flex-col items-center justify-center min-w-[80px] p-3 bg-orange-50 rounded-xl border border-orange-200">
                                <div className="text-xs font-medium text-gray-500 mb-1">Value</div>
                                <div className="text-2xl font-bold text-orange-600">{formValues[component.id] !== undefined ? formValues[component.id] : 5}</div>
                              </div>
                            </div>
                          )}

                          {/* Image Capture */}
                          {component.type === 'image' && (
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              <p className="mt-2 text-sm text-gray-500">Camera/Upload Image</p>
                            </div>
                          )}

                          {/* File Upload */}
                          {component.type === 'file' && (
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                              </svg>
                              <p className="mt-2 text-sm text-gray-500">Choose File</p>
                            </div>
                          )}
                        </div>
                      );
                    })()}
                  </div>

                  {/* Navigation Buttons */}
                  <div className="px-6 py-4 border-t-2 border-gray-200 bg-white">
                    <div className="flex items-center justify-between gap-3 mb-4">
                      <button
                        onClick={handlePreviousQuestion}
                        disabled={currentQuestionIndex === 0}
                        className={`flex-1 inline-flex items-center justify-center px-4 py-3 border-2 rounded-xl font-semibold transition-all duration-200 ${
                          currentQuestionIndex === 0
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
                        onClick={handleNextQuestion}
                        className={`flex-1 inline-flex items-center justify-center px-4 py-3 rounded-xl font-semibold transition-all duration-200 ${
                          currentQuestionIndex === form.components.length - 1
                            ? 'bg-green-500 hover:bg-green-600 text-white border-2 border-green-500 hover:border-green-600'
                            : 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white border-2 border-transparent'
                        } active:scale-95`}
                      >
                        {currentQuestionIndex === form.components.length - 1 ? (
                          <>
                            Complete
                            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </>
                        ) : (
                          <>
                            Next
                            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Progress Dots */}
                    <div className="flex items-center justify-center gap-2">
                      {form.components.map((_, index) => (
                        <div
                          key={index}
                          className={`h-2 rounded-full transition-all duration-300 ${
                            index === currentQuestionIndex
                              ? 'w-8 bg-orange-500'
                              : index < currentQuestionIndex
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
                  <p>This form has no components yet</p>
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

export default MobileFormPreview
