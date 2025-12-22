import { useState, useEffect, useCallback } from 'react'

const DEFAULT_VISIT_DATA = {
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
}

const DEFAULT_EXPANDED_SECTIONS = {
  details: true,
  forms: true,
  formSettings: false,
  properties: false,
  cycles: false
}

/**
 * Custom hook for managing visit schedule state
 */
export const useVisitSchedule = (studyId) => {
  const [visits, setVisits] = useState([])
  const [availableForms, setAvailableForms] = useState([])
  const [selectedVisit, setSelectedVisit] = useState(null)
  const [isPanelOpen, setIsPanelOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [expandedSections, setExpandedSections] = useState(DEFAULT_EXPANDED_SECTIONS)
  const [visitData, setVisitData] = useState(DEFAULT_VISIT_DATA)

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

  const toggleSection = useCallback((section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }))
  }, [])

  const openPanelForNew = useCallback(() => {
    setIsEditing(false)
    setSelectedVisit(null)
    setVisitData(DEFAULT_VISIT_DATA)
    setIsPanelOpen(true)
    setExpandedSections(DEFAULT_EXPANDED_SECTIONS)
  }, [])

  const openPanelForEdit = useCallback((visit) => {
    setIsEditing(true)
    setSelectedVisit(visit)
    setVisitData({ ...visit })
    setIsPanelOpen(true)
    setExpandedSections(DEFAULT_EXPANDED_SECTIONS)
  }, [])

  const closePanel = useCallback(() => {
    setIsPanelOpen(false)
    setSelectedVisit(null)
    setIsEditing(false)
  }, [])

  const sortVisits = (visitsArray) => {
    return visitsArray.sort((a, b) => {
      if (a.isUnscheduled && !b.isUnscheduled) return 1
      if (!a.isUnscheduled && b.isUnscheduled) return -1
      if (a.isUnscheduled && b.isUnscheduled) return 0
      return (a.day || 0) - (b.day || 0)
    })
  }

  const saveVisit = useCallback(() => {
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
      setVisits(prev => sortVisits(
        prev.map(v => v.id === selectedVisit.id ? { ...visitToSave, id: selectedVisit.id } : v)
      ))
    } else {
      const newVisit = { ...visitToSave, id: Date.now() }
      setVisits(prev => sortVisits([...prev, newVisit]))
    }

    closePanel()
  }, [visitData, isEditing, selectedVisit, closePanel])

  const deleteVisit = useCallback((id) => {
    if (window.confirm('Are you sure you want to delete this visit?')) {
      setVisits(prev => prev.filter(v => v.id !== id))
      if (selectedVisit && selectedVisit.id === id) {
        closePanel()
      }
    }
  }, [selectedVisit, closePanel])

  const toggleFormAssignment = useCallback((formId) => {
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
  }, [])

  const updateFormSetting = useCallback((formId, field, value) => {
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
  }, [])

  const getFormName = useCallback((formId) => {
    const form = availableForms.find(f => f.id === formId)
    return form ? form.name : 'Unknown Form'
  }, [availableForms])

  const generateCycles = useCallback((visit) => {
    if (!visit.repeats || !visit.repeatUntil) return []
    const cycles = []
    for (let i = 1; i <= visit.repeatUntil; i++) {
      cycles.push({
        cycle: i,
        day: visit.day + (visit.repeatEvery * (i - 1))
      })
    }
    return cycles
  }, [])

  return {
    // State
    visits,
    availableForms,
    selectedVisit,
    isPanelOpen,
    isEditing,
    expandedSections,
    visitData,

    // Setters
    setVisitData,

    // Actions
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
  }
}
