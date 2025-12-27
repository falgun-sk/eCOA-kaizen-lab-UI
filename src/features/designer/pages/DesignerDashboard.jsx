import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const DesignerDashboard = () => {
  const navigate = useNavigate()

  // Studies state
  const [studies, setStudies] = useState([])
  const [showDropdown, setShowDropdown] = useState(false)
  const [showCloneModal, setShowCloneModal] = useState(false)

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

  const handleCloneStudy = (studyId) => {
    setShowCloneModal(false)
    setShowDropdown(false)
    navigate(`/studies/new?cloneId=${studyId}`)
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

      {/* Clone Study Modal */}
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
                    onClick={() => handleCloneStudy(study.id)}
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
    </div>
  )
}

export default DesignerDashboard
