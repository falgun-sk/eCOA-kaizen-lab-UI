import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useVisitSchedule } from './hooks'
import VisitCard from './VisitCard'
import VisitWizard from './VisitWizard'
import VisitTimeline from './VisitTimeline'

const VisitSchedule = () => {
  const { studyId } = useParams()
  const navigate = useNavigate()
  const [viewMode, setViewMode] = useState('list') // 'list' or 'timeline'

  const {
    visits,
    availableForms,
    selectedVisit,
    isPanelOpen,
    isEditing,
    expandedSections,
    visitData,
    isFinalized,
    pendingChanges,
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
    updateVisitDay,
    finalizeVisit,
    unfinalizeVisit,
    finalizeSchedule,
    unfinalizeSchedule,
    approveChanges
  } = useVisitSchedule(studyId)

  return (
    <div className="flex-1 flex flex-col bg-gray-50">
      {/* Header */}
      <VisitScheduleHeader
        studyId={studyId}
        navigate={navigate}
        viewMode={viewMode}
        setViewMode={setViewMode}
        openPanelForNew={openPanelForNew}
      />

      {/* Change Detection Banner */}
      {pendingChanges && pendingChanges.length > 0 && (
        <ChangeDetectionBanner
          changes={pendingChanges}
          onApproveChanges={approveChanges}
        />
      )}

      {/* Content Area */}
      <div className="flex-1 p-8 overflow-auto">
        {visits.length === 0 ? (
          <EmptyState />
        ) : viewMode === 'timeline' ? (
          <VisitTimeline
            visits={visits}
            onEditVisit={openPanelForEdit}
            onDeleteVisit={deleteVisit}
            getFormName={getFormName}
            updateVisitDay={updateVisitDay}
          />
        ) : (
          <div className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden">
            {/* Finalize Status Bar */}
            <div className="flex items-center justify-end gap-2 px-6 py-3 bg-gray-50">
              {isFinalized ? (
                <>
                  <span className="inline-flex items-center px-2.5 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded border border-green-300">
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Finalized
                  </span>
                  <button
                    onClick={unfinalizeSchedule}
                    className="inline-flex items-center px-2.5 py-1 bg-white text-gray-700 text-xs font-medium rounded border border-gray-300 hover:bg-gray-50 transition-all"
                  >
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit Schedule
                  </button>
                </>
              ) : (
                <button
                  onClick={finalizeSchedule}
                  className="inline-flex items-center px-2.5 py-1 bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium rounded transition-all"
                >
                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Finalize Schedule
                </button>
              )}
            </div>

            {/* Visit Cards */}
            <div>
              {visits.map((visit, index) => (
                <div key={visit.id} className="p-6">
                  <VisitCard
                    visit={visit}
                    index={index}
                    isSelected={selectedVisit && selectedVisit.id === visit.id}
                    getFormName={getFormName}
                    onEdit={openPanelForEdit}
                    onDelete={deleteVisit}
                    onFinalize={finalizeVisit}
                    onUnfinalize={unfinalizeVisit}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Wizard Modal */}
      <VisitWizard
        isOpen={isPanelOpen}
        onClose={closePanel}
        onSave={saveVisit}
        isEditing={isEditing}
        selectedVisit={selectedVisit}
        availableForms={availableForms}
        visits={visits}
      />
    </div>
  )
}

const VisitScheduleHeader = ({ studyId, navigate, viewMode, setViewMode, openPanelForNew }) => (
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
        <div className="flex items-center gap-3">
          {/* View Toggle */}
          <div className="inline-flex items-center bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('list')}
              className={`inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                viewMode === 'list'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
              List
            </button>
            <button
              onClick={() => setViewMode('timeline')}
              className={`inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                viewMode === 'timeline'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              Timeline
            </button>
          </div>

          {/* Add Visit Button */}
          <button
            onClick={openPanelForNew}
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
  </div>
)

const ChangeDetectionBanner = ({ changes, onApproveChanges }) => (
  <div className="bg-amber-50 border-y-2 border-amber-300">
    <div className="px-8 py-4">
      <div className="flex items-start justify-between">
        <div className="flex items-start flex-1">
          <div className="flex-shrink-0">
            <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div className="ml-3 flex-1">
            <h3 className="text-sm font-semibold text-amber-900">
              Schedule Changes Detected
            </h3>
            <div className="mt-2 text-sm text-amber-800">
              <p className="mb-2">
                The visit schedule has been modified after finalization. The following changes require approval:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                {changes.slice(0, 5).map((change, index) => (
                  <li key={index} className={`${
                    change.type === 'added' ? 'text-green-700' :
                    change.type === 'removed' ? 'text-red-700' :
                    'text-blue-700'
                  }`}>
                    <span className="font-semibold capitalize">{change.type}:</span> {change.description}
                  </li>
                ))}
                {changes.length > 5 && (
                  <li className="text-amber-700 italic">
                    +{changes.length - 5} more change{changes.length - 5 !== 1 ? 's' : ''}
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
        <button
          onClick={onApproveChanges}
          className="ml-4 inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white text-sm font-semibold rounded-lg shadow-md transition-all"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Approve Changes
        </button>
      </div>
    </div>
  </div>
)

const EmptyState = () => (
  <div className="flex items-center justify-center h-96">
    <div className="text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gray-100 mb-4">
        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-1">No Visits Scheduled</h3>
      <p className="text-sm text-gray-500">Click "Add Visit" above to create your first visit</p>
    </div>
  </div>
)

export default VisitSchedule
