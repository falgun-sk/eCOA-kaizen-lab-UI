import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useFormBuilder } from './hooks'
import FormBuilderHeader from './FormBuilderHeader'
import ComponentPalette from './ComponentPalette'
import FormCanvas from './FormCanvas'
import PropertyPanel from './PropertyPanel'
import FormPreviewModal from './FormPreviewModal'

const FormBuilder = () => {
  const { studyId, formId } = useParams()
  const navigate = useNavigate()
  const [showPreview, setShowPreview] = useState(false)

  const {
    selectedComponent,
    canvasComponents,
    formName,
    setSelectedComponent,
    setFormName,
    handleDrop,
    handleDragOver,
    handleDragStart,
    removeComponent,
    updateComponent,
    updateConfig,
    saveForm
  } = useFormBuilder(studyId, formId)

  const handlePreview = () => {
    setShowPreview(true)
  }

  const handleSave = () => {
    saveForm(navigate)
  }

  const handleSaveAndClose = () => {
    setShowPreview(false)
    handleSave()
  }

  return (
    <div className="flex-1 flex flex-col bg-gray-50">
      {/* Header */}
      <FormBuilderHeader
        studyId={studyId}
        formName={formName}
        onFormNameChange={setFormName}
        onPreview={handlePreview}
        onSave={handleSave}
        canPreview={canvasComponents.length > 0}
        canSave={canvasComponents.length > 0}
      />

      {/* Main Content - Three Column Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Component Palette */}
        <ComponentPalette onDragStart={handleDragStart} />

        {/* Center - Canvas */}
        <FormCanvas
          components={canvasComponents}
          selectedComponent={selectedComponent}
          onSelectComponent={setSelectedComponent}
          onRemoveComponent={removeComponent}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        />

        {/* Right Sidebar - Properties */}
        <PropertyPanel
          selectedComponent={selectedComponent}
          allComponents={canvasComponents}
          onUpdateComponent={updateComponent}
          onUpdateConfig={updateConfig}
        />
      </div>

      {/* Preview Modal */}
      <FormPreviewModal
        isOpen={showPreview}
        formName={formName}
        components={canvasComponents}
        onClose={() => setShowPreview(false)}
        onSaveAndClose={handleSaveAndClose}
      />
    </div>
  )
}

export default FormBuilder
