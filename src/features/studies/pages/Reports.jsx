import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

const Reports = () => {
  const { studyId } = useParams()
  const navigate = useNavigate()
  const [selectedReport, setSelectedReport] = useState(null)

  const reports = [
    {
      id: 1,
      name: 'Audit Trail',
      description: 'Complete audit log of all actions',
      icon: '📊',
      lastGenerated: '2 hours ago',
      size: '2.4 MB'
    },
    {
      id: 2,
      name: 'User Report',
      description: 'User activity and access report',
      icon: '👥',
      lastGenerated: '1 day ago',
      size: '1.2 MB'
    },
    {
      id: 3,
      name: 'Form 1 Report',
      description: 'Submission data for Form 1',
      icon: '📋',
      lastGenerated: '3 hours ago',
      size: '856 KB'
    },
    {
      id: 4,
      name: 'Form 2 Report',
      description: 'Submission data for Form 2',
      icon: '📋',
      lastGenerated: '5 hours ago',
      size: '1.1 MB'
    },
    {
      id: 5,
      name: 'Compliance Report',
      description: 'Regulatory compliance status',
      icon: '✓',
      lastGenerated: '1 week ago',
      size: '542 KB'
    }
  ]

  // Mock audit logs data (Session Activity)
  const auditLogs = [
    {
      id: 1,
      timestamp: '2025-12-28 10:45:23',
      user: 'John Doe',
      role: 'Study Designer',
      action: 'Created new form',
      details: 'Demographics Form v1.0',
      ipAddress: '192.168.1.100',
      status: 'Success'
    },
    {
      id: 2,
      timestamp: '2025-12-28 10:30:15',
      user: 'Jane Smith',
      role: 'Project Manager',
      action: 'Changed study status',
      details: 'From Design to Review',
      ipAddress: '192.168.1.101',
      status: 'Success'
    },
    {
      id: 3,
      timestamp: '2025-12-28 09:15:42',
      user: 'John Doe',
      role: 'Study Designer',
      action: 'Updated form',
      details: 'Vital Signs Form v1.2',
      ipAddress: '192.168.1.100',
      status: 'Success'
    },
    {
      id: 4,
      timestamp: '2025-12-28 08:50:33',
      user: 'Mike Johnson',
      role: 'Build Reviewer',
      action: 'Added comment',
      details: 'Review comment on Demographics Form',
      ipAddress: '192.168.1.102',
      status: 'Success'
    },
    {
      id: 5,
      timestamp: '2025-12-27 16:22:11',
      user: 'John Doe',
      role: 'Study Designer',
      action: 'Deleted component',
      details: 'Removed File Upload from form',
      ipAddress: '192.168.1.100',
      status: 'Success'
    },
    {
      id: 6,
      timestamp: '2025-12-27 15:10:05',
      user: 'Admin User',
      role: 'Administrator',
      action: 'Created user',
      details: 'Added new Study Designer: Sarah Williams',
      ipAddress: '192.168.1.99',
      status: 'Success'
    },
    {
      id: 7,
      timestamp: '2025-12-27 14:35:28',
      user: 'Jane Smith',
      role: 'Project Manager',
      action: 'Assigned user to study',
      details: 'Assigned Mike Johnson as Build Reviewer',
      ipAddress: '192.168.1.101',
      status: 'Success'
    },
    {
      id: 8,
      timestamp: '2025-12-27 13:20:17',
      user: 'John Doe',
      role: 'Study Designer',
      action: 'Login attempt failed',
      details: 'Invalid credentials',
      ipAddress: '192.168.1.100',
      status: 'Failed'
    }
  ]

  if (selectedReport === 'audit') {
    return (
      <div className="flex-1 overflow-auto">
        <div className="bg-white border-b border-gray-200">
          <div className="px-8 py-6">
            <button
              onClick={() => setSelectedReport(null)}
              className="flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4 transition-colors"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Reports
            </button>

            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">Audit Trail</h1>
                <p className="text-sm text-gray-500 mt-1">Session activity and system logs</p>
              </div>
              <button className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white text-sm font-semibold rounded-lg shadow-md shadow-orange-500/30 transition-all duration-200">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Export Logs
              </button>
            </div>
          </div>
        </div>

        <div className="p-8">
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Timestamp
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      IP Address
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {log.timestamp}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {log.user}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {log.role}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {log.action}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {log.details}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {log.ipAddress}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          log.status === 'Success'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {log.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-auto">
      <div className="bg-white border-b border-gray-200">
        <div className="px-8 py-6">
          {studyId && (
            <button
              onClick={() => navigate(`/studies/${studyId}`)}
              className="flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4 transition-colors"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Study
            </button>
          )}

          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Reports</h1>
            <p className="text-sm text-gray-500 mt-1">Access all study reports</p>
          </div>
        </div>
      </div>

      <div className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reports.map((report) => (
            <div
              key={report.id}
              className="bg-white rounded-xl border border-gray-200 hover:border-orange-200 hover:shadow-lg transition-all duration-200 p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-4">
                  <div className="text-3xl">{report.icon}</div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {report.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {report.description}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-4 text-xs text-gray-500 mb-4">
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Generated {report.lastGenerated}
                </span>
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  {report.size}
                </span>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  onClick={() => report.id === 1 && setSelectedReport('audit')}
                  className="flex-1 py-2 px-4 bg-gray-50 hover:bg-gray-100 text-gray-700 text-sm font-medium rounded-lg transition-colors flex items-center justify-center"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  View
                </button>
                <button className="flex-1 py-2 px-4 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Reports
