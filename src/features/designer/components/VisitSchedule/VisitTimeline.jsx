import { useState, useRef, useEffect } from 'react'

const VisitTimeline = ({
  visits,
  onEditVisit,
  onDeleteVisit,
  getFormName,
  updateVisitDay
}) => {
  const timelineRef = useRef(null)
  const [draggedVisit, setDraggedVisit] = useState(null)
  const [hoveredVisit, setHoveredVisit] = useState(null)

  // Calculate timeline range
  const scheduledVisits = visits.filter((v) => !v.isUnscheduled)
  const maxDay = Math.max(
    ...scheduledVisits.map((v) => v.day || 0),
    100 // minimum range
  )
  const timelineEnd = Math.ceil((maxDay + 50) / 50) * 50

  // Day markers (every 10 days)
  const dayMarkers = []
  for (let day = 0; day <= timelineEnd; day += 10) {
    dayMarkers.push(day)
  }

  const getDayPosition = (day) => {
    return (day / timelineEnd) * 100
  }

  const handleDragStart = (e, visit) => {
    setDraggedVisit(visit)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragEnd = () => {
    setDraggedVisit(null)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e) => {
    e.preventDefault()
    if (!draggedVisit || draggedVisit.isUnscheduled) return

    const timelineRect = timelineRef.current.getBoundingClientRect()
    const clickX = e.clientX - timelineRect.left
    const percentage = clickX / timelineRect.width
    const newDay = Math.max(0, Math.round(percentage * timelineEnd))

    // Only update if the day has actually changed
    if (newDay !== draggedVisit.day) {
      updateVisitDay(draggedVisit.id, newDay)
    }

    setDraggedVisit(null)
  }

  return (
    <div className="space-y-6">
      {/* Scheduled Visits Timeline */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <svg className="w-5 h-5 mr-2 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            Visit Timeline
          </h3>
          <p className="text-sm text-gray-500 mt-1">Scheduled visits visualized on study timeline</p>
        </div>

        <div className="p-6">
          {scheduledVisits.length > 0 ? (
            <div
              ref={timelineRef}
              className="relative min-h-[400px] bg-gradient-to-b from-gray-50 to-white rounded-lg border-2 border-gray-200 p-6"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              {/* Day Markers */}
              <div className="absolute top-6 left-6 right-6 h-0.5 bg-gradient-to-r from-orange-300 via-orange-500 to-orange-300"></div>
              <div className="absolute top-0 left-6 right-6 flex justify-between">
                {dayMarkers.map((day) => (
                  <div key={day} className="relative flex flex-col items-center" style={{ left: `${getDayPosition(day)}%` }}>
                    <div className="w-0.5 h-8 bg-orange-400"></div>
                    <span className="mt-1 text-xs font-semibold text-gray-700 bg-white px-2 py-0.5 rounded shadow-sm">
                      Day {day}
                    </span>
                  </div>
                ))}
              </div>

              {/* Visits */}
              <div className="mt-16 space-y-4">
                {scheduledVisits.map((visit, index) => {
                  const hasConditions = visit.conditions && visit.conditions.length > 0

                  return (
                    <div key={visit.id} className="relative">
                      {/* Main Visit */}
                      <div
                        className="absolute transition-all duration-200"
                        style={{
                          left: `${getDayPosition(visit.day)}%`,
                          transform: 'translateX(-50%)',
                          zIndex: hoveredVisit === visit.id ? 50 : 10 + index
                        }}
                        draggable
                        onDragStart={(e) => handleDragStart(e, visit)}
                        onDragEnd={handleDragEnd}
                        onMouseEnter={() => setHoveredVisit(visit.id)}
                        onMouseLeave={() => setHoveredVisit(null)}
                      >
                        <div
                          className={`bg-white border-2 rounded-lg shadow-lg cursor-move hover:shadow-xl transition-all ${
                            draggedVisit?.id === visit.id
                              ? 'opacity-50 scale-95'
                              : hoveredVisit === visit.id
                              ? 'border-orange-500 scale-105'
                              : 'border-gray-300'
                          }`}
                          style={{ minWidth: '220px', maxWidth: '240px' }}
                        >
                          {/* Visit Header */}
                          <div className={`px-4 py-2.5 flex items-center justify-between ${
                            visit.type === 'site' ? 'bg-gradient-to-r from-blue-500 to-blue-600' : 'bg-gradient-to-r from-green-500 to-green-600'
                          }`}>
                            <div className="flex items-center flex-1 min-w-0">
                              <span className="text-xl mr-2">{visit.type === 'site' ? '🏥' : '🏠'}</span>
                              <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-bold text-white truncate">{visit.name}</h4>
                                <p className="text-xs text-blue-100">
                                  Day {visit.day} {visit.windowLate > 0 && `(+${visit.windowLate})`}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-1 ml-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  onEditVisit(visit)
                                }}
                                className="p-1 text-white hover:bg-white/20 rounded transition-colors"
                                title="Edit visit"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  onDeleteVisit(visit.id)
                                }}
                                className="p-1 text-white hover:bg-red-500 rounded transition-colors"
                                title="Delete visit"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          </div>

                          {/* Visit Body */}
                          <div className="px-4 py-3">
                            {/* Forms */}
                            {visit.forms && visit.forms.length > 0 ? (
                              <div className="space-y-1">
                                <div className="flex items-center text-xs text-gray-500 mb-1">
                                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                  </svg>
                                  {visit.forms.length} form{visit.forms.length !== 1 ? 's' : ''}
                                </div>
                                {visit.forms.slice(0, 3).map((formId) => (
                                  <div key={formId} className="text-xs text-gray-700 truncate">
                                    • {getFormName(formId)}
                                  </div>
                                ))}
                                {visit.forms.length > 3 && (
                                  <div className="text-xs text-gray-500 italic">
                                    +{visit.forms.length - 3} more
                                  </div>
                                )}
                              </div>
                            ) : (
                              <div className="text-xs text-gray-400 italic">No forms assigned</div>
                            )}

                            {/* Conditions Badge */}
                            {hasConditions && (
                              <div className="mt-2 inline-flex items-center px-2 py-0.5 bg-purple-100 text-purple-800 text-xs font-semibold rounded">
                                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                                Conditional
                              </div>
                            )}
                          </div>

                          {/* Drag Handle Indicator */}
                          <div className="px-4 py-2 border-t border-gray-200 bg-gray-50 flex items-center justify-center">
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                            </svg>
                            <span className="ml-2 text-xs text-gray-500">Drag to reposition</span>
                          </div>
                        </div>

                        {/* Branching Logic Indicator */}
                        {hasConditions && (
                          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                            <div className="bg-purple-500 text-white px-2 py-1 rounded-full text-xs font-semibold shadow-lg flex items-center">
                              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                              </svg>
                              If condition met
                            </div>
                            <div className="w-0.5 h-6 bg-purple-400 mx-auto"></div>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Empty State for Dragging */}
              {draggedVisit && (
                <div className="absolute inset-0 bg-orange-50/50 border-2 border-dashed border-orange-300 rounded-lg flex items-center justify-center pointer-events-none">
                  <div className="text-center">
                    <svg className="w-12 h-12 text-orange-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                    </svg>
                    <p className="text-sm font-semibold text-orange-700">Drop to reposition visit</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-1">No Scheduled Visits</h4>
              <p className="text-sm text-gray-500">Create scheduled visits to see them on the timeline</p>
            </div>
          )}
        </div>
      </div>

      {/* Unscheduled Visits */}
      {visits.filter((v) => v.isUnscheduled).length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 bg-yellow-50 border-b border-yellow-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <svg className="w-5 h-5 mr-2 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Unscheduled Visits
            </h3>
            <p className="text-sm text-gray-500 mt-1">These visits can occur at any time during the study</p>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {visits
              .filter((v) => v.isUnscheduled)
              .map((visit) => (
                <div
                  key={visit.id}
                  className="bg-white border-2 border-yellow-300 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="px-4 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 flex items-center justify-between">
                    <div className="flex items-center flex-1 min-w-0">
                      <span className="text-xl mr-2">📅</span>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-white truncate">{visit.name}</h4>
                        <p className="text-xs text-yellow-100">Anytime</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 ml-2">
                      <button
                        onClick={() => onEditVisit(visit)}
                        className="p-1 text-white hover:bg-white/20 rounded transition-colors"
                        title="Edit visit"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => onDeleteVisit(visit.id)}
                        className="p-1 text-white hover:bg-red-500 rounded transition-colors"
                        title="Delete visit"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div className="px-4 py-3">
                    {visit.forms && visit.forms.length > 0 ? (
                      <div className="space-y-1">
                        <div className="flex items-center text-xs text-gray-500 mb-1">
                          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          {visit.forms.length} form{visit.forms.length !== 1 ? 's' : ''}
                        </div>
                        {visit.forms.slice(0, 2).map((formId) => (
                          <div key={formId} className="text-xs text-gray-700 truncate">
                            • {getFormName(formId)}
                          </div>
                        ))}
                        {visit.forms.length > 2 && (
                          <div className="text-xs text-gray-500 italic">
                            +{visit.forms.length - 2} more
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-xs text-gray-400 italic">No forms assigned</div>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default VisitTimeline
