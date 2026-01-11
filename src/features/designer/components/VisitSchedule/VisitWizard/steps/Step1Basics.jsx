const Step1Basics = ({ visitData, updateField }) => {
  return (
    <div>
      <h3 className="text-lg font-bold text-gray-900 mb-1">Visit Basics</h3>
      <p className="text-sm text-gray-500 mb-4">
        Let's start with the essential information about this visit
      </p>

      <div className="space-y-4">
        {/* Visit Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            What should we call this visit? <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g., Baseline Visit, Week 4 Follow-up"
            value={visitData.name}
            onChange={(e) => updateField('name', e.target.value)}
            className="w-full px-3 py-2 text-sm border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none transition-colors"
          />
          <p className="text-xs text-gray-500 mt-1">Choose a clear, descriptive name</p>
        </div>

        {/* Visit Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            What type of visit is this? <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-2 gap-2.5">
            {/* Scheduled */}
            <div className="relative">
              <input
                type="radio"
                name="visit-type"
                id="scheduled"
                value="scheduled"
                checked={visitData.visitType === 'scheduled'}
                onChange={(e) => updateField('visitType', e.target.value)}
                className="peer hidden"
              />
              <label
                htmlFor="scheduled"
                className="block p-3 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-orange-300 peer-checked:border-orange-500 peer-checked:bg-orange-50 transition-all"
              >
                <div className="text-center">
                  <div className="text-xl mb-1.5">📅</div>
                  <div className="text-sm font-semibold text-gray-900">Scheduled</div>
                  <div className="text-xs text-gray-500 mt-0.5">Fixed day</div>
                </div>
              </label>
            </div>

            {/* Unscheduled */}
            <div className="relative">
              <input
                type="radio"
                name="visit-type"
                id="unscheduled"
                value="unscheduled"
                checked={visitData.visitType === 'unscheduled'}
                onChange={(e) => updateField('visitType', e.target.value)}
                className="peer hidden"
              />
              <label
                htmlFor="unscheduled"
                className="block p-3 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-orange-300 peer-checked:border-orange-500 peer-checked:bg-orange-50 transition-all"
              >
                <div className="text-center">
                  <div className="text-xl mb-1.5">🔄</div>
                  <div className="text-sm font-semibold text-gray-900">Unscheduled</div>
                  <div className="text-xs text-gray-500 mt-0.5">Anytime</div>
                </div>
              </label>
            </div>
          </div>

          {visitData.visitType === 'unscheduled' && (
            <div className="mt-2 p-2.5 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-xs text-yellow-800">
                <strong>Unscheduled visits</strong> can occur at any time during the study
              </p>
            </div>
          )}
        </div>

        {/* Location Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Where will this visit take place?
          </label>
          <div className="grid grid-cols-2 gap-2.5">
            {/* Site Visit */}
            <div className="relative">
              <input
                type="radio"
                name="location"
                id="site"
                value="site"
                checked={visitData.locationType === 'site'}
                onChange={(e) => updateField('locationType', e.target.value)}
                className="peer hidden"
              />
              <label
                htmlFor="site"
                className="block p-3 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-orange-300 peer-checked:border-orange-500 peer-checked:bg-orange-50 transition-all"
              >
                <div className="flex items-center">
                  <div className="text-xl mr-2.5">🏥</div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900">Site Visit</div>
                    <div className="text-xs text-gray-500">At clinic/hospital</div>
                  </div>
                </div>
              </label>
            </div>

            {/* Remote */}
            <div className="relative">
              <input
                type="radio"
                name="location"
                id="remote"
                value="remote"
                checked={visitData.locationType === 'remote'}
                onChange={(e) => updateField('locationType', e.target.value)}
                className="peer hidden"
              />
              <label
                htmlFor="remote"
                className="block p-3 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-orange-300 peer-checked:border-orange-500 peer-checked:bg-orange-50 transition-all"
              >
                <div className="flex items-center">
                  <div className="text-xl mr-2.5">🏠</div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900">Remote</div>
                    <div className="text-xs text-gray-500">At home/online</div>
                  </div>
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Step1Basics
