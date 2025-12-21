import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

const UAT = () => {
  const { studyId } = useParams()
  const navigate = useNavigate()

  const [uatItems, setUatItems] = useState([
    {
      id: 1,
      name: 'Issue Log',
      status: 'In Progress',
      assigned: ['M1'],
      type: 'issue_log'
    },
    {
      id: 2,
      name: 'Test Script 1',
      status: 'Complete',
      assigned: ['M2'],
      type: 'test_script'
    },
    {
      id: 3,
      name: 'Test Script 2',
      status: 'Pending',
      assigned: ['M1'],
      type: 'test_script'
    },
    {
      id: 4,
      name: 'Validation Report',
      status: 'Draft',
      assigned: ['M1', 'M2', 'M3'],
      type: 'validation_report'
    }
  ])

  const getStatusColor = (status) => {
    const colors = {
      'Complete': 'bg-green-100 text-green-700 border-green-300',
      'In Progress': 'bg-blue-100 text-blue-700 border-blue-300',
      'Pending': 'bg-amber-100 text-amber-700 border-amber-300',
      'Draft': 'bg-gray-100 text-gray-700 border-gray-300'
    }
    return colors[status] || colors['Draft']
  }

  const getTypeIcon = (type) => {
    switch (type) {
      case 'issue_log':
        return '🔍'
      case 'test_script':
        return '📋'
      case 'validation_report':
        return '✓'
      default:
        return '📄'
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

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">UAT</h1>
              <p className="text-sm text-gray-500 mt-1">User acceptance testing management</p>
            </div>
            <button className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white text-sm font-semibold rounded-lg shadow-md shadow-orange-500/30 transition-all duration-200">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add UAT Item
            </button>
          </div>
        </div>
      </div>

      <div className="p-8">
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Item
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Assigned
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {uatItems.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">{getTypeIcon(item.type)}</span>
                      <div className="text-sm font-medium text-gray-900">{item.name}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium border ${getStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-1">
                      {item.assigned.map((member, index) => (
                        <span key={index} className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                          {member}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <button className="text-sm text-orange-600 hover:text-orange-700 font-medium">
                        Edit
                      </button>
                      <span className="text-gray-300">|</span>
                      <button className="text-sm text-gray-600 hover:text-gray-700 font-medium">
                        View
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-700 mb-1">1</div>
            <div className="text-sm text-green-600">Completed</div>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="text-2xl font-bold text-blue-700 mb-1">1</div>
            <div className="text-sm text-blue-600">In Progress</div>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="text-2xl font-bold text-amber-700 mb-1">2</div>
            <div className="text-sm text-amber-600">Pending</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UAT
