import { DeploymentMetadata } from '../types'

interface DeploymentFooterProps {
  metadata: DeploymentMetadata
}

const DeploymentFooter = ({ metadata }: DeploymentFooterProps) => {
  return (
    <div className="border-t border-gray-300 bg-gray-50 px-8 py-4">
      <div className="flex items-center justify-between text-sm text-gray-600">
        <div className="flex items-center gap-6">
          <span>
            <span className="font-medium">Deployment ID:</span> {metadata.deploymentId}
          </span>
          <span className="text-gray-300">|</span>
          <span>
            <span className="font-medium">Trace ID:</span> {metadata.traceId}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Logged to immutable audit ledger</span>
        </div>
      </div>
    </div>
  )
}

export default DeploymentFooter
