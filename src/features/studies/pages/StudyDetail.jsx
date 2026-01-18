import { useParams, useNavigate } from 'react-router-dom'

const StudyDetail = () => {
  const { studyId } = useParams()
  const navigate = useNavigate()

  // Mock study data - this would come from API
  const study = {
    id: studyId,
    name: 'Cancer Research Study 2024',
    phase: 'Phase III',
    status: 'Review', // Draft, Review, UAT, Deploy
    lastModified: '2 hours ago'
  }

  const progressSteps = [
    { name: 'Draft', status: 'completed' },
    { name: 'Review', status: 'current' },
    { name: 'UAT', status: 'upcoming' },
    { name: 'Deploy', status: 'upcoming' }
  ]

  const sections = [
    {
      id: 'build',
      title: 'Study Build',
      description: 'Manage all forms within the study',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      color: 'from-blue-500 to-blue-600',
      route: `/studies/${studyId}/build`
    },
    {
      id: 'actions',
      title: 'Pending/Upcoming Actions',
      description: 'View all pending tasks and deadlines',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'from-amber-500 to-amber-600',
      route: `/studies/${studyId}/actions`
    },
    {
      id: 'reports',
      title: 'Reports',
      description: 'Access all study reports',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      color: 'from-green-500 to-green-600',
      route: `/studies/${studyId}/reports`
    },
    {
      id: 'uat',
      title: 'UAT',
      description: 'User acceptance testing management',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      ),
      color: 'from-purple-500 to-purple-600',
      route: `/studies/${studyId}/uat`
    },
    {
      id: 'docs',
      title: 'Docs',
      description: 'Study documentation and guides',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
      color: 'from-orange-500 to-orange-600',
      route: `/studies/${studyId}/docs`
    }
  ]

  return (
    <div className="flex-1 overflow-auto">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-8 py-6">
          {/* Back Button */}
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
            <h1 className="text-2xl font-semibold text-gray-900">{study.name}</h1>
            <p className="text-sm text-gray-500 mt-1">{study.phase} • Last modified {study.lastModified}</p>
          </div>

          {/* Progress Indicator */}
          <div className="mt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center flex-1 max-w-3xl">
                {progressSteps.map((step, index) => (
                  <div key={step.name} className="flex items-center flex-1">
                    <div className="flex flex-col items-center flex-1">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                        step.status === 'completed'
                          ? 'bg-green-500 border-green-500 text-white'
                          : step.status === 'current'
                          ? 'bg-orange-500 border-orange-500 text-white'
                          : 'bg-white border-gray-300 text-gray-400'
                      }`}>
                        {step.status === 'completed' ? (
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <span className="text-sm font-semibold">{index + 1}</span>
                        )}
                      </div>
                      <span className={`text-xs font-medium mt-2 ${
                        step.status === 'current' ? 'text-orange-600' : 'text-gray-600'
                      }`}>
                        {step.name}
                      </span>
                    </div>
                    {index < progressSteps.length - 1 && (
                      <div className={`h-0.5 flex-1 mx-2 ${
                        step.status === 'completed' ? 'bg-green-500' : 'bg-gray-300'
                      }`}></div>
                    )}
                  </div>
                ))}
              </div>
              <button
                onClick={() => navigate(`/deployment/execute/${studyId}`)}
                className="ml-8 px-8 py-2.5 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-all duration-200 font-semibold text-sm shadow-md hover:shadow-lg hover:scale-105 border border-orange-600"
              >
                Deploy
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - 5 Tiles */}
      <div className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sections.map((section) => (
            <div
              key={section.id}
              onClick={() => navigate(section.route)}
              className="bg-white rounded-xl border border-gray-200 hover:border-orange-200 hover:shadow-lg hover:shadow-orange-500/10 transition-all duration-200 cursor-pointer group p-6"
            >
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${section.color} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}>
                {section.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
                {section.title}
              </h3>
              <p className="text-sm text-gray-600">
                {section.description}
              </p>
              <div className="mt-4 flex items-center text-sm font-medium text-orange-600 group-hover:text-orange-700">
                <span>Open</span>
                <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default StudyDetail
