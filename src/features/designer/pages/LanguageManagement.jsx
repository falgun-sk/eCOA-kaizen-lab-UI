import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

const LanguageManagement = () => {
  const { studyId } = useParams()
  const navigate = useNavigate()

  const [languages, setLanguages] = useState([
    { id: 1, country: 'USA', language: 'English', code: 'enUs', status: 'Approved' },
    { id: 2, country: 'Mexico', language: 'Spanish', code: 'esMs', status: 'Draft' },
    { id: 3, country: 'India', language: 'Hindi', code: 'inHi', status: 'Review' }
  ])

  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedLanguages, setSelectedLanguages] = useState([])

  // Available languages from translations tab
  const availableLanguages = [
    { country: 'Germany', language: 'German', code: 'deDe' },
    { country: 'France', language: 'French', code: 'frFr' },
    { country: 'Japan', language: 'Japanese', code: 'jpJa' },
    { country: 'China', language: 'Chinese', code: 'cnZh' },
    { country: 'Brazil', language: 'Portuguese', code: 'brPt' }
  ]

  const getStatusColor = (status) => {
    const colors = {
      'Approved': 'bg-green-50 text-green-700 border-green-200',
      'Draft': 'bg-gray-50 text-gray-700 border-gray-200',
      'Review': 'bg-blue-50 text-blue-700 border-blue-200',
      'Pending': 'bg-amber-50 text-amber-700 border-amber-200'
    }
    return colors[status] || colors['Draft']
  }

  const addLanguages = () => {
    const newLanguages = selectedLanguages.map((lang, index) => ({
      id: languages.length + index + 1,
      ...lang,
      status: 'Draft'
    }))
    setLanguages([...languages, ...newLanguages])
    setSelectedLanguages([])
    setShowAddModal(false)
  }

  const removeLanguage = (id) => {
    setLanguages(languages.filter(lang => lang.id !== id))
  }

  const toggleLanguageSelection = (lang) => {
    const isSelected = selectedLanguages.find(l => l.code === lang.code)
    if (isSelected) {
      setSelectedLanguages(selectedLanguages.filter(l => l.code !== lang.code))
    } else {
      setSelectedLanguages([...selectedLanguages, lang])
    }
  }

  return (
    <div className="flex-1 flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-8 py-6">
          <button
            onClick={() => navigate(`/designer/studies/${studyId}`)}
            className="flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Study
          </button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Language Management</h1>
              <p className="text-sm text-gray-500 mt-1">Manage study translations and language versions</p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white text-sm font-semibold rounded-lg shadow-md shadow-orange-500/30 transition-all duration-200"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Languages
            </button>
          </div>
        </div>
      </div>

      {/* Languages Table */}
      <div className="flex-1 p-8 overflow-auto">
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Country
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Language
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Language Code
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {languages.map((language) => (
                <tr key={language.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{language.country}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{language.language}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-mono text-gray-600 bg-gray-50 px-2 py-1 rounded inline-block">
                      {language.code}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium border ${getStatusColor(language.status)}`}>
                      {language.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <button className="text-orange-600 hover:text-orange-900 font-medium mr-4">
                      Edit
                    </button>
                    <button
                      onClick={() => removeLanguage(language.id)}
                      className="text-red-600 hover:text-red-900 font-medium"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Language Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Add Languages</h2>
                <button
                  onClick={() => {
                    setShowAddModal(false)
                    setSelectedLanguages([])
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <p className="text-sm text-gray-500 mt-1">Select languages from the available translations list</p>
            </div>

            <div className="p-6 max-h-96 overflow-y-auto">
              <div className="space-y-2">
                {availableLanguages.map((lang) => (
                  <label
                    key={lang.code}
                    className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-orange-50 hover:border-orange-300 cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={!!selectedLanguages.find(l => l.code === lang.code)}
                      onChange={() => toggleLanguageSelection(lang)}
                      className="rounded text-orange-500 focus:ring-orange-500"
                    />
                    <div className="ml-3 flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{lang.country} - {lang.language}</div>
                          <div className="text-xs font-mono text-gray-500 mt-0.5">{lang.code}</div>
                        </div>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
              <div className="text-sm text-gray-600">
                {selectedLanguages.length} language(s) selected
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    setShowAddModal(false)
                    setSelectedLanguages([])
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={addLanguages}
                  disabled={selectedLanguages.length === 0}
                  className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg hover:from-orange-600 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Add Selected
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default LanguageManagement
