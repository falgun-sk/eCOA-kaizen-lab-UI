import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { studiesApi } from '../../../shared/services/api'
import useAuth from '../../../shared/hooks/useAuth'
import { ROLES } from '../../access/constants/roles'

/**
 * Studies List Page
 *
 * Displays all studies with search and filter capabilities
 */
const Studies = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [studies, setStudies] = useState([])
  const [filteredStudies, setFilteredStudies] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
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

  // Mock data fallback
  const getMockStudies = () => [
    {
      id: 1,
      name: 'Diabetes Management Study',
      protocol: 'DM-2024-001',
      phase: 'Phase III',
      status: 'Production',
      patients: 245,
      sites: 12,
      lastUpdated: '2024-01-15',
      pendingCount: 2
    },
    {
      id: 2,
      name: 'Cardiovascular Health Trial',
      protocol: 'CV-2024-002',
      phase: 'Phase II',
      status: 'UAT',
      patients: 180,
      sites: 8,
      lastUpdated: '2024-01-14',
      pendingCount: 5
    },
    {
      id: 3,
      name: 'Mental Health Assessment',
      protocol: 'MH-2024-003',
      phase: 'Phase III',
      status: 'Production',
      patients: 320,
      sites: 15,
      lastUpdated: '2024-01-13',
      pendingCount: 0
    },
    {
      id: 4,
      name: 'Oncology Research Phase II',
      protocol: 'ON-2024-004',
      phase: 'Phase II',
      status: 'Draft',
      patients: 0,
      sites: 0,
      lastUpdated: '2024-01-12',
      pendingCount: 8
    },
    {
      id: 5,
      name: 'Respiratory Disease Study',
      protocol: 'RD-2024-005',
      phase: 'Phase II',
      status: 'Production',
      patients: 156,
      sites: 10,
      lastUpdated: '2024-01-11',
      pendingCount: 3
    },
    {
      id: 6,
      name: 'Neurology Clinical Trial',
      protocol: 'NR-2024-006',
      phase: 'Phase I',
      status: 'UAT',
      patients: 89,
      sites: 6,
      lastUpdated: '2024-01-10',
      pendingCount: 4
    }
  ]

  // Fetch studies
  useEffect(() => {
    const fetchStudies = async () => {
      setIsLoading(true)
      setError(null)
      try {
        // First, try to load from localStorage
        const savedStudies = localStorage.getItem('studies')
        let localStudies = []

        if (savedStudies) {
          localStudies = JSON.parse(savedStudies)
        }

        // Try to fetch from API
        try {
          const data = await studiesApi.getStudies({ search: searchQuery })
          // studiesApi returns a StudyListResponse { data, total, page, pageSize }
          // but the component expects an array of studies. Normalize here.
          const apiStudies = Array.isArray(data) ? data : data.data || []
          // Combine API data with local studies
          const combinedStudies = [...localStudies, ...apiStudies]
          setStudies(combinedStudies)
        } catch (apiErr) {
          console.log('API not available, using localStorage and mock data')
          // API failed, combine localStorage with mock data
          const mockData = getMockStudies()
          const combinedStudies = [...localStudies, ...mockData]
          setStudies(combinedStudies)
        }
      } catch (err) {
        console.error('Error fetching studies:', err)
        // Complete fallback to mock data
        const mockData = getMockStudies()
        setStudies(mockData)
      } finally {
        setIsLoading(false)
      }
    }

    const timer = setTimeout(() => {
      fetchStudies()
    }, 300) // Debounce search

    // Reload studies when window gains focus (user returns to tab/page)
    const handleFocus = () => {
      fetchStudies()
    }

    // Reload studies when localStorage changes (in case of multi-tab usage)
    const handleStorageChange = (e) => {
      if (e.key === 'studies' || e.key === null) {
        fetchStudies()
      }
    }

    window.addEventListener('focus', handleFocus)
    window.addEventListener('storage', handleStorageChange)

    return () => {
      clearTimeout(timer)
      window.removeEventListener('focus', handleFocus)
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [searchQuery])

  // Apply filters
  useEffect(() => {
    // Ensure `studies` is an array before operating on it
    const base = Array.isArray(studies) ? studies : []

    let result = [...base]

    if (statusFilter !== 'all') {
      result = result.filter((study) => study.status === statusFilter)
    }

    setFilteredStudies(result)
  }, [studies, statusFilter])

  // Status badge styling
  const getStatusStyle = (status) => {
    switch (status) {
      case 'Production':
        return 'bg-green-50 text-green-700 border-green-200'
      case 'UAT':
        return 'bg-amber-50 text-amber-700 border-amber-200'
      case 'Draft':
        return 'bg-gray-50 text-gray-700 border-gray-200'
      case 'Review':
        return 'bg-blue-50 text-blue-700 border-blue-200'
      case 'Deploy':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200'
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  const handleSelectStudyToClone = (studyId) => {
    const study = filteredStudies.find(s => s.id === studyId)
    console.log('Selected study to clone:', study)

    if (study) {
      setStudyToClone(study)
      setCloneFormData({
        name: `${study.name} (Copy)`,
        code: study.code ? `${study.code}-COPY` : '',
        protocolId: study.protocolId || study.protocol || '',
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
        phase: studyToClone.phase || '',
        sponsor: studyToClone.sponsor || '',
        therapeuticArea: studyToClone.therapeuticArea || '',
        customTherapeuticArea: studyToClone.customTherapeuticArea || '',
        description: studyToClone.description || '',
        startDate: studyToClone.startDate || '',
        endDate: studyToClone.endDate || '',
        status: 'Draft',
        patients: 0,
        sites: 0,
        pendingCount: 0,
        createdAt: new Date().toISOString(),
        createdBy: user?.name || 'User'
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
      navigate(`/studies/${newStudyId}`)
    }
  }

  return (
    <div className="flex-1 flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Studies</h1>
              <p className="text-sm text-gray-500 mt-1">
                Manage and view all your clinical studies
              </p>
            </div>
            {user?.role === ROLES.STUDY_DESIGNER && (
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
            )}
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search studies by name or protocol..."
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="w-full sm:w-48">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors cursor-pointer"
              >
                <option value="all">All Statuses</option>
                <option value="Draft">Draft</option>
                <option value="Review">Review</option>
                <option value="UAT">UAT</option>
                <option value="Production">Production</option>
                <option value="Deploy">Deploy</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Studies Table */}
      <div className="flex-1 p-8 overflow-auto">
        {/* Loading State */}
        {isLoading && (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="animate-pulse">
              <div className="h-12 bg-gray-50 border-b border-gray-200"></div>
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-20 border-b border-gray-200 p-6">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-6">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredStudies.length === 0 && (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gray-100 mb-4">
                <svg
                  className="w-8 h-8 text-gray-400"
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
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                No studies found
              </h3>
              <p className="text-sm text-gray-500">
                Try adjusting your search or filter criteria
              </p>
            </div>
          </div>
        )}

        {/* Studies Table */}
        {!isLoading && filteredStudies.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Study
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Protocol
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phase
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Patients
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sites
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Updated
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredStudies.map((study) => (
                  <tr
                    key={study.id}
                    className="hover:bg-orange-50/30 transition-colors cursor-pointer"
                    onClick={() => navigate(`/studies/${study.id}`)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center">
                          <svg
                            className="w-5 h-5 text-orange-600"
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
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {study.name}
                          </div>
                          {study.pendingCount > 0 && (
                            <div className="text-xs text-orange-600">
                              {study.pendingCount} pending
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{study.protocol}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{study.phase}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium border ${getStatusStyle(
                          study.status
                        )}`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                            study.status === 'Production'
                              ? 'bg-green-500'
                              : study.status === 'UAT'
                              ? 'bg-amber-500'
                              : study.status === 'Review'
                              ? 'bg-blue-500'
                              : study.status === 'Deploy'
                              ? 'bg-emerald-500'
                              : 'bg-gray-400'
                          }`}
                        ></span>
                        {study.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{study.patients}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{study.sites}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {new Date(study.lastUpdated).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          navigate(`/studies/${study.id}`)
                        }}
                        className="inline-flex items-center px-3 py-1.5 bg-orange-50 hover:bg-orange-100 text-orange-600 text-xs font-medium rounded-lg transition-colors"
                      >
                        View
                        <svg
                          className="w-3 h-3 ml-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Clone Study Modal */}
      {showCloneModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-orange-500 to-orange-600">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-white">Clone Study ({filteredStudies.length} studies available)</h2>
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
              {filteredStudies.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No studies available to clone
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredStudies.map((study) => (
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
                            <div className="text-sm font-medium text-gray-900">{study.name}</div>
                            <div className="text-xs text-gray-500 mt-0.5">Protocol: {study.protocol}</div>
                          </div>
                        </div>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium border ${getStatusStyle(study.status)}`}>
                          {study.status}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
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
                  <p className="text-sm text-white/90 mt-1">Cloning from: {studyToClone.name}</p>
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

export default Studies
