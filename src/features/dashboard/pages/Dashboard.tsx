import { useState, useEffect, ChangeEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { studiesApi } from '../../../shared/services/api'
import useAuth from '../../../shared/hooks/useAuth'
import { ROLES } from '../../access/constants/roles'

interface Study {
  id: number
  name: string
  code?: string
  phase: string
  status: string
  patients: number
  sites: number
  pendingCount: number
}

const Dashboard = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [studies, setStudies] = useState<Study[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  // Load studies on mount

  const getMockStudies = (): Study[] => [
    {
      id: 1,
      name: 'Diabetes Management Study',
      phase: 'Phase III',
      status: 'Production',
      patients: 245,
      sites: 12,
      pendingCount: 2
    },
    {
      id: 2,
      name: 'Cardiovascular Health Trial',
      phase: 'Phase II',
      status: 'UAT',
      patients: 180,
      sites: 8,
      pendingCount: 5
    },
    {
      id: 3,
      name: 'Mental Health Assessment',
      phase: 'Phase III',
      status: 'Production',
      patients: 320,
      sites: 15,
      pendingCount: 0
    },
    {
      id: 4,
      name: 'Oncology Research Phase II',
      phase: 'Phase II',
      status: 'Draft',
      patients: 0,
      sites: 0,
      pendingCount: 8
    },
    {
      id: 5,
      name: 'Respiratory Disease Study',
      phase: 'Phase II',
      status: 'Production',
      patients: 156,
      sites: 10,
      pendingCount: 3
    },
    {
      id: 6,
      name: 'Neurology Clinical Trial',
      phase: 'Phase I',
      status: 'UAT',
      patients: 89,
      sites: 6,
      pendingCount: 4
    }
  ]

  useEffect(() => {
    const fetchStudies = async () => {
      setIsLoading(true)
      try {
        const savedStudies = localStorage.getItem('studies')
        if (savedStudies) {
          const parsedStudies = JSON.parse(savedStudies) as Study[]
          const mockData = getMockStudies()
          const allStudies = [...parsedStudies, ...mockData]

          const filteredStudies = searchQuery
            ? allStudies.filter(study =>
                study.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                study.code?.toLowerCase().includes(searchQuery.toLowerCase())
              )
            : allStudies

          setStudies(filteredStudies)
          setIsLoading(false)
          return
        }

        const data = await studiesApi.getStudies({ search: searchQuery })
        // studiesApi returns StudyListResponse { data, total, page, pageSize }
        // normalize to an array for the component
        setStudies(Array.isArray(data) ? data : (data && (data as any).data) || [])
      } catch (err) {
        console.error('Error fetching studies:', err)
        const mockData = getMockStudies()
        setStudies(mockData)
      } finally {
        setIsLoading(false)
      }
    }

    const timer = setTimeout(() => {
      fetchStudies()
    }, 300)

    return () => clearTimeout(timer)
  }, [searchQuery])

  const getStudyRoute = (studyId: number): string => {
    if (user?.role === ROLES.STUDY_DESIGNER) {
      return `/designer/studies/${studyId}`
    }
    return `/studies/${studyId}`
  }

  const getStatusStyle = (status: string): string => {
    switch (status) {
      case 'Production':
        return 'bg-green-50 text-green-700 border-green-200'
      case 'UAT':
        return 'bg-amber-50 text-amber-700 border-amber-200'
      case 'Draft':
        return 'bg-gray-50 text-gray-700 border-gray-200'
      case 'Review':
        return 'bg-blue-50 text-blue-700 border-blue-200'
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  return (
    <div className="flex-1 flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-8 py-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Home</h1>
            <p className="text-sm text-gray-500 mt-1">
              Dashboard with study overview
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-md">
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
              onChange={handleSearchChange}
              placeholder="Search studies..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Study Cards Grid */}
      <div className="flex-1 p-8 overflow-auto">
        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse"
              >
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && studies.length === 0 && (
          <div className="flex items-center justify-center h-96">
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
                Try adjusting your search or create a new study
              </p>
            </div>
          </div>
        )}

        {/* Study Cards */}
        {!isLoading && studies.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {studies.map((study) => (
              <div
                key={study.id}
                className="bg-white rounded-xl border border-gray-200 hover:border-orange-300 hover:shadow-lg transition-all duration-200 overflow-hidden flex flex-col"
              >
                <div className="p-6 flex flex-col flex-1">
                  {/* Study Header */}
                  <div className="mb-4">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      {study.name}
                    </h3>
                    <p className="text-sm font-medium text-gray-600">
                      {study.phase}
                    </p>
                    {study.pendingCount > 0 && (
                      <p className="text-sm text-orange-600 font-medium mt-2">
                        {study.pendingCount} pending
                      </p>
                    )}
                  </div>

                  {/* Status Badge */}
                  <div className="mb-4">
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
                            : 'bg-gray-400'
                        }`}
                      ></span>
                      {study.status}
                    </span>
                  </div>

                  {/* Study Stats */}
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                    <div className="flex items-center">
                      <svg
                        className="w-4 h-4 mr-1.5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                      <span>{study.patients} patients</span>
                    </div>
                    <div className="flex items-center">
                      <svg
                        className="w-4 h-4 mr-1.5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                        />
                      </svg>
                      <span>{study.sites} sites</span>
                    </div>
                  </div>

                  {/* Go to Study Button */}
                  <button
                    onClick={() => navigate(getStudyRoute(study.id))}
                    className="w-full mt-auto py-2.5 px-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white text-sm font-semibold rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
                  >
                    <span>Go to Study</span>
                    <svg
                      className="w-4 h-4"
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
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard
