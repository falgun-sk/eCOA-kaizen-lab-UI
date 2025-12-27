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
    showWarningModal,
    setSelectedComponent,
    setFormName,
    handleDrop,
    handleDragOver,
    handleDragStart,
    removeComponent,
    updateComponent,
    updateConfig,
    saveForm,
    confirmAddComponent,
    cancelAddComponent
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

      {/* Warning Modal for SLT/MLT */}
      {showWarningModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                  <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h2 className="text-lg font-semibold text-gray-900">Use Text Component?</h2>
              </div>
            </div>

            <div className="px-6 py-4">
              <p className="text-sm text-gray-700 leading-relaxed">
                Are you sure you want to use Single Line Text (SLT) or Multi Line Text (MLT) component?
              </p>
              <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <p className="text-sm text-orange-800">
                  <span className="font-semibold">Recommendation:</span> Focus more on predefined scale criteria for better data standardization and analysis.
                </p>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-end gap-3">
              <button
                onClick={cancelAddComponent}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmAddComponent}
                className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg hover:from-orange-600 hover:to-orange-700 transition-colors"
              >
                Yes, Add Component
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default FormBuilder
