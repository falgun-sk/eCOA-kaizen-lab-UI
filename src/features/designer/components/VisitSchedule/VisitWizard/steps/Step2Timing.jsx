const Step2Timing = ({ visitData, updateField, visits, isEditing, selectedVisit }) => {

  // Skip this step if unscheduled
  if (visitData.isUnscheduled) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-4xl mb-4">⏭️</div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Step Skipped</h3>
          <p className="text-sm text-gray-500">
            Unscheduled visits don't need timing configuration.
            <br />
            Click Next to continue.
          </p>
        </div>
      </div>
    )
  }

  const calculateWindow = () => {
    const day = parseInt(visitData.day) || 0
    const window = parseInt(visitData.window) || 0
    return {
      early: day,
      late: day + window
    }
  }

  const windowRange = calculateWindow()

  return (
    <div>
      <h3 className="text-lg font-bold text-gray-900 mb-1">Visit Timing</h3>
      <p className="text-sm text-gray-500 mb-4">
        Configure study day, visit window, and anchor
      </p>

      <div className="space-y-4">
        {/* Study Day and Window */}
        <div className="grid grid-cols-2 gap-2.5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Study Day <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              placeholder="1"
              value={visitData.day}
              onChange={(e) => updateField('day', e.target.value)}
              min="0"
              className="w-full px-3 py-2 text-sm border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-1 transition-all duration-150"
            />
            <p className="text-xs text-gray-500 mt-1">Target day for this visit</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Visit Window
            </label>
            <input
              type="number"
              placeholder="3"
              value={visitData.window}
              onChange={(e) => updateField('window', e.target.value)}
              min="0"
              className="w-full px-3 py-2 text-sm border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-1 transition-all duration-150"
            />
            {visitData.day && visitData.window && parseInt(visitData.window) > 0 ? (
              <p className="text-xs text-gray-600 mt-1">
                Window: Day {windowRange.early} - Day {windowRange.late} (+{visitData.window} days)
              </p>
            ) : (
              <p className="text-xs text-gray-500 mt-1">+ days after target day</p>
            )}
          </div>
        </div>

        {/* Anchor to another visit */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Anchor to another visit (optional)
          </label>
          <select
            value={visitData.anchorVisit}
            onChange={(e) => updateField('anchorVisit', e.target.value)}
            className="w-full px-3 py-2 text-sm border-2 border-gray-300 rounded-lg bg-white focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-1 transition-all duration-150"
          >
            <option value="this">This visit (default)</option>
            {visits
              .filter((v) => !isEditing || v.id !== selectedVisit?.id)
              .map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name}
                </option>
              ))}
          </select>
          <p className="text-xs text-gray-500 mt-1">
            Calculate this visit's date relative to another visit
          </p>
        </div>

        {/* Offset Configuration (when anchored) */}
        {visitData.anchorVisit !== 'this' && (
          <div className="border-l-4 border-blue-400 bg-blue-50 rounded-r-lg p-3">
            <h4 className="text-sm font-semibold text-gray-900 mb-2.5">Offset Configuration</h4>
            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Offset Value
                </label>
                <input
                  type="number"
                  placeholder="7"
                  value={visitData.offsetValue}
                  onChange={(e) => updateField('offsetValue', e.target.value)}
                  className="w-full px-3 py-2 text-sm border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-all duration-150"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Unit</label>
                <select
                  value={visitData.offsetUnit}
                  onChange={(e) => updateField('offsetUnit', e.target.value)}
                  className="w-full px-3 py-2 text-sm border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 bg-white transition-all duration-150"
                >
                  <option value="days">Days</option>
                  <option value="weeks">Weeks</option>
                </select>
              </div>
            </div>
          </div>
        )}


      </div>
    </div>
  )
}

export default Step2Timing
