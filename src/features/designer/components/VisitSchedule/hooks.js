import { useState, useEffect, useCallback } from 'react'
import toast from 'react-hot-toast'
import { dialog } from '../../../../shared/hooks/useDialog'

const DEFAULT_VISIT_DATA = {
  name: '',
  day: '',
  windowEarly: '',
  windowLate: '',
  type: 'site',
  isUnscheduled: false,
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
  properties: false
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
  const [isFinalized, setIsFinalized] = useState(false)
  const [finalizedSnapshot, setFinalizedSnapshot] = useState(null)
  const [pendingChanges, setPendingChanges] = useState([])

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

      const savedFinalized = localStorage.getItem(`study-${studyId}-finalized`)
      if (savedFinalized) {
        const finalizedData = JSON.parse(savedFinalized)
        setIsFinalized(finalizedData.isFinalized)
        setFinalizedSnapshot(finalizedData.snapshot)
      }

      const savedChanges = localStorage.getItem(`study-${studyId}-pending-changes`)
      if (savedChanges) {
        setPendingChanges(JSON.parse(savedChanges))
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

  const saveVisit = useCallback((wizardData) => {
    // Support both old panel data and new wizard data
    const data = wizardData || visitData

    if (!data.name) {
      toast.error('Please fill in required field: Visit Name')
      return
    }

    if (!data.isUnscheduled && !data.day) {
      toast.error('Please fill in Study Day for scheduled visits')
      return
    }

    // Handle both wizard format (locationType, window) and old format (type, windowEarly/windowLate)
    const window = parseInt(data.window) || parseInt(data.windowEarly) || 0

    const visitToSave = {
      ...data,
      type: data.locationType || data.type || 'site',
      day: data.isUnscheduled ? null : parseInt(data.day),
      windowEarly: 0, // No negative tolerance
      windowLate: data.isUnscheduled ? 0 : (parseInt(data.windowLate) || window),
      offsetValue: (data.anchorVisit !== 'this' && !data.isUnscheduled) ? parseInt(data.offsetValue) : null
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

  const deleteVisit = useCallback(async (id) => {
    const confirmed = await dialog.confirm({
      title: 'Delete Visit',
      message: 'Are you sure you want to delete this visit? This action cannot be undone.',
      confirmText: 'Delete Visit',
      cancelText: 'Cancel',
      variant: 'danger',
      icon: 'danger'
    })

    if (confirmed) {
      setVisits(prev => prev.filter(v => v.id !== id))
      if (selectedVisit && selectedVisit.id === id) {
        closePanel()
      }
      toast.success('Visit deleted successfully')
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
            [formId]: { startDay: 0, duration: 1, required: true }
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

  const updateVisitDay = useCallback((visitId, newDay) => {
    setVisits(prev => sortVisits(
      prev.map(v => v.id === visitId ? { ...v, day: newDay } : v)
    ))
    toast.success('Visit repositioned successfully')
  }, [])

  const finalizeVisit = useCallback((visitId) => {
    setVisits(prev => prev.map(v =>
      v.id === visitId ? { ...v, finalized: true, finalizedAt: new Date().toISOString() } : v
    ))
    toast.success('Visit finalized successfully')
  }, [])

  const unfinalizeVisit = useCallback((visitId) => {
    setVisits(prev => prev.map(v =>
      v.id === visitId ? { ...v, finalized: false, finalizedAt: null } : v
    ))
    toast.success('Visit unfinalized - you can now edit it')
  }, [])

  const finalizeSchedule = useCallback(() => {
    const snapshot = {
      visits: JSON.parse(JSON.stringify(visits)),
      timestamp: new Date().toISOString()
    }
    setIsFinalized(true)
    setFinalizedSnapshot(snapshot)
    setPendingChanges([])

    if (studyId) {
      localStorage.setItem(`study-${studyId}-finalized`, JSON.stringify({
        isFinalized: true,
        snapshot
      }))
      localStorage.removeItem(`study-${studyId}-pending-changes`)
    }

    toast.success('Visit schedule finalized successfully')
  }, [visits, studyId])

  const detectChanges = useCallback(() => {
    if (!isFinalized || !finalizedSnapshot) return []

    const changes = []
    const snapshotVisits = finalizedSnapshot.visits

    // Check for added visits
    visits.forEach(visit => {
      const existedBefore = snapshotVisits.find(v => v.id === visit.id)
      if (!existedBefore) {
        changes.push({
          type: 'added',
          visitName: visit.name,
          description: `Visit "${visit.name}" was added after finalization`
        })
      }
    })

    // Check for removed visits
    snapshotVisits.forEach(snapshotVisit => {
      const existsNow = visits.find(v => v.id === snapshotVisit.id)
      if (!existsNow) {
        changes.push({
          type: 'removed',
          visitName: snapshotVisit.name,
          description: `Visit "${snapshotVisit.name}" was removed after finalization`
        })
      }
    })

    // Check for modified visits
    visits.forEach(visit => {
      const snapshotVisit = snapshotVisits.find(v => v.id === visit.id)
      if (snapshotVisit) {
        // Compare key properties
        if (visit.name !== snapshotVisit.name ||
            visit.day !== snapshotVisit.day ||
            JSON.stringify(visit.forms) !== JSON.stringify(snapshotVisit.forms)) {
          changes.push({
            type: 'modified',
            visitName: visit.name,
            description: `Visit "${visit.name}" was modified after finalization`
          })
        }
      }
    })

    return changes
  }, [visits, isFinalized, finalizedSnapshot])

  const approveChanges = useCallback(() => {
    // Update the snapshot to current state
    const newSnapshot = {
      visits: JSON.parse(JSON.stringify(visits)),
      timestamp: new Date().toISOString()
    }
    setFinalizedSnapshot(newSnapshot)
    setPendingChanges([])

    if (studyId) {
      localStorage.setItem(`study-${studyId}-finalized`, JSON.stringify({
        isFinalized: true,
        snapshot: newSnapshot
      }))
      localStorage.removeItem(`study-${studyId}-pending-changes`)
    }

    toast.success('Changes approved and finalized')
  }, [visits, studyId])

  const unfinalizeSchedule = useCallback(() => {
    setIsFinalized(false)
    setFinalizedSnapshot(null)
    setPendingChanges([])

    if (studyId) {
      localStorage.removeItem(`study-${studyId}-finalized`)
      localStorage.removeItem(`study-${studyId}-pending-changes`)
    }

    toast.success('Visit schedule unfinalized')
  }, [studyId])

  // Detect changes whenever visits change and schedule is finalized
  useEffect(() => {
    if (isFinalized && finalizedSnapshot) {
      const changes = detectChanges()
      setPendingChanges(changes)

      if (studyId && changes.length > 0) {
        localStorage.setItem(`study-${studyId}-pending-changes`, JSON.stringify(changes))
      }
    }
  }, [visits, isFinalized, finalizedSnapshot, detectChanges, studyId])

  return {
    // State
    visits,
    availableForms,
    selectedVisit,
    isPanelOpen,
    isEditing,
    expandedSections,
    visitData,
    isFinalized,
    finalizedSnapshot,
    pendingChanges,

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
    updateVisitDay,
    finalizeVisit,
    unfinalizeVisit,
    finalizeSchedule,
    unfinalizeSchedule,
    approveChanges,
    detectChanges
  }
}
