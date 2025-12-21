import { useParams, useNavigate } from 'react-router-dom'

const PendingActions = () => {
  const { studyId } = useParams()
  const navigate = useNavigate()

  const actions = [
    {
      id: 1,
      type: 'signature',
      title: 'Pending Sig on Form 1',
      description: 'Awaiting signature from M1 and M3',
      priority: 'high',
      dueDate: 'Today'
    },
    {
      id: 2,
      type: 'review',
      title: 'Ongoing review of Form 2',
      description: 'Currently under review by M3',
      priority: 'medium',
      dueDate: 'Tomorrow'
    },
    {
      id: 3,
      type: 'deadline',
      title: 'UAT Deadline Approaching',
      description: 'UAT phase must be completed by end of week',
      priority: 'high',
      dueDate: 'In 3 days'
    },
    {
      id: 4,
      type: 'blocked',
      title: 'Form 5 Blocked',
      description: 'Waiting for protocol clarification',
      priority: 'low',
      dueDate: 'No deadline'
    }
  ]

  const getTypeIcon = (type) => {
    switch (type) {
      case 'signature':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        )
      case 'review':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        )
      case 'deadline':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      case 'blocked':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
          </svg>
        )
      default:
        return null
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-50 border-red-200'
      case 'medium':
        return 'text-amber-600 bg-amber-50 border-amber-200'
      case 'low':
        return 'text-gray-600 bg-gray-50 border-gray-200'
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  return (
    <div className="flex-1 overflow-auto">
      <div className="bg-white border-b border-gray-200">
        <div className="px-8 py-6">
          <button
            onClick={() => navigate(`/studies/${studyId}`)}
            className="flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Study
          </button>

          <h1 className="text-2xl font-semibold text-gray-900">Pending/Upcoming Actions</h1>
          <p className="text-sm text-gray-500 mt-1">View all pending tasks and upcoming deadlines</p>
        </div>
      </div>

      <div className="p-8">
        <div className="space-y-4">
          {actions.map((action) => (
            <div
              key={action.id}
              className="bg-white rounded-xl border border-gray-200 hover:border-orange-200 hover:shadow-md transition-all duration-200 p-6"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <div className={`p-3 rounded-lg ${getPriorityColor(action.priority)}`}>
                    {getTypeIcon(action.type)}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-semibold text-gray-900 mb-1">
                      {action.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {action.description}
                    </p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Due: {action.dueDate}
                      </span>
                      <span className={`px-2 py-0.5 rounded-md border font-medium ${getPriorityColor(action.priority)}`}>
                        {action.priority.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
                <button className="ml-4 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-lg transition-colors">
                  Take Action
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default PendingActions
