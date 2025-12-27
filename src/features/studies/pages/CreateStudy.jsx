import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import useAuth from '../../../shared/hooks/useAuth'
import { ROLES } from '../../access/constants/roles'

const CreateStudy = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [searchParams] = useSearchParams()

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    protocolId: '',
    phase: '',
    sponsor: '',
    therapeuticArea: '',
    customTherapeuticArea: '',
    description: '',
    startDate: '',
    endDate: ''
  })

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const phases = ['Phase I', 'Phase II', 'Phase III', 'Phase IV']

  // Handle clone functionality
  useEffect(() => {
    const cloneId = searchParams.get('cloneId')
    if (cloneId) {
      try {
        // Load studies from localStorage
        const savedStudies = localStorage.getItem('studies')
        if (savedStudies) {
          const studies = JSON.parse(savedStudies)
          const studyToClone = studies.find(s => s.id === parseInt(cloneId))

          if (studyToClone) {
            // Pre-fill form with cloned study data
            setFormData({
              name: `${studyToClone.name} (Copy)`,
              code: `${studyToClone.code}-COPY`,
              protocolId: `${studyToClone.protocolId}-COPY`,
              phase: studyToClone.phase || '',
              sponsor: studyToClone.sponsor || '',
              therapeuticArea: studyToClone.therapeuticArea || '',
              customTherapeuticArea: studyToClone.customTherapeuticArea || '',
              description: studyToClone.description || '',
              startDate: studyToClone.startDate || '',
              endDate: studyToClone.endDate || ''
            })
          }
        }
      } catch (error) {
        console.error('Error loading study to clone:', error)
      }
    }
  }, [searchParams])

  const therapeuticAreas = [
    'Oncology',
    'Cardiovascular',
    'Neurology',
    'Respiratory',
    'Diabetes',
    'Mental Health',
    'Gastroenterology',
    'Immunology',
    'Other'
  ]

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Study name is required'
    }

    if (!formData.code.trim()) {
      newErrors.code = 'Study code is required'
    }

    if (!formData.protocolId.trim()) {
      newErrors.protocolId = 'Protocol ID is required'
    }

    if (!formData.sponsor.trim()) {
      newErrors.sponsor = 'Sponsor is required'
    }

    if (!formData.therapeuticArea) {
      newErrors.therapeuticArea = 'Therapeutic area is required'
    }

    if (formData.therapeuticArea === 'Other' && !formData.customTherapeuticArea.trim()) {
      newErrors.customTherapeuticArea = 'Please specify the therapeutic area'
    }

    if (formData.startDate && formData.endDate) {
      if (new Date(formData.startDate) >= new Date(formData.endDate)) {
        newErrors.endDate = 'End date must be after start date'
      }
    }

    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const newErrors = validateForm()

    if (Object.keys(newErrors).length === 0) {
      setIsSubmitting(true)

      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))

        // Generate new study ID
        const newStudyId = Date.now()

        // Get existing studies from localStorage
        const existingStudies = JSON.parse(localStorage.getItem('studies') || '[]')

        // Create new study object
        const newStudy = {
          id: newStudyId,
          ...formData,
          therapeuticArea: formData.therapeuticArea === 'Other' ? formData.customTherapeuticArea : formData.therapeuticArea,
          status: 'Draft',
          patients: 0,
          sites: 0,
          pendingCount: 0,
          createdAt: new Date().toISOString(),
          createdBy: 'Study Designer'
        }

        // Add to studies list
        const updatedStudies = [...existingStudies, newStudy]
        localStorage.setItem('studies', JSON.stringify(updatedStudies))

        // Navigate to the new study detail page based on user role
        const studyUrl = user?.role === ROLES.STUDY_DESIGNER
          ? `/designer/studies/${newStudyId}`
          : `/studies/${newStudyId}`
        navigate(studyUrl)
      } catch (error) {
        console.error('Error creating study:', error)
        setErrors({ general: 'Failed to create study. Please try again.' })
      } finally {
        setIsSubmitting(false)
      }
    } else {
      setErrors(newErrors)
    }
  }

  return (
    <div className="flex-1 flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-8 py-6">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </button>

          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              {searchParams.get('cloneId') ? 'Clone Study' : 'Create New Study'}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {searchParams.get('cloneId') ? 'Create a new study from an existing one' : 'Set up a new clinical study'}
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="p-8 space-y-6">
              {/* General Error */}
              {errors.general && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{errors.general}</p>
                </div>
              )}

              {/* Study Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Study Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g., Cancer Research Study 2024"
                  className={`w-full px-4 py-2.5 border ${
                    errors.name ? 'border-red-300' : 'border-gray-300'
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent`}
                />
                {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
              </div>

              {/* Study Code and Protocol ID */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-2">
                    Study Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="code"
                    name="code"
                    value={formData.code}
                    onChange={handleChange}
                    placeholder="e.g., CRS-2024-001"
                    className={`w-full px-4 py-2.5 border ${
                      errors.code ? 'border-red-300' : 'border-gray-300'
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent`}
                  />
                  {errors.code && <p className="mt-1 text-xs text-red-600">{errors.code}</p>}
                </div>

                <div>
                  <label htmlFor="protocolId" className="block text-sm font-medium text-gray-700 mb-2">
                    Protocol ID <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="protocolId"
                    name="protocolId"
                    value={formData.protocolId}
                    onChange={handleChange}
                    placeholder="e.g., PROTO-CRS-001"
                    className={`w-full px-4 py-2.5 border ${
                      errors.protocolId ? 'border-red-300' : 'border-gray-300'
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent`}
                  />
                  {errors.protocolId && <p className="mt-1 text-xs text-red-600">{errors.protocolId}</p>}
                </div>
              </div>

              {/* Phase and Sponsor */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="phase" className="block text-sm font-medium text-gray-700 mb-2">
                    Study Phase
                  </label>
                  <select
                    id="phase"
                    name="phase"
                    value={formData.phase}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 border ${
                      errors.phase ? 'border-red-300' : 'border-gray-300'
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white`}
                  >
                    <option value="">Select phase</option>
                    {phases.map(phase => (
                      <option key={phase} value={phase}>{phase}</option>
                    ))}
                  </select>
                  {errors.phase && <p className="mt-1 text-xs text-red-600">{errors.phase}</p>}
                </div>

                <div>
                  <label htmlFor="sponsor" className="block text-sm font-medium text-gray-700 mb-2">
                    Sponsor <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="sponsor"
                    name="sponsor"
                    value={formData.sponsor}
                    onChange={handleChange}
                    placeholder="e.g., Pharma Company Inc."
                    className={`w-full px-4 py-2.5 border ${
                      errors.sponsor ? 'border-red-300' : 'border-gray-300'
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent`}
                  />
                  {errors.sponsor && <p className="mt-1 text-xs text-red-600">{errors.sponsor}</p>}
                </div>
              </div>

              {/* Therapeutic Area */}
              <div>
                <label htmlFor="therapeuticArea" className="block text-sm font-medium text-gray-700 mb-2">
                  Therapeutic Area <span className="text-red-500">*</span>
                </label>
                <select
                  id="therapeuticArea"
                  name="therapeuticArea"
                  value={formData.therapeuticArea}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 border ${
                    errors.therapeuticArea ? 'border-red-300' : 'border-gray-300'
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white`}
                >
                  <option value="">Select therapeutic area</option>
                  {therapeuticAreas.map(area => (
                    <option key={area} value={area}>{area}</option>
                  ))}
                </select>
                {errors.therapeuticArea && <p className="mt-1 text-xs text-red-600">{errors.therapeuticArea}</p>}

                {/* Conditional input for custom therapeutic area */}
                {formData.therapeuticArea === 'Other' && (
                  <div className="mt-3">
                    <input
                      type="text"
                      id="customTherapeuticArea"
                      name="customTherapeuticArea"
                      value={formData.customTherapeuticArea}
                      onChange={handleChange}
                      placeholder="Please specify therapeutic area"
                      className={`w-full px-4 py-2.5 border ${
                        errors.customTherapeuticArea ? 'border-red-300' : 'border-gray-300'
                      } rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent`}
                    />
                    {errors.customTherapeuticArea && <p className="mt-1 text-xs text-red-600">{errors.customTherapeuticArea}</p>}
                  </div>
                )}
              </div>

              {/* Start Date and End Date */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    id="startDate"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    id="endDate"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 border ${
                      errors.endDate ? 'border-red-300' : 'border-gray-300'
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent`}
                  />
                  {errors.endDate && <p className="mt-1 text-xs text-red-600">{errors.endDate}</p>}
                </div>
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter study description..."
                  rows={4}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="px-8 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-end space-x-3 rounded-b-xl">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 rounded-lg shadow-md shadow-orange-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Creating...' : 'Create Study'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CreateStudy
