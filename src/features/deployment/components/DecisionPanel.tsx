import { useState } from 'react'

interface DecisionPanelProps {
  warnings: string[]
  onProceed: () => void
  onDownloadReport: () => void
  onCancel: () => void
  isDeploymentComplete: boolean
}

const DecisionPanel = ({
  warnings,
  onProceed,
  onDownloadReport,
  onCancel,
  isDeploymentComplete
}: DecisionPanelProps) => {
  const [acknowledged, setAcknowledged] = useState(false)

  return (
    <div className="border-t border-gray-300 bg-white">
      <div className="px-8 py-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">DECISION PANEL</h2>

          {warnings.length > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-yellow-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-yellow-900 mb-2">Warnings Detected</h3>
                  <ul className="space-y-1">
                    {warnings.map((warning, index) => (
                      <li key={index} className="text-sm text-yellow-800 flex items-start gap-2">
                        <span className="text-yellow-600">•</span>
                        <span>{warning}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2">
                <input
                  type="checkbox"
                  id="acknowledge"
                  checked={acknowledged}
                  onChange={(e) => setAcknowledged(e.target.checked)}
                  className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                />
                <label htmlFor="acknowledge" className="text-sm text-gray-700 cursor-pointer">
                  I acknowledge & accept the risk
                </label>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={onProceed}
            disabled={!isDeploymentComplete || (warnings.length > 0 && !acknowledged)}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              !isDeploymentComplete || (warnings.length > 0 && !acknowledged)
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-orange-500 text-white hover:bg-orange-600'
            }`}
          >
            PROCEED TO DEPLOY
          </button>
          <button
            onClick={onDownloadReport}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            DOWNLOAD REPORT
          </button>
          <button
            onClick={onCancel}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            CANCEL
          </button>
        </div>
      </div>
    </div>
  )
}

export default DecisionPanel
