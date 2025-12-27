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

  return (
    <div className="flex-1 flex flex-col bg-gray-50">
      {/* Header */}
      <FormBuilderHeader
        studyId={studyId}
        formName={formName}
        onFormNameChange={setFormName}
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

      {/* Footer with Action Buttons */}
      <div className="bg-white border-t border-gray-200 px-8 py-4">
        <div className="flex items-center justify-end gap-3">
          <button
            onClick={handlePreview}
            disabled={canvasComponents.length === 0}
            className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Preview
          </button>
          <button
            onClick={handleSave}
            disabled={canvasComponents.length === 0}
            className="px-6 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg hover:from-orange-600 hover:to-orange-700 shadow-lg shadow-orange-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save Form
          </button>
        </div>
      </div>

      {/* Preview Modal */}
      <FormPreviewModal
        isOpen={showPreview}
        formName={formName}
        components={canvasComponents}
        onClose={() => setShowPreview(false)}
      />
    </div>
  )
}

export default FormBuilder
