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
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-orange-500 to-orange-600">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-white flex items-center justify-center">
                  <svg className="w-7 h-7 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-white">Reconsider Using Free-Text</h2>
                  <p className="text-sm text-white/90 mt-1">Use structured data for better quality</p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 bg-white">
              <div className="bg-amber-50 border border-amber-300 rounded-lg p-3 mb-4">
                <p className="text-sm text-gray-800">
                  <strong className="text-amber-700">⚠️ Warning:</strong> Free-text creates inconsistent data, increases errors, and requires manual cleanup before analysis.
                </p>
              </div>
              <p className="text-sm text-gray-700 mb-4">
                <strong className="text-gray-900">Structured components ensure:</strong> Standardized responses, instant analysis, and regulatory compliance.
              </p>

              {/* Recommendation */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-blue-900 mb-3">
                  Recommended: Use Structured Components
                </h3>
                <div className="space-y-2 text-sm text-gray-700">
                  <div className="flex items-start gap-2">
                    <span className="text-orange-500 font-bold">→</span>
                    <span><strong>Dropdown/Radio:</strong> For single choice (Gender, Yes/No)</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-orange-500 font-bold">→</span>
                    <span><strong>Checkboxes:</strong> For multiple selections (Symptoms)</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-orange-500 font-bold">→</span>
                    <span><strong>Slider/Scale:</strong> For ratings (Pain level 0-10)</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-orange-500 font-bold">→</span>
                    <span><strong>Number Input:</strong> For numeric values (Age, Weight)</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-orange-500 font-bold">→</span>
                    <span><strong>Date/Time:</strong> For dates (Date of birth, Visit date)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-end gap-3">
              <button
                onClick={cancelAddComponent}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmAddComponent}
                className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg hover:from-orange-600 hover:to-orange-700 shadow-md shadow-orange-500/30 transition-all duration-200"
              >
                Yes, Add Text Field
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default FormBuilder
