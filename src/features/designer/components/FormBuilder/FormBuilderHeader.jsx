import { useNavigate } from 'react-router-dom'

const FormBuilderHeader = ({
  studyId,
  formName,
  onFormNameChange
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

        <div>
          <input
            type="text"
            value={formName}
            onChange={(e) => onFormNameChange(e.target.value)}
            className="text-2xl font-semibold text-gray-900 bg-transparent border-b-2 border-transparent hover:border-gray-300 focus:border-orange-500 focus:outline-none transition-colors"
          />
          <p className="text-sm text-gray-500 mt-1">Design your form with drag-and-drop components</p>
        </div>
      </div>
    </div>
  )
}

export default FormBuilderHeader
