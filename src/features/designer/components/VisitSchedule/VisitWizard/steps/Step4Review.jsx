const Step4Review = ({ visitData, availableForms }) => {
  const getFormName = (formId) => {
    const form = availableForms.find((f) => f.id === formId)
    return form ? form.name : 'Unknown Form'
  }

  const getVisitTypeBadge = () => {
    if (visitData.isUnscheduled) {
      return (
        <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full">
          🔄 Unscheduled
        </span>
      )
    }
    return (
      <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
        📅 Scheduled
      </span>
    )
  }

  const getLocationBadge = () => {
    return visitData.locationType === 'site' ? (
      <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
        🏥 Site Visit
      </span>
    ) : (
      <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-medium rounded-full">
        🏠 Remote
      </span>
    )
  }

  const calculateWindow = () => {
    const day = parseInt(visitData.day) || 0
    const window = parseInt(visitData.window) || 0
    return {
      early: day - window,
      late: day + window
    }
  }

  const windowRange = calculateWindow()

  return (
    <div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">Review & Confirm</h3>
      <p className="text-sm text-gray-500 mb-6">
        Review your visit configuration before saving
      </p>

      <div className="space-y-4">
        {/* Visit Summary Card */}
        <div className="bg-gradient-to-r from-orange-50 to-orange-100 border-2 border-orange-200 rounded-lg p-6">
          <div className="flex items-start gap-4">
            <div className="flex items-center justify-center w-14 h-14 rounded-full bg-orange-500 text-white font-bold text-xl flex-shrink-0">
              V
            </div>
            <div className="flex-1">
              <h4 className="text-lg font-bold text-gray-900 mb-2">{visitData.name || 'Untitled Visit'}</h4>
              <div className="flex flex-wrap gap-2 mb-3">
                {getVisitTypeBadge()}
                {getLocationBadge()}
              </div>

              {/* Timing Information */}
              {!visitData.isUnscheduled && (
                <div className="space-y-1 text-sm">
                  <p className="text-gray-700">
                    <strong>Study Day:</strong> Day {visitData.day || '?'}
                  </p>
                  <p className="text-gray-700">
                    <strong>Window:</strong> ± {visitData.window || 0} days (Day {windowRange.early} to Day {windowRange.late})
                  </p>

                  {visitData.anchorVisit && visitData.anchorVisit !== 'this' && (
                    <p className="text-gray-700">
                      <strong>Anchored:</strong> {visitData.offsetValue} {visitData.offsetUnit} after anchor visit
                    </p>
                  )}
                </div>
              )}

              {visitData.isUnscheduled && (
                <p className="text-sm text-yellow-700 font-medium">
                  Can occur anytime during the study
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Assigned Forms */}
        <div className="border-2 border-gray-200 rounded-lg p-4 bg-white">
          <h5 className="text-sm font-bold text-gray-900 mb-3 flex items-center">
            <svg className="w-5 h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Assigned Forms ({visitData.forms.length})
          </h5>
          {visitData.forms.length > 0 ? (
            <div className="space-y-2">
              {visitData.forms.map((formId) => {
                const settings = visitData.formSettings[formId]
                return (
                  <div key={formId} className="flex items-center p-3 bg-orange-50 rounded-lg border border-orange-200">
                    <svg
                      className="w-5 h-5 text-green-600 mr-3 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900">{getFormName(formId)}</p>
                      {settings && (
                        <p className="text-xs text-gray-600 mt-0.5">
                          Start: Day {settings.startDay} • Duration: {settings.duration} days
                          {settings.required && ' • Required'}
                        </p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-sm text-gray-500">No forms assigned to this visit</p>
            </div>
          )}
        </div>

        {/* Validation Status */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-start">
            <svg
              className="w-6 h-6 text-green-600 mt-0.5 mr-3 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              <p className="text-sm font-semibold text-green-900">Ready to save!</p>
              <p className="text-sm text-green-800 mt-1">
                All required fields are complete. Click "Save Visit" to add this to your schedule.
              </p>
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <svg
              className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              <p className="text-xs text-blue-700">
                <strong>Tip:</strong> You can edit this visit anytime by clicking on it in the timeline view.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Step4Review
