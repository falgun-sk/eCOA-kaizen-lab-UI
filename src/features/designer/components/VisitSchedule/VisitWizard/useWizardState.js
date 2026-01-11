import { useState, useEffect } from 'react'

const DEFAULT_VISIT_DATA = {
  name: '',
  visitType: 'scheduled', // 'scheduled', 'unscheduled'
  locationType: 'site', // 'site', 'remote'
  day: '',
  window: '3',
  type: 'site',
  isUnscheduled: false,
  anchorVisit: 'this',
  offsetValue: '',
  offsetUnit: 'days',
  forms: [],
  formSettings: {},
  windowEarly: '3',
  windowLate: '7'
}

export const useWizardState = (selectedVisit, isEditing) => {
  const [visitData, setVisitData] = useState(DEFAULT_VISIT_DATA)

  // Populate data when editing
  useEffect(() => {
    if (isEditing && selectedVisit) {
      // Map the visit type to wizard format
      let visitType = 'scheduled'
      if (selectedVisit.isUnscheduled) {
        visitType = 'unscheduled'
      }

      setVisitData({
        ...selectedVisit,
        visitType,
        locationType: selectedVisit.type || 'site',
        window: selectedVisit.windowEarly?.toString() || '3',
        day: selectedVisit.day?.toString() || ''
      })
    } else {
      setVisitData(DEFAULT_VISIT_DATA)
    }
  }, [selectedVisit, isEditing])

  const updateField = (field, value) => {
    setVisitData(prev => {
      const updated = { ...prev, [field]: value }

      // Handle visit type changes
      if (field === 'visitType') {
        if (value === 'unscheduled') {
          updated.isUnscheduled = true
        } else {
          updated.isUnscheduled = false
        }
      }

      return updated
    })
  }

  const toggleFormAssignment = (formId) => {
    setVisitData(prev => {
      const isAssigned = prev.forms.includes(formId)
      return {
        ...prev,
        forms: isAssigned
          ? prev.forms.filter(f => f !== formId)
          : [...prev.forms, formId],
        formSettings: isAssigned
          ? { ...prev.formSettings, [formId]: undefined }
          : {
              ...prev.formSettings,
              [formId]: { startDay: 0, duration: 1, required: true }
            }
      }
    })
  }

  const isStepValid = (step) => {
    switch (step) {
      case 1: // Basics
        return visitData.name.trim() !== '' && visitData.visitType !== ''
      case 2: // Timing
        if (visitData.isUnscheduled) return true
        return visitData.day !== '' && visitData.day !== '0'
      case 3: // Forms
        return true // Optional, can proceed without forms
      case 4: // Review
        return true
      default:
        return false
    }
  }

  const resetWizard = () => {
    setVisitData(DEFAULT_VISIT_DATA)
  }

  return {
    visitData,
    setVisitData,
    updateField,
    toggleFormAssignment,
    isStepValid,
    resetWizard
  }
}
