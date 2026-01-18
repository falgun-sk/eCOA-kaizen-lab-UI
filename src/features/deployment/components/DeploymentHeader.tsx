import { DeploymentMetadata } from '../types'

interface DeploymentHeaderProps {
  metadata: DeploymentMetadata
  onRun?: () => void
}

const DeploymentHeader = ({ metadata, onRun }: DeploymentHeaderProps) => {
  return (
    <div className="border-b border-gray-300 bg-white">
      <div className="px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">
              Deployment Verification — Production Environment
            </h1>
            <div className="flex items-center gap-6 text-sm text-gray-600">
              <span>
                <span className="font-medium">Release:</span> {metadata.release}
              </span>
              <span className="text-gray-300">|</span>
              <span>
                <span className="font-medium">Target:</span> {metadata.target}
              </span>
              <span className="text-gray-300">|</span>
              <span>
                <span className="font-medium">Triggered by:</span> {metadata.triggeredBy}
              </span>
            </div>
            <div className="text-sm text-gray-500 mt-1">
              <span className="font-medium">Time:</span> {metadata.time}
            </div>
          </div>
          {onRun && (
            <button
              onClick={onRun}
              className="flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
            >
              <span className="w-6 h-6 bg-yellow-400 rounded-full"></span>
              RUN
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default DeploymentHeader
