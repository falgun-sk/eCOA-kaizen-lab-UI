const VisitCard = ({
  visit,
  index,
  isSelected,
  cycles,
  getFormName,
  onEdit,
  onDelete
}) => {
  return (
    <div
      className={`bg-white rounded-xl border-2 transition-all cursor-pointer ${
        isSelected
          ? 'border-orange-500 shadow-lg shadow-orange-500/20'
          : 'border-gray-200 hover:border-orange-300 hover:shadow-md'
      }`}
      onClick={() => onEdit(visit)}
    >
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            {/* Visit Number Badge */}
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-orange-100 to-orange-200">
              <span className="text-lg font-bold text-orange-600">{index + 1}</span>
            </div>

            <div>
              {/* Title and Badges */}
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg font-semibold text-gray-900">{visit.name}</h3>
                <VisitBadges visit={visit} />
              </div>

              {/* Visit Details */}
              <VisitDetails visit={visit} />

              {/* Cycles Display */}
              {cycles.length > 0 && <CyclesDisplay cycles={cycles} />}

              {/* Assigned Forms */}
              <AssignedForms forms={visit.forms} getFormName={getFormName} />
            </div>
          </div>

          {/* Delete Button */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              onDelete(visit.id)
            }}
            className="p-2 text-gray-400 hover:text-red-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Selected Indicator */}
      {isSelected && (
        <div className="px-6 py-3 bg-orange-50 border-t border-orange-200">
          <p className="text-xs text-orange-700 flex items-center">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            Editing in side panel →
          </p>
        </div>
      )}
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
      <>
        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
          visit.type === 'site' ? 'bg-blue-50 text-blue-700' : 'bg-purple-50 text-purple-700'
        }`}>
          {visit.type === 'site' ? 'Site Visit' : 'Remote'}
        </span>
        {visit.repeats && (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-50 text-green-700">
            Repeating
          </span>
        )}
      </>
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
        <span>•</span>
        <span>Window: ±{visit.windowEarly}/{visit.windowLate} days</span>
        {visit.repeats && (
          <>
            <span>•</span>
            <span>Every {visit.repeatEvery} {visit.repeatUnit}</span>
            <span>•</span>
            <span>{visit.repeatUntil} cycles</span>
          </>
        )}
      </>
    )}
  </div>
)

const CyclesDisplay = ({ cycles }) => (
  <div className="flex items-center gap-2 mt-3">
    <span className="text-xs text-gray-500">Cycles:</span>
    <div className="flex gap-2">
      {cycles.slice(0, 5).map((cycle) => (
        <div
          key={cycle.cycle}
          className="px-2 py-1 bg-gray-50 border border-gray-200 rounded text-xs text-gray-700"
        >
          C{cycle.cycle}: Day {cycle.day}
        </div>
      ))}
      {cycles.length > 5 && (
        <div className="px-2 py-1 text-xs text-gray-500">
          +{cycles.length - 5} more
        </div>
      )}
    </div>
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
