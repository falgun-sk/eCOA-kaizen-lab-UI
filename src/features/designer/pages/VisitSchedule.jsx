import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

const VisitSchedule = () => {
  const { studyId } = useParams()
  const navigate = useNavigate()

  const [visits, setVisits] = useState([])
  const [availableForms, setAvailableForms] = useState([])
  const [selectedVisit, setSelectedVisit] = useState(null)
  const [isPanelOpen, setIsPanelOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  // Collapsible sections state
  const [expandedSections, setExpandedSections] = useState({
    details: true,
    forms: true,
    formSettings: false,
    properties: false,
    cycles: false
  })

  const [visitData, setVisitData] = useState({
    name: '',
    day: '',
    windowEarly: '',
    windowLate: '',
    type: 'site',
    isUnscheduled: false,
    repeats: false,
    repeatEvery: '',
    repeatUnit: 'days',
    repeatUntil: '',
    anchorVisit: 'this',
    offsetValue: '',
    offsetUnit: 'days',
    forms: [],
    formSettings: {},
    conditions: []
  })

  // Load forms and visits from localStorage
  useEffect(() => {
    if (studyId) {
      const savedForms = localStorage.getItem(`study-${studyId}-forms`)
      if (savedForms) {
        setAvailableForms(JSON.parse(savedForms))
      }

      const savedVisits = localStorage.getItem(`study-${studyId}-visits`)
      if (savedVisits) {
        setVisits(JSON.parse(savedVisits))
      }
    }
  }, [studyId])

  // Save visits to localStorage
  useEffect(() => {
    if (studyId && visits.length > 0) {
      localStorage.setItem(`study-${studyId}-visits`, JSON.stringify(visits))
    }
  }, [visits, studyId])

  const toggleSection = (section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }))
  }

  const openPanelForNew = () => {
    setIsEditing(false)
    setSelectedVisit(null)
    setVisitData({
      name: '',
      day: '',
      windowEarly: '',
      windowLate: '',
      type: 'site',
      isUnscheduled: false,
      repeats: false,
      repeatEvery: '',
      repeatUnit: 'days',
      repeatUntil: '',
      anchorVisit: 'this',
      offsetValue: '',
      offsetUnit: 'days',
      forms: [],
      formSettings: {},
      conditions: []
    })
    setIsPanelOpen(true)
    setExpandedSections({
      details: true,
      forms: true,
      formSettings: false,
      properties: false,
      cycles: false
    })
  }

  const openPanelForEdit = (visit) => {
    setIsEditing(true)
    setSelectedVisit(visit)
    setVisitData({ ...visit })
    setIsPanelOpen(true)
    setExpandedSections({
      details: true,
      forms: true,
      formSettings: false,
      properties: false,
      cycles: false
    })
  }

  const closePanel = () => {
    setIsPanelOpen(false)
    setSelectedVisit(null)
    setIsEditing(false)
  }

  const saveVisit = () => {
    if (!visitData.name) {
      alert('Please fill in required field: Visit Name')
      return
    }

    if (!visitData.isUnscheduled && !visitData.day) {
      alert('Please fill in Study Day for scheduled visits')
      return
    }

    const visitToSave = {
      ...visitData,
      day: visitData.isUnscheduled ? null : parseInt(visitData.day),
      windowEarly: visitData.isUnscheduled ? 0 : (parseInt(visitData.windowEarly) || 0),
      windowLate: visitData.isUnscheduled ? 0 : (parseInt(visitData.windowLate) || 0),
      repeats: visitData.isUnscheduled ? false : visitData.repeats,
      repeatEvery: (visitData.repeats && !visitData.isUnscheduled) ? parseInt(visitData.repeatEvery) : null,
      repeatUntil: (visitData.repeats && !visitData.isUnscheduled) ? parseInt(visitData.repeatUntil) : null,
      offsetValue: (visitData.anchorVisit !== 'this' && !visitData.isUnscheduled) ? parseInt(visitData.offsetValue) : null
    }

    if (isEditing && selectedVisit) {
      // Update existing visit
      setVisits(visits.map(v =>
        v.id === selectedVisit.id ? { ...visitToSave, id: selectedVisit.id } : v
      ).sort((a, b) => {
        // Sort: scheduled visits by day, then unscheduled at end
        if (a.isUnscheduled && !b.isUnscheduled) return 1
        if (!a.isUnscheduled && b.isUnscheduled) return -1
        if (a.isUnscheduled && b.isUnscheduled) return 0
        return (a.day || 0) - (b.day || 0)
      }))
    } else {
      // Add new visit
      const newVisit = { ...visitToSave, id: Date.now() }
      setVisits([...visits, newVisit].sort((a, b) => {
        // Sort: scheduled visits by day, then unscheduled at end
        if (a.isUnscheduled && !b.isUnscheduled) return 1
        if (!a.isUnscheduled && b.isUnscheduled) return -1
        if (a.isUnscheduled && b.isUnscheduled) return 0
        return (a.day || 0) - (b.day || 0)
      }))
    }

    closePanel()
  }

  const deleteVisit = (id) => {
    if (window.confirm('Are you sure you want to delete this visit?')) {
      setVisits(visits.filter(v => v.id !== id))
      if (selectedVisit && selectedVisit.id === id) {
        closePanel()
      }
    }
  }

  const toggleFormAssignment = (formId) => {
    setVisitData(prev => ({
      ...prev,
      forms: prev.forms.includes(formId)
        ? prev.forms.filter(f => f !== formId)
        : [...prev.forms, formId],
      formSettings: prev.forms.includes(formId)
        ? { ...prev.formSettings, [formId]: undefined }
        : {
            ...prev.formSettings,
            [formId]: { startDay: 0, duration: 7, required: true }
          }
    }))
  }

  const updateFormSetting = (formId, field, value) => {
    setVisitData(prev => ({
      ...prev,
      formSettings: {
        ...prev.formSettings,
        [formId]: {
          ...prev.formSettings[formId],
          [field]: value
        }
      }
    }))
  }

  const getFormName = (formId) => {
    const form = availableForms.find(f => f.id === formId)
    return form ? form.name : 'Unknown Form'
  }

  const generateCycles = (visit) => {
    if (!visit.repeats || !visit.repeatUntil) return []
    const cycles = []
    for (let i = 1; i <= visit.repeatUntil; i++) {
      cycles.push({
        cycle: i,
        day: visit.day + (visit.repeatEvery * (i - 1))
      })
    }
    return cycles
  }

  return (
    <div className="flex-1 flex bg-gray-50">
      {/* Main Area - Timeline */}
      <div className={`transition-all duration-300 ${isPanelOpen ? 'w-[70%]' : 'w-full'}`}>
        {/* Header */}
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

        {/* Visit Timeline */}
        <div className="p-8 overflow-auto" style={{ height: 'calc(100vh - 180px)' }}>
          {visits.length === 0 ? (
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
                  onClick={openPanelForNew}
                  className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-semibold rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add First Visit
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {visits.map((visit, index) => {
                const cycles = generateCycles(visit)
                const isSelected = selectedVisit && selectedVisit.id === visit.id

                return (
                  <div
                    key={visit.id}
                    className={`bg-white rounded-xl border-2 transition-all cursor-pointer ${
                      isSelected
                        ? 'border-orange-500 shadow-lg shadow-orange-500/20'
                        : 'border-gray-200 hover:border-orange-300 hover:shadow-md'
                    }`}
                    onClick={() => openPanelForEdit(visit)}
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-orange-100 to-orange-200">
                            <span className="text-lg font-bold text-orange-600">{index + 1}</span>
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-lg font-semibold text-gray-900">{visit.name}</h3>
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
                            </div>
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

                            {/* Cycles Display */}
                            {cycles.length > 0 && (
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
                            )}

                            {/* Assigned Forms */}
                            <div className="mt-4">
                              <span className="text-xs text-gray-500">Assigned Forms ({visit.forms.length}):</span>
                              {visit.forms.length > 0 ? (
                                <div className="flex flex-wrap gap-2 mt-2">
                                  {visit.forms.map((formId) => (
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
                          </div>
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            deleteVisit(visit.id)
                          }}
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>

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
              })}
            </div>
          )}
        </div>
      </div>

      {/* Side Panel */}
      {isPanelOpen && (
        <div className="w-[30%] bg-white border-l border-gray-200 flex flex-col shadow-2xl">
          {/* Panel Header */}
          <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-orange-500 to-orange-600">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">
                {isEditing ? `Edit: ${selectedVisit?.name || 'Visit'}` : 'Add New Visit'}
              </h2>
              <button
                onClick={closePanel}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Panel Content */}
          <div className="flex-1 overflow-y-auto">
            {/* Basic Details Section */}
            <div className="border-b border-gray-200">
              <button
                onClick={() => toggleSection('details')}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <span className="text-sm font-semibold text-gray-900">Basic Details</span>
                <svg
                  className={`w-5 h-5 text-gray-500 transition-transform ${expandedSections.details ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {expandedSections.details && (
                <div className="px-6 pb-4 space-y-4">
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

                  {/* Show these fields only for scheduled visits */}
                  {!visitData.isUnscheduled && (
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

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Early Window (days)</label>
                          <input
                            type="number"
                            value={visitData.windowEarly}
                            onChange={(e) => setVisitData({ ...visitData, windowEarly: e.target.value })}
                            placeholder="3"
                            min="0"
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Late Window (days)</label>
                          <input
                            type="number"
                            value={visitData.windowLate}
                            onChange={(e) => setVisitData({ ...visitData, windowLate: e.target.value })}
                            placeholder="3"
                            min="0"
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                          />
                        </div>
                      </div>

                      {/* Repeating Visit */}
                      <div>
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={visitData.repeats}
                            onChange={(e) => setVisitData({ ...visitData, repeats: e.target.checked })}
                            className="rounded text-orange-500 focus:ring-orange-500 mr-2"
                          />
                          <span className="text-sm text-gray-700">This visit repeats</span>
                        </label>
                      </div>
                    </>
                  )}

                  {visitData.repeats && !visitData.isUnscheduled && (
                    <div className="pl-6 space-y-3 border-l-2 border-orange-200">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Every</label>
                          <input
                            type="number"
                            value={visitData.repeatEvery}
                            onChange={(e) => setVisitData({ ...visitData, repeatEvery: e.target.value })}
                            placeholder="28"
                            min="1"
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Unit</label>
                          <select
                            value={visitData.repeatUnit}
                            onChange={(e) => setVisitData({ ...visitData, repeatUnit: e.target.value })}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                          >
                            <option value="days">Days</option>
                            <option value="weeks">Weeks</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Repeat Until (cycles)</label>
                        <input
                          type="number"
                          value={visitData.repeatUntil}
                          onChange={(e) => setVisitData({ ...visitData, repeatUntil: e.target.value })}
                          placeholder="6"
                          min="1"
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                      </div>
                    </div>
                  )}

                  {/* Anchor Visit - Only for scheduled visits */}
                  {!visitData.isUnscheduled && (
                    <>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Anchor Visit</label>
                        <select
                          value={visitData.anchorVisit}
                          onChange={(e) => setVisitData({ ...visitData, anchorVisit: e.target.value })}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                        >
                          <option value="this">This visit</option>
                          {visits.filter(v => !isEditing || v.id !== selectedVisit.id).map(v => (
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
                  )}
                </div>
              )}
            </div>

            {/* Assigned Forms Section */}
            <div className="border-b border-gray-200">
              <button
                onClick={() => toggleSection('forms')}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-gray-900">Assigned Forms</span>
                  <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-xs font-medium rounded-full">
                    {visitData.forms.length}
                  </span>
                </div>
                <svg
                  className={`w-5 h-5 text-gray-500 transition-transform ${expandedSections.forms ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {expandedSections.forms && (
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
              )}
            </div>

            {/* Form Settings Section */}
            {visitData.forms.length > 0 && (
              <div className="border-b border-gray-200">
                <button
                  onClick={() => toggleSection('formSettings')}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <span className="text-sm font-semibold text-gray-900">Form Settings</span>
                  <svg
                    className={`w-5 h-5 text-gray-500 transition-transform ${expandedSections.formSettings ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {expandedSections.formSettings && (
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
                                  value={settings.duration || 7}
                                  onChange={(e) => updateFormSetting(formId, 'duration', parseInt(e.target.value))}
                                  placeholder="7"
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
                )}
              </div>
            )}

            {/* Visit Properties Section */}
            <div className="border-b border-gray-200">
              <button
                onClick={() => toggleSection('properties')}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <span className="text-sm font-semibold text-gray-900">Visit Properties</span>
                <svg
                  className={`w-5 h-5 text-gray-500 transition-transform ${expandedSections.properties ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {expandedSections.properties && (
                <div className="px-6 pb-4">
                  <p className="text-xs text-gray-500 mb-3">Conditional logic for when this visit should occur</p>
                  <button className="w-full px-3 py-2 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-600 hover:border-orange-500 hover:text-orange-600 transition-colors">
                    + Add Condition
                  </button>
                  <p className="text-xs text-gray-400 mt-2 italic">Coming soon: IF Form.Field &gt; Value THEN show visit</p>
                </div>
              )}
            </div>
          </div>

          {/* Panel Footer */}
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-end gap-3">
            <button
              onClick={closePanel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={saveVisit}
              className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg hover:from-orange-600 hover:to-orange-700 transition-colors"
            >
              {isEditing ? 'Update Visit' : 'Save Visit'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default VisitSchedule
