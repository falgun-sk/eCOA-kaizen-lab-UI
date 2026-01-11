import { useState } from 'react'
import WizardProgress from './WizardProgress'
import Step1Basics from './steps/Step1Basics'
import Step2Timing from './steps/Step2Timing'
import Step3FormsNew from './steps/Step3FormsNew'
import Step4Review from './steps/Step4Review'
import Step5Conditions from './steps/Step5Conditions'
import { useWizardState } from './useWizardState'

const VisitWizard = ({
  isOpen,
  onClose,
  onSave,
  isEditing,
  selectedVisit,
  availableForms,
  visits
}) => {
  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 5

  const {
    visitData,
    setVisitData,
    updateField,
    isStepValid,
    resetWizard
  } = useWizardState(selectedVisit, isEditing)

  if (!isOpen) return null

  const handleNext = () => {
    if (isStepValid(currentStep) && currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSave = () => {
    onSave(visitData)
    resetWizard()
    setCurrentStep(1)
  }

  const handleClose = () => {
    onClose()
    resetWizard()
    setCurrentStep(1)
  }

  const stepNames = ['Basics', 'Timing', 'Forms', 'Conditions', 'Review']

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-5 py-3 rounded-t-xl">
          <div className="flex items-center justify-between mb-2.5">
            <h2 className="text-base font-semibold text-white">
              {isEditing ? `Edit: ${selectedVisit?.name || 'Visit'}` : 'Create Visit'}
            </h2>
            <div className="flex items-center gap-3">
              <span className="text-xs text-white opacity-90">
                Step {currentStep} of {totalSteps}
              </span>
              <button
                onClick={handleClose}
                className="text-white hover:text-orange-100 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <WizardProgress
            currentStep={currentStep}
            totalSteps={totalSteps}
            stepNames={stepNames}
          />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {currentStep === 1 && (
            <Step1Basics
              visitData={visitData}
              updateField={updateField}
            />
          )}
          {currentStep === 2 && (
            <Step2Timing
              visitData={visitData}
              updateField={updateField}
              visits={visits}
              isEditing={isEditing}
              selectedVisit={selectedVisit}
            />
          )}
          {currentStep === 3 && (
            <Step3FormsNew
              visitData={visitData}
              updateField={updateField}
              availableForms={availableForms}
            />
          )}
          {currentStep === 4 && (
            <Step5Conditions
              visitData={visitData}
              updateField={updateField}
              availableForms={availableForms}
              visits={visits}
            />
          )}
          {currentStep === 5 && (
            <Step4Review
              visitData={visitData}
              availableForms={availableForms}
            />
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-gray-200 bg-gray-50 flex items-center justify-between rounded-b-xl">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ← Previous
          </button>

          {currentStep < totalSteps ? (
            <button
              onClick={handleNext}
              className="px-4 py-2 text-sm font-semibold text-white bg-orange-500 rounded-lg hover:bg-orange-600 transition-all duration-150 shadow-sm"
            >
              Next: {stepNames[currentStep]} →
            </button>
          ) : (
            <button
              onClick={handleSave}
              className="px-4 py-2 text-sm font-semibold text-white bg-orange-500 rounded-lg hover:bg-orange-600 transition-all duration-150 shadow-sm"
            >
              ✓ {isEditing ? 'Update Visit' : 'Save Visit'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default VisitWizard
