const VisitCard = ({
  visit,
  index,
  isSelected,
  getFormName,
  onEdit,
  onDelete,
  onFinalize,
  onUnfinalize
}) => {
  return (
    <div
      className="cursor-pointer"
      onClick={() => onEdit(visit)}
    >
      <div>
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            {/* Visit Number Badge */}
            <div className={`flex items-center justify-center w-12 h-12 rounded-full ${
              visit.finalized
                ? 'bg-gradient-to-br from-green-100 to-green-200'
                : 'bg-gradient-to-br from-orange-100 to-orange-200'
            }`}>
              <span className={`text-lg font-bold ${
                visit.finalized ? 'text-green-600' : 'text-orange-600'
              }`}>{index + 1}</span>
            </div>

            <div>
              {/* Title and Badges */}
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg font-semibold text-gray-900">{visit.name}</h3>
                <VisitBadges visit={visit} />
              </div>

              {/* Visit Details */}
              <VisitDetails visit={visit} />

              {/* Assigned Forms */}
              <AssignedForms forms={visit.forms} getFormName={getFormName} />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-start gap-2">
            {/* Finalize/Edit Schedule Buttons */}
            {visit.finalized ? (
              <>
                <span className="inline-flex items-center px-2.5 py-1.5 bg-green-100 text-green-700 text-xs font-semibold rounded border border-green-300">
                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Finalized
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onUnfinalize(visit.id)
                  }}
                  className="inline-flex items-center px-2.5 py-1.5 bg-white text-gray-700 text-xs font-medium rounded border border-gray-300 hover:bg-gray-50 transition-colors"
                  title="Edit Schedule"
                >
                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit Schedule
                </button>
              </>
            ) : (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onFinalize(visit.id)
                }}
                className="inline-flex items-center px-2.5 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium rounded transition-colors"
                title="Finalize Visit"
              >
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Finalize
              </button>
            )}

            {/* Delete Button */}
            <button
              onClick={(e) => {
                e.stopPropagation()
                onDelete(visit.id)
              }}
              className="p-2 text-gray-400 hover:text-red-600 transition-colors"
              title="Delete Visit"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

const VisitBadges = ({ visit }) => (
  <>
    {visit.isUnscheduled ? (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-50 text-yellow-700 border border-yellow-200">
        Unscheduled
      </span>
    ) : (
      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
        visit.type === 'site' ? 'bg-blue-50 text-blue-700' : 'bg-purple-50 text-purple-700'
      }`}>
        {visit.type === 'site' ? 'Site Visit' : 'Remote'}
      </span>
    )}
  </>
)

const VisitDetails = ({ visit }) => (
  <div className="flex items-center gap-3 text-sm text-gray-500">
    {visit.isUnscheduled ? (
      <span className="text-yellow-600 font-medium">Can occur anytime during study</span>
    ) : (
      <>
        <span className="font-medium">Day {visit.day}</span>
        {visit.windowLate > 0 && (
          <>
            <span>•</span>
            <span>Window: +{visit.windowLate} days</span>
          </>
        )}
      </>
    )}
  </div>
)

const AssignedForms = ({ forms, getFormName }) => (
  <div className="mt-4">
    <span className="text-xs text-gray-500">Assigned Forms ({forms.length}):</span>
    {forms.length > 0 ? (
      <div className="flex flex-wrap gap-2 mt-2">
        {forms.map((formId) => (
          <span
            key={formId}
            className="inline-flex items-center px-2.5 py-1 bg-orange-50 text-orange-700 text-xs font-medium rounded-full border border-orange-200"
          >
            {getFormName(formId)}
          </span>
        ))}
      </div>
    ) : (
      <p className="text-xs text-gray-400 mt-1">No forms assigned</p>
    )}
  </div>
)

export default VisitCard
