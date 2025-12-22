import { useNavigate } from 'react-router-dom'

const FormBuilderHeader = ({
  studyId,
  formName,
  onFormNameChange,
  onPreview,
  onSave,
  canPreview,
  canSave
}) => {
  const navigate = useNavigate()

  return (
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
            <input
              type="text"
              value={formName}
              onChange={(e) => onFormNameChange(e.target.value)}
              className="text-2xl font-semibold text-gray-900 bg-transparent border-b-2 border-transparent hover:border-gray-300 focus:border-orange-500 focus:outline-none transition-colors"
            />
            <p className="text-sm text-gray-500 mt-1">Design your form with drag-and-drop components</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onPreview}
              disabled={!canPreview}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Preview
            </button>
            <button
              onClick={onSave}
              disabled={!canSave}
              className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg hover:from-orange-600 hover:to-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Save Form
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FormBuilderHeader
