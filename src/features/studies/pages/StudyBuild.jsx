import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

const StudyBuild = () => {
  const { studyId } = useParams()
  const navigate = useNavigate()

  // Mock forms data
  const [forms, setForms] = useState([
    {
      id: 1,
      name: 'Form 1 - Patient Demographics',
      status: 'Review',
      pendingFrom: ['John Doe'],
      finalizedBy: null,
      lastModified: '2 hours ago'
    },
    {
      id: 2,
      name: 'Form 2 - Medical History',
      status: 'Review',
      pendingFrom: ['Mike Johnson'],
      finalizedBy: null,
      lastModified: '5 hours ago'
    },
    {
      id: 3,
      name: 'Form 3 - Vital Signs',
      status: 'Finalized',
      pendingFrom: [],
      finalizedBy: 'Sarah Williams',
      lastModified: '1 day ago'
    },
    {
      id: 4,
      name: 'Form 4 - Adverse Events',
      status: 'Pending Sig',
      pendingFrom: ['John Doe', 'Mike Johnson'],
      finalizedBy: null,
      lastModified: '2 days ago'
    }
  ])

  const statusOptions = ['Draft', 'Review', 'Finalized', 'Pending Sig', 'Approved']

  const getStatusColor = (status) => {
    const colors = {
      'Draft': 'bg-gray-100 text-gray-700 border-gray-300',
      'Review': 'bg-blue-100 text-blue-700 border-blue-300',
      'Finalized': 'bg-green-100 text-green-700 border-green-300',
      'Pending Sig': 'bg-amber-100 text-amber-700 border-amber-300',
      'Approved': 'bg-emerald-100 text-emerald-700 border-emerald-300'
    }
    return colors[status] || colors['Draft']
  }

  const handleStatusChange = (formId, newStatus) => {
    setForms(forms.map(form =>
      form.id === formId ? { ...form, status: newStatus } : form
    ))
  }

  const handleFormClick = (formId) => {
    navigate(`/studies/${studyId}/forms/${formId}`)
  }

  return (
    <div className="flex-1 overflow-auto">
      {/* Header */}
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

          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Study Build</h1>
            <p className="text-sm text-gray-500 mt-1">Manage all forms within the study</p>
          </div>
        </div>
      </div>

      {/* Forms Table */}
      <div className="p-8">
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Form Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pending From
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {forms.map((form) => (
                <tr
                  key={form.id}
                  className="hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => handleFormClick(form.id)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{form.name}</div>
                        <div className="text-xs text-gray-500">Modified {form.lastModified}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium border ${getStatusColor(form.status)}`}>
                      {form.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {form.pendingFrom.length > 0 ? (
                      <div className="flex items-center space-x-1">
                        {form.pendingFrom.map((member, index) => (
                          <span key={index} className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-orange-50 text-orange-700 border border-orange-200">
                            {member}
                          </span>
                        ))}
                      </div>
                    ) : form.finalizedBy ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                        {form.finalizedBy}
                      </span>
                    ) : (
                      <span className="text-sm text-gray-400">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default StudyBuild
