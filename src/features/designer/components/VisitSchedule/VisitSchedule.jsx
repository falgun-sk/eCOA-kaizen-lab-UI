import { useParams, useNavigate } from 'react-router-dom'
import { useVisitSchedule } from './hooks'
import VisitCard from './VisitCard'
import VisitPanel from './VisitPanel'

const VisitSchedule = () => {
  const { studyId } = useParams()
  const navigate = useNavigate()

  const {
    visits,
    availableForms,
    selectedVisit,
    isPanelOpen,
    isEditing,
    expandedSections,
    visitData,
    setVisitData,
    toggleSection,
    openPanelForNew,
    openPanelForEdit,
    closePanel,
    saveVisit,
    deleteVisit,
    toggleFormAssignment,
    updateFormSetting,
    getFormName,
    generateCycles
  } = useVisitSchedule(studyId)

  return (
    <div className="flex-1 flex bg-gray-50">
      {/* Main Area - Timeline */}
      <div className={`transition-all duration-300 ${isPanelOpen ? 'w-[70%]' : 'w-full'}`}>
        {/* Header */}
        <VisitScheduleHeader
          studyId={studyId}
          navigate={navigate}
          onAddVisit={openPanelForNew}
        />

        {/* Visit Timeline */}
        <div className="p-8 overflow-auto" style={{ height: 'calc(100vh - 180px)' }}>
          {visits.length === 0 ? (
            <EmptyState onAddVisit={openPanelForNew} />
          ) : (
            <div className="space-y-6">
              {visits.map((visit, index) => (
                <VisitCard
                  key={visit.id}
                  visit={visit}
                  index={index}
                  isSelected={selectedVisit && selectedVisit.id === visit.id}
                  cycles={generateCycles(visit)}
                  getFormName={getFormName}
                  onEdit={openPanelForEdit}
                  onDelete={deleteVisit}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Side Panel */}
      <VisitPanel
        isOpen={isPanelOpen}
        isEditing={isEditing}
        selectedVisit={selectedVisit}
        visitData={visitData}
        setVisitData={setVisitData}
        expandedSections={expandedSections}
        toggleSection={toggleSection}
        availableForms={availableForms}
        visits={visits}
        onClose={closePanel}
        onSave={saveVisit}
        toggleFormAssignment={toggleFormAssignment}
        updateFormSetting={updateFormSetting}
        getFormName={getFormName}
      />
    </div>
  )
}

const VisitScheduleHeader = ({ studyId, navigate, onAddVisit }) => (
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
          <h1 className="text-2xl font-semibold text-gray-900">Visit Schedule</h1>
          <p className="text-sm text-gray-500 mt-1">Configure study visits and form mappings</p>
        </div>
        <button
          onClick={onAddVisit}
          className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white text-sm font-semibold rounded-lg shadow-md shadow-orange-500/30 transition-all duration-200"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Visit
        </button>
      </div>
    </div>
  </div>
)

const EmptyState = ({ onAddVisit }) => (
  <div className="flex items-center justify-center h-96">
    <div className="text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gray-100 mb-4">
        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-1">No Visits Scheduled</h3>
      <p className="text-sm text-gray-500 mb-4">Create your first visit to get started</p>
      <button
        onClick={onAddVisit}
        className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-semibold rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all"
      >
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Add First Visit
      </button>
    </div>
  </div>
)

export default VisitSchedule
