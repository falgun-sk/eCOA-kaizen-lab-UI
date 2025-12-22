import { useState, useEffect, useCallback } from 'react'
import { createNewComponent, deepClone, setNestedValue } from './utils'

/**
 * Custom hook for managing form builder state
 */
export const useFormBuilder = (studyId, formId) => {
  const [selectedComponent, setSelectedComponent] = useState(null)
  const [canvasComponents, setCanvasComponents] = useState([])
  const [formName, setFormName] = useState(formId ? `Form ${formId}` : 'New Form')

  // Load existing form data when editing
  useEffect(() => {
    if (formId) {
      const savedForms = localStorage.getItem(`study-${studyId}-forms`)
      if (savedForms) {
        const allForms = JSON.parse(savedForms)
        const form = allForms.find(f => f.id === parseInt(formId))
        if (form) {
          setFormName(form.name)
          setCanvasComponents(form.components || [])
        }
      }
    }
  }, [studyId, formId])

  // Handle drop from palette
  const handleDrop = useCallback((e) => {
    e.preventDefault()
    const componentType = e.dataTransfer.getData('componentType')
    if (componentType) {
      const newComponent = createNewComponent(componentType, canvasComponents.length)
      setCanvasComponents(prev => [...prev, newComponent])
    }
  }, [canvasComponents.length])

  // Handle drag over canvas
  const handleDragOver = useCallback((e) => {
    e.preventDefault()
  }, [])

  // Handle drag start from palette
  const handleDragStart = useCallback((e, type) => {
    e.dataTransfer.setData('componentType', type)
  }, [])

  // Remove component
  const removeComponent = useCallback((id) => {
    setCanvasComponents(prev => prev.filter(c => c.id !== id))
    if (selectedComponent?.id === id) {
      setSelectedComponent(null)
    }
  }, [selectedComponent?.id])

  // Update component field
  const updateComponent = useCallback((field, value) => {
    if (!selectedComponent) return

    const updated = canvasComponents.map(c =>
      c.id === selectedComponent.id ? { ...c, [field]: value } : c
    )
    setCanvasComponents(updated)
    setSelectedComponent(prev => ({ ...prev, [field]: value }))
  }, [canvasComponents, selectedComponent])

  // Update component config by path
  const updateConfig = useCallback((path, value) => {
    if (!selectedComponent) return

    const updated = canvasComponents.map(c => {
      if (c.id === selectedComponent.id) {
        const newConfig = setNestedValue(c.config, path, value)
        return { ...c, config: newConfig }
      }
      return c
    })
    setCanvasComponents(updated)

    // Update selected component
    const newConfig = setNestedValue(selectedComponent.config, path, value)
    setSelectedComponent(prev => ({ ...prev, config: newConfig }))
  }, [canvasComponents, selectedComponent])

  // Save form
  const saveForm = useCallback((navigate) => {
    const savedForms = localStorage.getItem(`study-${studyId}-forms`)
    let allForms = savedForms ? JSON.parse(savedForms) : []

    const formData = {
      id: formId ? parseInt(formId) : Date.now(),
      name: formName,
      version: formId ? 'V1.1' : 'V1.0',
      lastModified: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      modifiedBy: 'Study Designer',
      components: canvasComponents
    }

    if (formId) {
      allForms = allForms.map(f => f.id === parseInt(formId) ? formData : f)
    } else {
      allForms.push(formData)
    }

    localStorage.setItem(`study-${studyId}-forms`, JSON.stringify(allForms))

    alert(`Form "${formName}" saved successfully!\n\nComponents: ${canvasComponents.length}\nVersion: ${formData.version}`)

    setTimeout(() => {
      navigate(`/designer/studies/${studyId}`)
    }, 500)
  }, [studyId, formId, formName, canvasComponents])

  return {
    // State
    selectedComponent,
    canvasComponents,
    formName,

    // Setters
    setSelectedComponent,
    setFormName,

    // Handlers
    handleDrop,
    handleDragOver,
    handleDragStart,
    removeComponent,
    updateComponent,
    updateConfig,
    saveForm
  }
}
