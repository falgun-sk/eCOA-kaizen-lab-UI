import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import useAuth from '../../../shared/hooks/useAuth'
import toast from 'react-hot-toast'
import { dialog } from '../../../shared/hooks/useDialog'

const DesignerStudyDetail = () => {
  const { studyId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  // Track submission state
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Load study data from localStorage
  const [study, setStudy] = useState(null)

  useEffect(() => {
    const loadStudy = () => {
      try {
        // Load studies from localStorage
        const savedStudies = localStorage.getItem('studies')
        if (savedStudies) {
          const studies = JSON.parse(savedStudies)
          const foundStudy = studies.find(s => s.id === parseInt(studyId))

          if (foundStudy) {
            // Transform to match expected format
            setStudy({
              id: foundStudy.id,
              name: foundStudy.name,
              code: foundStudy.code,
              protocolId: foundStudy.protocolId,
              version: 'V1.0',
              phase: foundStudy.phase,
              status: foundStudy.status || 'Design',
              lastModified: new Date(foundStudy.createdAt).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
              })
            })
            return
          }
        }

        // Fallback to mock data if not found
        setStudy({
          id: studyId,
          name: 'Cancer Research Study 2024',
          code: 'CRS-2024-001',
          protocolId: 'PROTO-CRS-001',
          version: 'V1.2 (Auto-populated)',
          phase: 'Phase III',
          status: 'Design',
          lastModified: '2 hours ago'
        })
      } catch (error) {
        console.error('Error loading study:', error)
        // Use mock data on error
        setStudy({
          id: studyId,
          name: 'Cancer Research Study 2024',
          code: 'CRS-2024-001',
          protocolId: 'PROTO-CRS-001',
          version: 'V1.2 (Auto-populated)',
          phase: 'Phase III',
          status: 'Design',
          lastModified: '2 hours ago'
        })
      }
    }

    loadStudy()
  }, [studyId])

  // State for forms
  const [forms, setForms] = useState([])
  const [showFormSelection, setShowFormSelection] = useState(false)
  const [showTemplateModal, setShowTemplateModal] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [showPreviewModal, setShowPreviewModal] = useState(false)
  const [previewForm, setPreviewForm] = useState(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [formValues, setFormValues] = useState({})
  const [isCompleted, setIsCompleted] = useState(false)

  // Library templates
  const templates = [
    {
      id: 1,
      name: 'Demographics Form',
      category: 'Standard',
      description: 'Basic demographic information collection form',
      fields: 8,
      components: [
        { id: 1, type: 'text', label: 'First Name', config: { required: true } },
        { id: 2, type: 'text', label: 'Last Name', config: { required: true } },
        { id: 3, type: 'date', label: 'Date of Birth', config: { required: true } },
        { id: 4, type: 'radio', label: 'Gender', config: { required: true } },
        { id: 5, type: 'text', label: 'Email Address', config: { required: false } },
        { id: 6, type: 'text', label: 'Phone Number', config: { required: false } },
        { id: 7, type: 'dropdown', label: 'Marital Status', config: { required: false } },
        { id: 8, type: 'text', label: 'Occupation', config: { required: false } }
      ]
    },
    {
      id: 2,
      name: 'Vital Signs',
      category: 'Medical',
      description: 'Standard vital signs measurement form',
      fields: 12,
      components: [
        { id: 1, type: 'number', label: 'Systolic Blood Pressure (mmHg)', config: { required: true, validation: { min: 70, max: 200 } } },
        { id: 2, type: 'number', label: 'Diastolic Blood Pressure (mmHg)', config: { required: true, validation: { min: 40, max: 130 } } },
        { id: 3, type: 'number', label: 'Heart Rate (bpm)', config: { required: true, validation: { min: 40, max: 200 } } },
        { id: 4, type: 'number', label: 'Temperature (°C)', config: { required: true, validation: { min: 35, max: 42 } } },
        { id: 5, type: 'number', label: 'Respiratory Rate (breaths/min)', config: { required: true } },
        { id: 6, type: 'number', label: 'Oxygen Saturation (%)', config: { required: true, validation: { min: 0, max: 100 } } },
        { id: 7, type: 'number', label: 'Weight (kg)', config: { required: true } },
        { id: 8, type: 'number', label: 'Height (cm)', config: { required: true } },
        { id: 9, type: 'date', label: 'Measurement Date', config: { required: true } },
        { id: 10, type: 'text', label: 'Measured By', config: { required: true } },
        { id: 11, type: 'dropdown', label: 'Patient Position', config: { required: false } },
        { id: 12, type: 'textarea', label: 'Additional Notes', config: { required: false } }
      ]
    },
    {
      id: 3,
      name: 'Adverse Events',
      category: 'Safety',
      description: 'Comprehensive adverse event reporting form',
      fields: 15,
      components: [
        { id: 1, type: 'text', label: 'Event Description', config: { required: true } },
        { id: 2, type: 'date', label: 'Event Start Date', config: { required: true } },
        { id: 3, type: 'date', label: 'Event End Date', config: { required: false } },
        { id: 4, type: 'dropdown', label: 'Severity', config: { required: true } },
        { id: 5, type: 'radio', label: 'Serious Event?', config: { required: true } },
        { id: 6, type: 'dropdown', label: 'Outcome', config: { required: true } },
        { id: 7, type: 'radio', label: 'Related to Study Drug?', config: { required: true } },
        { id: 8, type: 'textarea', label: 'Event Details', config: { required: true } },
        { id: 9, type: 'checkbox', label: 'Required Hospitalization', config: { required: false } },
        { id: 10, type: 'text', label: 'Reporter Name', config: { required: true } },
        { id: 11, type: 'date', label: 'Report Date', config: { required: true } },
        { id: 12, type: 'dropdown', label: 'Action Taken', config: { required: true } },
        { id: 13, type: 'textarea', label: 'Investigator Comments', config: { required: false } },
        { id: 14, type: 'text', label: 'MedDRA Code', config: { required: false } },
        { id: 15, type: 'dropdown', label: 'Report Status', config: { required: true } }
      ]
    },
    {
      id: 4,
      name: 'Consent Form',
      category: 'Standard',
      description: 'Patient consent and information form',
      fields: 6,
      components: [
        { id: 1, type: 'text', label: 'Participant Name', config: { required: true } },
        { id: 2, type: 'text', label: 'Study Title', config: { required: true } },
        { id: 3, type: 'checkbox', label: 'I understand the study purpose', config: { required: true } },
        { id: 4, type: 'checkbox', label: 'I understand the risks and benefits', config: { required: true } },
        { id: 5, type: 'date', label: 'Consent Date', config: { required: true } },
        { id: 6, type: 'text', label: 'Signature', config: { required: true } }
      ]
    },
    {
      id: 5,
      name: 'Medical History',
      category: 'Medical',
      description: 'Complete medical history questionnaire',
      fields: 20,
      components: [
        { id: 1, type: 'radio', label: 'Do you have diabetes?', config: { required: true } },
        { id: 2, type: 'radio', label: 'Do you have high blood pressure?', config: { required: true } },
        { id: 3, type: 'radio', label: 'Do you have heart disease?', config: { required: true } },
        { id: 4, type: 'radio', label: 'Do you have asthma?', config: { required: true } },
        { id: 5, type: 'radio', label: 'Do you smoke?', config: { required: true } },
        { id: 6, type: 'text', label: 'Cigarettes per day (if applicable)', config: { required: false } },
        { id: 7, type: 'radio', label: 'Do you drink alcohol?', config: { required: true } },
        { id: 8, type: 'dropdown', label: 'Alcohol frequency', config: { required: false } },
        { id: 9, type: 'checkbox', label: 'Currently taking medications', config: { required: true } },
        { id: 10, type: 'textarea', label: 'List all current medications', config: { required: false } },
        { id: 11, type: 'radio', label: 'Any allergies?', config: { required: true } },
        { id: 12, type: 'textarea', label: 'List allergies', config: { required: false } },
        { id: 13, type: 'radio', label: 'Previous surgeries?', config: { required: true } },
        { id: 14, type: 'textarea', label: 'Describe surgeries', config: { required: false } },
        { id: 15, type: 'radio', label: 'Family history of cancer?', config: { required: true } },
        { id: 16, type: 'radio', label: 'Family history of heart disease?', config: { required: true } },
        { id: 17, type: 'radio', label: 'Family history of diabetes?', config: { required: true } },
        { id: 18, type: 'dropdown', label: 'Exercise frequency', config: { required: true } },
        { id: 19, type: 'dropdown', label: 'Diet type', config: { required: false } },
        { id: 20, type: 'textarea', label: 'Additional medical information', config: { required: false } }
      ]
    },
    {
      id: 6,
      name: 'Pain Assessment (VAS)',
      category: 'Assessment',
      description: 'Visual analog scale for pain measurement',
      fields: 5,
      components: [
        { id: 1, type: 'vas', label: 'Current Pain Level', config: { required: true } },
        { id: 2, type: 'dropdown', label: 'Pain Location', config: { required: true } },
        { id: 3, type: 'dropdown', label: 'Pain Type', config: { required: true } },
        { id: 4, type: 'date', label: 'Assessment Date', config: { required: true } },
        { id: 5, type: 'textarea', label: 'Pain Description', config: { required: false } }
      ]
    }
  ]

  // Load forms from localStorage whenever studyId changes
  useEffect(() => {
    const loadForms = () => {
      try {
        const savedForms = localStorage.getItem(`study-${studyId}-forms`)
        if (savedForms) {
          const parsedForms = JSON.parse(savedForms)
          setForms(parsedForms)
        } else {
          // No saved forms, show empty array
          setForms([])
        }
      } catch (error) {
        console.error('Error loading forms:', error)
        setForms([])
      }
    }

    if (studyId) {
      loadForms()
    }
  }, [studyId])

  // Handle template selection and add to study
  const handleUseTemplate = (template) => {
    const formData = {
      id: Date.now(),
      name: template.name,
      version: 'V1.0',
      lastModified: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      modifiedBy: 'Study Designer',
      components: template.components
    }

    const savedForms = localStorage.getItem(`study-${studyId}-forms`)
    let allForms = savedForms ? JSON.parse(savedForms) : []
    allForms.push(formData)
    localStorage.setItem(`study-${studyId}-forms`, JSON.stringify(allForms))

    // Update forms state to reflect the new form
    setForms(allForms)
    setShowTemplateModal(false)
    setSelectedTemplate(null)
  }

  // Handle form preview
  const handlePreviewForm = (form) => {
    setPreviewForm(form)
    setCurrentQuestionIndex(0)
    setFormValues({})
    setIsCompleted(false)
    setShowPreviewModal(true)
  }

  const handleInputChange = (componentId, value) => {
    setFormValues(prev => ({
      ...prev,
      [componentId]: value
    }))
  }

  // Navigation handlers for preview
  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
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

  // Study status workflow
  const getStatusColor = (status) => {
    const colors = {
      'Design': 'bg-gray-100 text-gray-700 border-gray-300',
      'Review': 'bg-blue-100 text-blue-700 border-blue-300',
      'UAT': 'bg-amber-100 text-amber-700 border-amber-300',
      'Approved': 'bg-green-100 text-green-700 border-green-300'
    }
    return colors[status] || colors['Design']
  }

  const getNextStatus = (currentStatus) => {
    const workflow = {
      'Design': 'Review',
      'Review': 'UAT',
      'UAT': 'Approved',
      'Approved': null
    }
    // If status is not in workflow, treat as Design
    return workflow[currentStatus] !== undefined ? workflow[currentStatus] : workflow['Design']
  }

  const handleStatusChange = async (newStatus) => {
    // Validate that at least one form exists before submitting for review
    if (newStatus === 'Review' && forms.length === 0) {
      toast.error('You must add at least one form or template before submitting this study for review.')
      return
    }

    const confirmed = await dialog.confirm({
      title: 'Change Study Status',
      message: `Are you sure you want to change study status to "${newStatus}"?`,
      confirmText: 'Change Status',
      cancelText: 'Cancel',
      variant: 'primary',
      icon: 'question'
    })

    if (confirmed) {
      setIsSubmitting(true)
      try {
        const savedStudies = localStorage.getItem('studies')
        if (savedStudies) {
          const studies = JSON.parse(savedStudies)
          const updatedStudies = studies.map(s =>
            s.id === parseInt(studyId)
              ? { ...s, status: newStatus }
              : s
          )
          localStorage.setItem('studies', JSON.stringify(updatedStudies))

          // Update local study state
          setStudy({ ...study, status: newStatus })
          toast.success(`Study status changed to "${newStatus}"`)
        }
      } catch (error) {
        console.error('Error updating study status:', error)
        toast.error('Failed to update study status')
        setIsSubmitting(false)
      }
    }
  }

  const actionButtons = [
    {
      id: 'create-form',
      title: 'Create New Form',
      description: 'Start building a new form from scratch',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      color: 'from-blue-500 to-blue-600',
      action: () => navigate(`/designer/studies/${studyId}/forms/new`)
    },
    {
      id: 'use-template',
      title: 'Use Template',
      description: 'Start with a pre-built form template',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
        </svg>
      ),
      color: 'from-orange-500 to-orange-600',
      action: () => setShowTemplateModal(true)
    },
    {
      id: 'edit-form',
      title: 'Edit Existing Form',
      description: 'Modify forms you have already created',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      ),
      color: 'from-green-500 to-green-600',
      action: () => navigate(`/designer/studies/${studyId}/edit-forms`)
    },
    {
      id: 'visit-schedule',
      title: 'Create/Edit Visit Schedule',
      description: 'Configure study visit timeline',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      color: 'from-purple-500 to-purple-600',
      action: () => navigate(`/designer/studies/${studyId}/visit-schedule`)
    },
    {
      id: 'languages',
      title: 'Add Languages',
      description: 'Manage study translations',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
        </svg>
      ),
      color: 'from-amber-500 to-amber-600',
      action: () => navigate(`/designer/studies/${studyId}/languages`)
    },
    {
      id: 'notes',
      title: 'Note',
      description: 'Add designer notes and comments',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      ),
      color: 'from-orange-500 to-orange-600',
      action: () => navigate(`/designer/studies/${studyId}/notes`)
    }
  ]

  // Show loading state while study is being loaded
  if (!study) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading study...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Study Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-8 py-6">
          {/* Back Button */}
          <button
            onClick={() => navigate('/designer/dashboard')}
            className="flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </button>

          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-semibold text-gray-900">{study.name}</h1>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(study.status)}`}>
                  <span className={`w-2 h-2 rounded-full mr-2 ${
                    study.status === 'Approved' ? 'bg-green-500' :
                    study.status === 'UAT' ? 'bg-amber-500' :
                    study.status === 'Review' ? 'bg-blue-500' :
                    'bg-gray-400'
                  }`}></span>
                  {study.status}
                </span>
              </div>
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                <span>Study Code: <span className="font-medium text-gray-700">{study.code}</span></span>
                <span>•</span>
                <span>Protocol ID: <span className="font-medium text-gray-700">{study.protocolId}</span></span>
                <span>•</span>
                <span>Version: <span className="font-medium text-gray-700">{study.version}</span></span>
                <span>•</span>
                <span>Last modified {study.lastModified}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons Grid */}
      <div className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {actionButtons
            .filter(button => !(button.id === 'create-form' && user?.role === 'admin'))
            .map((button) => (
            <button
              key={button.id}
              onClick={button.action}
              className="bg-white rounded-xl border border-gray-200 p-6 hover:border-orange-200 hover:shadow-lg hover:shadow-orange-500/10 transition-all duration-200 text-left group"
            >
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${button.color} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}>
                {button.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
                {button.title}
              </h3>
              <p className="text-sm text-gray-600">
                {button.description}
              </p>
            </button>
          ))}
        </div>



        {/* Info Message when no forms exist */}
        {forms.length === 0 && study.status === 'Design' && (
          <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start">
            <svg className="w-5 h-5 text-blue-500 mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="text-sm font-medium text-blue-800">Submit for review is disabled</p>
              <p className="text-sm text-blue-700 mt-1">You must add at least one form or template before submitting this study for review.</p>
            </div>
          </div>
        )}
      </div>

      {/* Edit Existing Form Modal */}
      {showFormSelection && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] flex flex-col">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Edit Existing Form</h2>
                <p className="text-sm text-gray-500 mt-1">
                  {forms.length === 0 ? 'No forms added yet' : `${forms.length} form${forms.length !== 1 ? 's' : ''} in this study`}
                </p>
              </div>
              <button
                onClick={() => setShowFormSelection(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 overflow-auto flex-1">
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
                                onClick={() => {
                                  setShowFormSelection(false)
                                  handlePreviewForm(form)
                                }}
                                className="inline-flex items-center px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs font-medium rounded-lg transition-colors"
                              >
                                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                                Preview
                              </button>
                              <button
                                onClick={() => {
                                  setShowFormSelection(false)
                                  navigate(`/designer/studies/${studyId}/forms/${form.id}`)
                                }}
                                className="inline-flex items-center px-3 py-1.5 bg-orange-50 hover:bg-orange-100 text-orange-600 text-xs font-medium rounded-lg transition-colors"
                              >
                                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                Edit
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Status Workflow Actions */}
                  {getNextStatus(study.status) && (
                    <div className="mt-6 flex items-center justify-end gap-3">
                      {study.status !== 'Design' && (user?.role === 'project_manager' || user?.role === 'admin') && (
                        <button
                          onClick={() => {
                            setShowFormSelection(false)
                            handleStatusChange('Design')
                          }}
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
                        onClick={() => {
                          setShowFormSelection(false)
                          handleStatusChange(getNextStatus(study.status))
                        }}
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
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gray-100 mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No forms added yet</h3>
                  <p className="text-sm text-gray-500 mb-4">Create your first form to get started</p>
                  <button
                    onClick={() => {
                      setShowFormSelection(false)
                      navigate(`/designer/studies/${studyId}/forms/new`)
                    }}
                    className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-semibold rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Create New Form
                  </button>
                </div>
              )}
            </div>

            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end">
              <button
                onClick={() => setShowFormSelection(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Template Selection Modal */}
      {showTemplateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-orange-500 to-orange-600">
              <div>
                <h2 className="text-xl font-semibold text-white">Select Template</h2>
                <p className="text-sm text-orange-100 mt-0.5">Choose a pre-built form template</p>
              </div>
              <button
                onClick={() => setShowTemplateModal(false)}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 max-h-[calc(90vh-140px)] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {templates.map((template) => (
                  <div
                    key={template.id}
                    className="bg-white rounded-lg border-2 border-gray-200 hover:border-orange-300 hover:shadow-lg transition-all duration-200 overflow-hidden cursor-pointer"
                    onClick={() => handleUseTemplate(template)}
                  >
                    <div className="p-5">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="text-base font-bold text-gray-900 mb-1">
                            {template.name}
                          </h3>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                            template.category === 'Standard' ? 'bg-blue-50 text-blue-700' :
                            template.category === 'Medical' ? 'bg-green-50 text-green-700' :
                            template.category === 'Safety' ? 'bg-red-50 text-red-700' :
                            'bg-purple-50 text-purple-700'
                          }`}>
                            {template.category}
                          </span>
                        </div>
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center flex-shrink-0 ml-3">
                          <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                      </div>

                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {template.description}
                      </p>

                      <div className="flex items-center text-xs text-gray-500 mb-3">
                        <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span>{template.fields} fields</span>
                      </div>

                      <button
                        className="w-full py-2 px-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white text-sm font-semibold rounded-lg transition-all duration-200"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleUseTemplate(template)
                        }}
                      >
                        Use This Template
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end">
              <button
                onClick={() => setShowTemplateModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Form Preview Modal */}
      {showPreviewModal && previewForm && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          {/* Close Button */}
          <button
            onClick={() => setShowPreviewModal(false)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="flex items-center justify-center">
              {/* Mobile Device Frame */}
              <div className="w-full max-w-md">
                {/* Phone Frame */}
                <div className="bg-white rounded-[3rem] shadow-2xl border-[14px] border-gray-900 overflow-hidden">
                  {/* Phone Notch */}
                  <div className="bg-gray-900 h-6 flex items-center justify-center">
                    <div className="w-32 h-4 bg-black rounded-b-2xl"></div>
                  </div>

                  {/* Phone Screen Content */}
                  <div className="bg-gradient-to-b from-white to-gray-50 h-[500px] flex flex-col">
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
                        <div className="h-[300px] px-6 py-6 overflow-y-auto">
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
                    <div className="bg-gray-900 h-5 flex items-center justify-center">
                      <div className="w-32 h-1 bg-white rounded-full opacity-50"></div>
                    </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DesignerStudyDetail
