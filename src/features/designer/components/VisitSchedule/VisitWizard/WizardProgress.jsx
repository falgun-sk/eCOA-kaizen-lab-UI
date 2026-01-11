const WizardProgress = ({ currentStep, totalSteps, stepNames }) => {
  return (
    <div>
      {/* Progress Indicators */}
      <div className="flex items-center justify-between mb-1.5">
        {Array.from({ length: totalSteps }).map((_, index) => {
          const stepNumber = index + 1
          const isCompleted = stepNumber < currentStep
          const isActive = stepNumber === currentStep
          const isPending = stepNumber > currentStep

          return (
            <div key={stepNumber} className="flex items-center flex-1 last:flex-initial">
              {/* Step Circle */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                  isCompleted
                    ? 'bg-white text-orange-600'
                    : isActive
                    ? 'bg-white text-orange-600 ring-2 ring-white'
                    : 'bg-orange-300 text-orange-100'
                }`}
              >
                {isCompleted ? (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  stepNumber
                )}
              </div>

              {/* Connecting Line */}
              {index < totalSteps - 1 && (
                <div
                  className={`h-0.5 flex-1 mx-2 transition-all ${
                    isCompleted ? 'bg-white' : 'bg-orange-300'
                  }`}
                />
              )}
            </div>
          )
        })}
      </div>

      {/* Step Names */}
      <div className="flex justify-between">
        {stepNames.map((name, index) => {
          const stepNumber = index + 1
          const isActive = stepNumber === currentStep
          const isCompleted = stepNumber < currentStep

          return (
            <span
              key={name}
              className={`text-[10px] font-medium transition-colors ${
                isActive
                  ? 'text-white'
                  : isCompleted
                  ? 'text-white opacity-90'
                  : 'text-orange-200'
              }`}
            >
              {name}
            </span>
          )
        })}
      </div>
    </div>
  )
}

export default WizardProgress
