import { useNavigate, useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Modal from '../../../shared/components/Modal'
import toast from 'react-hot-toast'

const EditFormSelection = () => {
  const navigate = useNavigate()
  const { studyId } = useParams()
  const [forms, setForms] = useState([])
  const [study, setStudy] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPreviewModal, setShowPreviewModal] = useState(false)
  const [previewForm, setPreviewForm] = useState(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [formValues, setFormValues] = useState({})
  const [isCompleted, setIsCompleted] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [formToDelete, setFormToDelete] = useState(null)

  useEffect(() => {
    // Load forms from localStorage
    const savedForms = localStorage.getItem(`study-${studyId}-forms`)
    if (savedForms) {
      setForms(JSON.parse(savedForms))
    }

    // Load study data
    const savedStudy = localStorage.getItem(`study-${studyId}`)
    if (savedStudy) {
      setStudy(JSON.parse(savedStudy))
    }
  }, [studyId])

  const handlePreviewForm = (form) => {
    setPreviewForm(form)
    setCurrentQuestionIndex(0)
    setFormValues({})
    setIsCompleted(false)
    setShowPreviewModal(true)
  }

  const handleNextQuestion = () => {
    if (previewForm && currentQuestionIndex < previewForm.components.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    } else if (currentQuestionIndex === previewForm.components.length - 1) {
      // Form completed - show completion screen
      setIsCompleted(true)
    }
  }

  const handleClosePreview = () => {
    setShowPreviewModal(false)
    setCurrentQuestionIndex(0)
    setFormValues({})
    setIsCompleted(false)
  }

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  const handleInputChange = (componentId, value) => {
    setFormValues(prev => ({
      ...prev,
      [componentId]: value
    }))
  }

  const handleDeleteForm = (formId, formName) => {
    setFormToDelete({ id: formId, name: formName })
    setShowDeleteModal(true)
  }

  const confirmDeleteForm = () => {
    if (!formToDelete) return

    // Remove form from the list
    const updatedForms = forms.filter(f => f.id !== formToDelete.id)
    setForms(updatedForms)

    // Update localStorage
    localStorage.setItem(`study-${studyId}-forms`, JSON.stringify(updatedForms))

    // Also check and update visit schedule if this form was assigned
    const savedVisits = localStorage.getItem(`study-${studyId}-visits`)
    if (savedVisits) {
      const visits = JSON.parse(savedVisits)
      const updatedVisits = visits.map(visit => ({
        ...visit,
        forms: visit.forms.filter(id => id !== formToDelete.id)
      }))
      localStorage.setItem(`study-${studyId}-visits`, JSON.stringify(updatedVisits))
    }

    toast.success(`Form "${formToDelete.name}" deleted successfully`)
    setShowDeleteModal(false)
    setFormToDelete(null)
  }

  const getNextStatus = (currentStatus) => {
    const statusFlow = {
      'Design': 'Review',
      'Review': 'UAT',
      'UAT': 'Approved',
      'Approved': null
    }
    return statusFlow[currentStatus] || null
  }

  const handleStatusChange = (newStatus) => {
    if (!study) return

    setIsSubmitting(true)

    setTimeout(() => {
      const updatedStudy = { ...study, status: newStatus }
      localStorage.setItem(`study-${studyId}`, JSON.stringify(updatedStudy))
      setStudy(updatedStudy)
      setIsSubmitting(false)
      navigate(`/designer/studies/${studyId}`)
    }, 500)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate(`/designer/studies/${studyId}`)}
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Study
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Edit Existing Form</h1>
            <p className="text-sm text-gray-500 mt-1">
              {forms.length === 0 ? 'No forms added yet' : `${forms.length} form${forms.length !== 1 ? 's' : ''} in this study`}
            </p>
          </div>
        </div>

        {/* Forms List */}
        {forms.length > 0 ? (
          <div>
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Form Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Version
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Components
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Modified
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {forms.map((form) => (
                    <tr key={form.id} className="hover:bg-orange-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center">
                            <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{form.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {form.version}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {form.components?.length || 0} component{form.components?.length !== 1 ? 's' : ''}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{form.lastModified}</div>
                        <div className="text-xs text-gray-400">by {form.modifiedBy}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm space-x-2">
                        <button
                          onClick={() => handlePreviewForm(form)}
                          className="inline-flex items-center px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs font-medium rounded-lg transition-colors"
                        >
                          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          Preview
                        </button>
                        <button
                          onClick={() => navigate(`/designer/studies/${studyId}/forms/${form.id}`)}
                          className="inline-flex items-center px-3 py-1.5 bg-orange-50 hover:bg-orange-100 text-orange-600 text-xs font-medium rounded-lg transition-colors"
                        >
                          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteForm(form.id, form.name)}
                          className="inline-flex items-center px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-medium rounded-lg transition-colors"
                        >
                          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Status Workflow Actions */}
            {study && getNextStatus(study.status) && (
              <div className="mt-6 flex items-center justify-end gap-3">
                {study.status !== 'Design' && (
                  <button
                    onClick={() => handleStatusChange('Design')}
                    disabled={isSubmitting}
                    className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Revert to Design"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                    </svg>
                    Revert to Design
                  </button>
                )}
                <button
                  onClick={() => handleStatusChange(getNextStatus(study.status))}
                  disabled={isSubmitting}
                  className="inline-flex items-center px-6 py-2.5 text-sm font-semibold rounded-lg shadow-md transition-all duration-200 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-green-500/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:from-gray-400 disabled:to-gray-500 disabled:shadow-none"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {isSubmitting ? 'Submitting...' : `Submit for ${getNextStatus(study.status)}`}
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gray-100 mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">No forms added yet</h3>
            <p className="text-sm text-gray-500 mb-4">
              Create a new form or use a template to get started
            </p>
            <button
              onClick={() => navigate(`/designer/studies/${studyId}`)}
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white text-sm font-medium rounded-lg transition-colors"
            >
              Go Back
            </button>
          </div>
        )}
      </div>

      {/* Form Preview Modal */}
      {showPreviewModal && previewForm && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 overflow-y-auto">
          {/* Close Button */}
          <button
            onClick={() => setShowPreviewModal(false)}
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
                            <h3 className="text-sm font-semibold">{previewForm.name}</h3>
                            <p className="text-xs text-orange-100">Clinical Study</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {isCompleted ? (
                      /* Completion Screen */
                      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
                        <div className="text-center">
                          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-6">
                            <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <h2 className="text-2xl font-bold text-gray-900 mb-3">Form Completed!</h2>
                          <p className="text-gray-600 mb-2">Thank you for completing this form.</p>
                          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-500">Form:</span>
                                <span className="font-medium text-gray-900">{previewForm.name}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-500">Questions:</span>
                                <span className="font-medium text-gray-900">{previewForm.components?.length || 0}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-500">Time:</span>
                                <span className="font-medium text-gray-900">{new Date().toLocaleTimeString()}</span>
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={handleClosePreview}
                            className="w-full inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-xl transition-all duration-200 active:scale-95"
                          >
                            Close Preview
                          </button>
                        </div>
                      </div>
                    ) : previewForm.components && previewForm.components.length > 0 ? (
                      <>
                        {/* Progress Bar */}
                        <div className="px-5 pt-4 pb-3 bg-white">
                          <div className="flex items-center justify-between mb-3 text-xs font-medium text-gray-600">
                            <span className="flex items-center space-x-1">
                              <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              <span>Question {currentQuestionIndex + 1}/{previewForm.components.length}</span>
                            </span>
                            <span className="px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full text-xs font-semibold">
                              {Math.round(((currentQuestionIndex + 1) / previewForm.components.length) * 100)}% Complete
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5 shadow-inner">
                            <div
                              className="bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 h-2.5 rounded-full transition-all duration-500 shadow-sm"
                              style={{ width: `${((currentQuestionIndex + 1) / previewForm.components.length) * 100}%` }}
                            ></div>
                          </div>
                        </div>

                        {/* Question Content */}
                        <div className="flex-1 px-6 py-6 overflow-y-auto">
                          {(() => {
                            const component = previewForm.components[currentQuestionIndex];
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

                        {/* VAS Scale - Always Vertical */}
                        {component.type === 'vas' && (
                          <div className="flex items-center justify-center gap-6 py-4">
                            {/* Vertical Scale */}
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
                            {/* Current Value */}
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
                            <div className="mt-2">
                              <button type="button" className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700" disabled>
                                <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                {component.config?.allowCamera !== false ? 'Take Photo or Upload' : 'Upload Image'}
                              </button>
                            </div>
                            <p className="text-xs text-gray-500 mt-2">
                              {component.config?.acceptedTypes || 'All image types'} • Max {component.config?.maxSize || 5}MB
                            </p>
                          </div>
                        )}

                        {/* File Upload */}
                        {component.type === 'file' && (
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                            <div className="mt-2">
                              <button type="button" className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700" disabled>
                                <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                                </svg>
                                Choose File
                              </button>
                            </div>
                            <p className="text-xs text-gray-500 mt-2">
                              {component.config?.acceptedTypes === '*/*' ? 'All file types' : component.config?.acceptedTypes || 'All file types'} • Max {component.config?.maxSize || 10}MB
                            </p>
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
                              disabled={currentQuestionIndex === previewForm.components.length - 1}
                              className={`flex-1 inline-flex items-center justify-center px-4 py-3 rounded-xl font-semibold transition-all duration-200 ${
                                currentQuestionIndex === previewForm.components.length - 1
                                  ? 'bg-green-500 hover:bg-green-600 text-white border-2 border-green-500 hover:border-green-600'
                                  : 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white border-2 border-transparent'
                              } active:scale-95`}
                            >
                              {currentQuestionIndex === previewForm.components.length - 1 ? (
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
                            {previewForm.components.map((_, index) => (
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
                      <div className="text-center py-12">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gray-100 mb-4">
                          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <p className="text-gray-500">This form has no components yet</p>
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
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Form"
        size="sm"
      >
        <div className="space-y-4">
          {/* Warning icon */}
          <div className="flex items-center justify-center">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-red-100">
              <svg
                className="w-8 h-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
          </div>

          {/* Warning message */}
          <div className="text-center">
            <p className="text-sm text-gray-700">
              Are you sure you want to delete{' '}
              <span className="font-semibold text-gray-900">{formToDelete?.name}</span>?
            </p>
            <p className="text-sm text-gray-500 mt-2">
              This action cannot be undone. The form will be removed from all visits where it was assigned.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={() => setShowDeleteModal(false)}
              className="px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-sm font-medium rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={confirmDeleteForm}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold rounded-lg transition-colors"
            >
              Delete Form
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default EditFormSelection
