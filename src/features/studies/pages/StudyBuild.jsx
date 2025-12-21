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
      pendingFrom: ['M1'],
      lastModified: '2 hours ago'
    },
    {
      id: 2,
      name: 'Form 2 - Medical History',
      status: 'Review',
      pendingFrom: ['M3'],
      lastModified: '5 hours ago'
    },
    {
      id: 3,
      name: 'Form 3 - Vital Signs',
      status: 'Finalized',
      pendingFrom: [],
      lastModified: '1 day ago'
    },
    {
      id: 4,
      name: 'Form 4 - Adverse Events',
      status: 'Pending Sig',
      pendingFrom: ['M1', 'M3'],
      lastModified: '2 days ago'
    }
  ])

  const [showAddFormModal, setShowAddFormModal] = useState(false)
  const [newFormName, setNewFormName] = useState('')
  const [newFormError, setNewFormError] = useState('')

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

  const handleAddForm = () => {
    if (!newFormName.trim()) {
      setNewFormError('Form name is required')
      return
    }

    const newForm = {
      id: Math.max(...forms.map(f => f.id), 0) + 1,
      name: newFormName,
      status: 'Draft',
      pendingFrom: [],
      lastModified: 'Just now'
    }

    setForms([...forms, newForm])
    setNewFormName('')
    setNewFormError('')
    setShowAddFormModal(false)
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

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Study Build</h1>
              <p className="text-sm text-gray-500 mt-1">Manage all forms within the study</p>
            </div>
            <button
              onClick={() => setShowAddFormModal(true)}
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white text-sm font-semibold rounded-lg shadow-md shadow-orange-500/30 transition-all duration-200"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add New Form
            </button>
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
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
                    ) : (
                      <span className="text-sm text-gray-400">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                    <select
                      value={form.status}
                      onChange={(e) => handleStatusChange(form.id, e.target.value)}
                      className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 text-gray-700 hover:border-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors cursor-pointer"
                    >
                      {statusOptions.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Form Modal */}
      {showAddFormModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Add New Form</h2>
                <button
                  onClick={() => {
                    setShowAddFormModal(false)
                    setNewFormName('')
                    setNewFormError('')
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6">
              <div>
                <label htmlFor="formName" className="block text-sm font-medium text-gray-700 mb-2">
                  Form Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="formName"
                  value={newFormName}
                  onChange={(e) => {
                    setNewFormName(e.target.value)
                    setNewFormError('')
                  }}
                  placeholder="e.g., Form 5 - Patient Consent"
                  className={`w-full px-4 py-2.5 border ${
                    newFormError ? 'border-red-300' : 'border-gray-300'
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent`}
                  autoFocus
                />
                {newFormError && (
                  <p className="mt-1 text-xs text-red-600">{newFormError}</p>
                )}
              </div>

              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-xs text-blue-700">
                  New forms will be created with "Draft" status and can be reviewed and edited later.
                </p>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-end space-x-3 rounded-b-xl">
              <button
                onClick={() => {
                  setShowAddFormModal(false)
                  setNewFormName('')
                  setNewFormError('')
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddForm}
                className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 rounded-lg transition-colors"
              >
                Add Form
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default StudyBuild
