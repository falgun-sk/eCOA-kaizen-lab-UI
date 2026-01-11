const VisitPanel = ({
  isOpen,
  isEditing,
  selectedVisit,
  visitData,
  setVisitData,
  expandedSections,
  toggleSection,
  availableForms,
  visits,
  onClose,
  onSave,
  toggleFormAssignment,
  updateFormSetting,
  getFormName
}) => {
  if (!isOpen) return null

  return (
    <div className="w-[30%] bg-white border-l border-gray-200 flex flex-col shadow-2xl">
      {/* Panel Header */}
      <PanelHeader
        isEditing={isEditing}
        selectedVisit={selectedVisit}
        onClose={onClose}
      />

      {/* Panel Content */}
      <div className="flex-1 overflow-y-auto">
        <BasicDetailsSection
          visitData={visitData}
          setVisitData={setVisitData}
          expandedSections={expandedSections}
          toggleSection={toggleSection}
          visits={visits}
          isEditing={isEditing}
          selectedVisit={selectedVisit}
        />

        <AssignedFormsSection
          visitData={visitData}
          expandedSections={expandedSections}
          toggleSection={toggleSection}
          availableForms={availableForms}
          toggleFormAssignment={toggleFormAssignment}
        />

        {visitData.forms.length > 0 && (
          <FormSettingsSection
            visitData={visitData}
            expandedSections={expandedSections}
            toggleSection={toggleSection}
            updateFormSetting={updateFormSetting}
            getFormName={getFormName}
          />
        )}

        <VisitPropertiesSection
          expandedSections={expandedSections}
          toggleSection={toggleSection}
        />
      </div>

      {/* Panel Footer */}
      <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-end gap-3">
        <button
          onClick={onClose}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={onSave}
          className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg hover:from-orange-600 hover:to-orange-700 transition-colors"
        >
          {isEditing ? 'Update Visit' : 'Save Visit'}
        </button>
      </div>
    </div>
  )
}

const PanelHeader = ({ isEditing, selectedVisit, onClose }) => (
  <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-orange-500 to-orange-600">
    <div className="flex items-center justify-between">
      <h2 className="text-lg font-semibold text-white">
        {isEditing ? `Edit: ${selectedVisit?.name || 'Visit'}` : 'Add New Visit'}
      </h2>
      <button
        onClick={onClose}
        className="text-white hover:text-gray-200 transition-colors"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  </div>
)

const CollapsibleSection = ({ title, badge, isExpanded, onToggle, children }) => (
  <div className="border-b border-gray-200">
    <button
      onClick={onToggle}
      className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
    >
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold text-gray-900">{title}</span>
        {badge}
      </div>
      <svg
        className={`w-5 h-5 text-gray-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </button>
    {isExpanded && children}
  </div>
)

const BasicDetailsSection = ({ visitData, setVisitData, expandedSections, toggleSection, visits, isEditing, selectedVisit }) => (
  <CollapsibleSection
    title="Basic Details"
    isExpanded={expandedSections.details}
    onToggle={() => toggleSection('details')}
  >
    <div className="px-6 pb-4 space-y-4">
      {/* Visit Name */}
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">
          Visit Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={visitData.name}
          onChange={(e) => setVisitData({ ...visitData, name: e.target.value })}
          placeholder="e.g., Baseline Visit"
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>

      {/* Unscheduled Visit Checkbox */}
      <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
        <label className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={visitData.isUnscheduled}
            onChange={(e) => setVisitData({ ...visitData, isUnscheduled: e.target.checked })}
            className="rounded text-yellow-500 focus:ring-yellow-500 mr-2"
          />
          <div>
            <span className="text-sm font-medium text-gray-900">Unscheduled Visit</span>
            <p className="text-xs text-gray-600 mt-0.5">
              For emergency visits, adverse events, or visits that can occur anytime
            </p>
          </div>
        </label>
      </div>

      {/* Scheduled Visit Fields */}
      {!visitData.isUnscheduled && (
        <ScheduledVisitFields
          visitData={visitData}
          setVisitData={setVisitData}
          visits={visits}
          isEditing={isEditing}
          selectedVisit={selectedVisit}
        />
      )}
    </div>
  </CollapsibleSection>
)

const ScheduledVisitFields = ({ visitData, setVisitData, visits, isEditing, selectedVisit }) => (
  <>
    <div className="grid grid-cols-2 gap-3">
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">
          Study Day <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          value={visitData.day}
          onChange={(e) => setVisitData({ ...visitData, day: e.target.value })}
          placeholder="e.g., 1"
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">Visit Type</label>
        <select
          value={visitData.type}
          onChange={(e) => setVisitData({ ...visitData, type: e.target.value })}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
        >
          <option value="site">Site Visit</option>
          <option value="remote">Remote</option>
        </select>
      </div>
    </div>

    {/* Anchor Visit */}
    <div>
      <label className="block text-xs font-medium text-gray-700 mb-1">Anchor Visit</label>
      <select
        value={visitData.anchorVisit}
        onChange={(e) => setVisitData({ ...visitData, anchorVisit: e.target.value })}
        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
      >
        <option value="this">This visit</option>
        {visits.filter(v => !isEditing || v.id !== selectedVisit?.id).map(v => (
          <option key={v.id} value={v.id}>{v.name}</option>
        ))}
      </select>
    </div>

    {visitData.anchorVisit !== 'this' && (
      <div className="grid grid-cols-2 gap-3 pl-6 border-l-2 border-blue-200">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Offset</label>
          <input
            type="number"
            value={visitData.offsetValue}
            onChange={(e) => setVisitData({ ...visitData, offsetValue: e.target.value })}
            placeholder="7"
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Unit</label>
          <select
            value={visitData.offsetUnit}
            onChange={(e) => setVisitData({ ...visitData, offsetUnit: e.target.value })}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
          >
            <option value="days">Days</option>
            <option value="weeks">Weeks</option>
          </select>
        </div>
      </div>
    )}
  </>
)

const AssignedFormsSection = ({ visitData, expandedSections, toggleSection, availableForms, toggleFormAssignment }) => (
  <CollapsibleSection
    title="Assigned Forms"
    badge={
      <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-xs font-medium rounded-full">
        {visitData.forms.length}
      </span>
    }
    isExpanded={expandedSections.forms}
    onToggle={() => toggleSection('forms')}
  >
    <div className="px-6 pb-4">
      {availableForms.length > 0 ? (
        <div className="space-y-2">
          {availableForms.map((form) => (
            <label
              key={form.id}
              className="flex items-center p-2 hover:bg-gray-50 rounded cursor-pointer"
            >
              <input
                type="checkbox"
                checked={visitData.forms.includes(form.id)}
                onChange={() => toggleFormAssignment(form.id)}
                className="rounded text-orange-500 focus:ring-orange-500"
              />
              <span className="ml-2 text-sm text-gray-700 flex-1">{form.name}</span>
              <span className="text-xs text-gray-500">{form.version}</span>
            </label>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-500">No forms available. Create forms first.</p>
      )}
    </div>
  </CollapsibleSection>
)

const FormSettingsSection = ({ visitData, expandedSections, toggleSection, updateFormSetting, getFormName }) => (
  <CollapsibleSection
    title="Form Settings"
    isExpanded={expandedSections.formSettings}
    onToggle={() => toggleSection('formSettings')}
  >
    <div className="px-6 pb-4 space-y-4">
      {visitData.forms.map((formId) => {
        const settings = visitData.formSettings[formId] || {}
        return (
          <div key={formId} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-sm font-medium text-gray-900 mb-3">{getFormName(formId)}</p>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Start Day</label>
                  <input
                    type="number"
                    value={settings.startDay || 0}
                    onChange={(e) => updateFormSetting(formId, 'startDay', parseInt(e.target.value))}
                    placeholder="0"
                    className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-orange-500"
                  />
                  <p className="text-xs text-gray-500 mt-0.5">Days from visit</p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Duration (days)</label>
                  <input
                    type="number"
                    value={settings.duration || 1}
                    onChange={(e) => updateFormSetting(formId, 'duration', parseInt(e.target.value))}
                    placeholder="1"
                    className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-orange-500"
                  />
                  <p className="text-xs text-gray-500 mt-0.5">Fill window</p>
                </div>
              </div>
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.required !== false}
                  onChange={(e) => updateFormSetting(formId, 'required', e.target.checked)}
                  className="rounded text-orange-500 focus:ring-orange-500"
                />
                <span className="ml-2 text-xs text-gray-700">Required</span>
              </label>
            </div>
          </div>
        )
      })}
    </div>
  </CollapsibleSection>
)

const VisitPropertiesSection = ({ expandedSections, toggleSection }) => (
  <CollapsibleSection
    title="Visit Properties"
    isExpanded={expandedSections.properties}
    onToggle={() => toggleSection('properties')}
  >
    <div className="px-6 pb-4">
      <p className="text-xs text-gray-500 mb-3">Conditional logic for when this visit should occur</p>
      <button className="w-full px-3 py-2 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-600 hover:border-orange-500 hover:text-orange-600 transition-colors">
        + Add Condition
      </button>
      <p className="text-xs text-gray-400 mt-2 italic">Coming soon: IF Form.Field &gt; Value THEN show visit</p>
    </div>
  </CollapsibleSection>
)

export default VisitPanel
