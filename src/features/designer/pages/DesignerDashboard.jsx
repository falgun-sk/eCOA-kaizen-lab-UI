import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const DesignerDashboard = () => {
  const navigate = useNavigate()

  // Studies state
  const [studies, setStudies] = useState([])
  const [showDropdown, setShowDropdown] = useState(false)
  const [showCloneModal, setShowCloneModal] = useState(false)
  const [showCloneEditModal, setShowCloneEditModal] = useState(false)
  const [studyToClone, setStudyToClone] = useState(null)
  const [cloneFormData, setCloneFormData] = useState({
    name: '',
    code: '',
    protocolId: '',
    version: 'V1.0'
  })

  // Mock assigned studies data
  const getMockStudies = () => [
    {
      id: 1001,
      studyName: 'Study 1 - Diabetes Research',
      studyCode: 'S1',
      assignedStudies: 'Study1',
      ongoingTasks: 'Design',
      studyState: 'Design',
      lastModified: '16-Dec-2025'
    },
    {
      id: 1002,
      studyName: 'Study 2 - Cardiovascular Trial',
      studyCode: 'S2',
      assignedStudies: 'Study2',
      ongoingTasks: 'Review',
      studyState: 'Design',
      lastModified: '15-Dec-2025'
    },
    {
      id: 1003,
      studyName: 'Study 3 - Mental Health Study',
      studyCode: 'S3',
      assignedStudies: 'Study3',
      ongoingTasks: 'UAT',
      studyState: 'UAT',
      lastModified: '14-Dec-2025'
    }
  ]

  // Load studies from localStorage
  useEffect(() => {
    const loadStudies = () => {
      try {
        // Load created studies from localStorage
        const savedStudies = localStorage.getItem('studies')
        const mockData = getMockStudies()

        if (savedStudies) {
          const parsedStudies = JSON.parse(savedStudies)

          // Transform saved studies to match designer dashboard format
          const transformedStudies = parsedStudies.map(study => ({
            id: study.id,
            studyName: study.name,
            studyCode: study.code || study.protocolId || 'N/A',
            assignedStudies: study.name,
            ongoingTasks: 'Design',
            studyState: study.status || 'Design',
            lastModified: new Date(study.createdAt).toLocaleDateString('en-GB', {
              day: '2-digit',
              month: 'short',
              year: 'numeric'
            })
          }))

          // Combine with mock data
          setStudies([...transformedStudies, ...mockData])
        } else {
          // Only show mock data if no saved studies
          setStudies(mockData)
        }
      } catch (error) {
        console.error('Error loading studies:', error)
        setStudies(getMockStudies())
      }
    }

    loadStudies()

    // Reload studies when window gains focus (user returns to tab/page)
    const handleFocus = () => {
      loadStudies()
    }

    // Reload studies when localStorage changes (in case of multi-tab usage)
    const handleStorageChange = (e) => {
      if (e.key === 'studies' || e.key === null) {
        loadStudies()
      }
    }

    window.addEventListener('focus', handleFocus)
    window.addEventListener('storage', handleStorageChange)

    return () => {
      window.removeEventListener('focus', handleFocus)
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  const getStateColor = (state) => {
    const colors = {
      'Design': 'bg-gray-50 text-gray-700 border-gray-200',
      'Review': 'bg-blue-50 text-blue-700 border-blue-200',
      'UAT': 'bg-amber-50 text-amber-700 border-amber-200',
      'Approved': 'bg-green-50 text-green-700 border-green-200'
    }
    return colors[state] || colors['Design']
  }

  const handleSelectStudyToClone = (studyId) => {
    const study = studies.find(s => s.id === studyId)
    console.log('Selected study to clone:', study)

    if (study) {
      setStudyToClone(study)
      setCloneFormData({
        name: `${study.studyName} (Copy)`,
        code: `${study.studyCode}-COPY`,
        protocolId: study.studyCode,
        version: 'V1.0'
      })
      setShowCloneModal(false)
      setShowCloneEditModal(true)
    }
  }

  const handleConfirmClone = () => {
    if (studyToClone && cloneFormData.name && cloneFormData.code) {
      // Create the cloned study with edited data
      const newStudyId = Date.now()
      const existingStudies = JSON.parse(localStorage.getItem('studies') || '[]')

      const clonedStudy = {
        id: newStudyId,
        name: cloneFormData.name,
        code: cloneFormData.code,
        protocolId: cloneFormData.protocolId,
        phase: '',
        sponsor: '',
        therapeuticArea: '',
        customTherapeuticArea: '',
        description: '',
        startDate: '',
        endDate: '',
        status: 'Draft',
        patients: 0,
        sites: 0,
        pendingCount: 0,
        createdAt: new Date().toISOString(),
        createdBy: 'Study Designer'
      }

      // Save to localStorage
      const updatedStudies = [...existingStudies, clonedStudy]
      localStorage.setItem('studies', JSON.stringify(updatedStudies))

      console.log('Study cloned successfully:', clonedStudy)

      // Reset state
      setShowCloneEditModal(false)
      setStudyToClone(null)
      setCloneFormData({ name: '', code: '', protocolId: '', version: 'V1.0' })
      setShowDropdown(false)

      // Navigate to the new study detail page
      navigate(`/designer/studies/${newStudyId}`)
    }
  }

  return (
    <div className="flex-1 flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Studies</h1>
              <p className="text-sm text-gray-500 mt-1">
                View and manage your assigned studies
              </p>
            </div>
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white text-sm font-semibold rounded-lg shadow-md shadow-orange-500/30 hover:shadow-lg hover:shadow-orange-500/40 transition-all duration-200"
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
                Create New Study
                <svg
                  className="w-4 h-4 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                  <div className="py-1">
                    <button
                      onClick={() => {
                        setShowDropdown(false)
                        navigate('/studies/new')
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-orange-50 transition-colors flex items-center"
                    >
                      <svg className="w-4 h-4 mr-2 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Create New Study
                    </button>
                    <button
                      onClick={() => {
                        setShowDropdown(false)
                        setShowCloneModal(true)
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-orange-50 transition-colors flex items-center border-t border-gray-100"
                    >
                      <svg className="w-4 h-4 mr-2 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      Clone Existing Study
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Studies Table */}
      <div className="flex-1 p-8 overflow-auto">
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Study Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Study Code
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ongoing Tasks
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Study State
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
              {studies.map((study) => (
                <tr
                  key={study.id}
                  className="hover:bg-orange-50 transition-colors cursor-pointer"
                  onClick={() => navigate(`/designer/studies/${study.id}`)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center">
                        <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {study.studyName}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-mono text-gray-600 bg-gray-50 px-2 py-1 rounded inline-block">
                      {study.studyCode}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{study.ongoingTasks}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium border ${getStateColor(study.studyState)}`}>
                      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                        study.studyState === 'Approved' ? 'bg-green-500' :
                        study.studyState === 'UAT' ? 'bg-amber-500' :
                        study.studyState === 'Review' ? 'bg-blue-500' :
                        'bg-gray-400'
                      }`}></span>
                      {study.studyState}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{study.lastModified}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        navigate(`/designer/studies/${study.id}`)
                      }}
                      className="inline-flex items-center px-3 py-1.5 bg-orange-50 hover:bg-orange-100 text-orange-600 text-xs font-medium rounded-lg transition-colors"
                    >
                      Open
                      <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Note at bottom */}
        <div className="mt-6 text-center text-sm text-gray-500">
          Click on any study to view details and start designing
        </div>
      </div>

      {/* Clone Study Modal - Select Study */}
      {showCloneModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-orange-500 to-orange-600">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-white">Clone Study</h2>
                <button
                  onClick={() => setShowCloneModal(false)}
                  className="text-white hover:text-gray-200 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <p className="text-sm text-white/90 mt-1">Select a study to clone its configuration</p>
            </div>

            <div className="p-6 max-h-96 overflow-y-auto">
              <div className="space-y-2">
                {studies.map((study) => (
                  <button
                    key={study.id}
                    onClick={() => handleSelectStudyToClone(study.id)}
                    className="w-full p-4 border border-gray-200 rounded-lg hover:bg-orange-50 hover:border-orange-300 transition-colors text-left"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center">
                          <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">{study.studyName}</div>
                          <div className="text-xs text-gray-500 mt-0.5">Code: {study.studyCode}</div>
                        </div>
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium border ${getStateColor(study.studyState)}`}>
                        {study.studyState}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-end">
              <button
                onClick={() => setShowCloneModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Clone Study Edit Modal */}
      {showCloneEditModal && studyToClone && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => {
            setShowCloneEditModal(false)
            setStudyToClone(null)
            setCloneFormData({ name: '', code: '', protocolId: '', version: 'V1.0' })
          }}
        >
          <div
            className="bg-white rounded-xl shadow-2xl max-w-xl w-full max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-orange-500 to-orange-600">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-white">Edit Cloned Study Details</h2>
                  <p className="text-sm text-white/90 mt-1">Cloning from: {studyToClone.studyName}</p>
                </div>
                <button
                  onClick={() => {
                    setShowCloneEditModal(false)
                    setStudyToClone(null)
                    setCloneFormData({ name: '', code: '', protocolId: '', version: 'V1.0' })
                  }}
                  className="text-white hover:text-gray-200 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4 overflow-y-auto flex-1">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Study Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={cloneFormData.name}
                  onChange={(e) => setCloneFormData({ ...cloneFormData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Enter study name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Study Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={cloneFormData.code}
                  onChange={(e) => setCloneFormData({ ...cloneFormData, code: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Enter study code"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Protocol ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={cloneFormData.protocolId}
                  onChange={(e) => setCloneFormData({ ...cloneFormData, protocolId: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Enter protocol ID"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Version
                </label>
                <input
                  type="text"
                  value={cloneFormData.version}
                  onChange={(e) => setCloneFormData({ ...cloneFormData, version: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Enter version (e.g., V1.0)"
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex">
                  <svg className="w-5 h-5 text-blue-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="text-sm text-blue-800">
                    <p className="font-medium">Note:</p>
                    <p className="mt-1">The cloned study will be created with Draft status and all forms from the original study will be copied.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-end gap-3">
              <button
                onClick={() => {
                  setShowCloneEditModal(false)
                  setStudyToClone(null)
                  setCloneFormData({ name: '', code: '', protocolId: '', version: 'V1.0' })
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmClone}
                disabled={!cloneFormData.name || !cloneFormData.code}
                className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg hover:from-orange-600 hover:to-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Clone Study
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DesignerDashboard
