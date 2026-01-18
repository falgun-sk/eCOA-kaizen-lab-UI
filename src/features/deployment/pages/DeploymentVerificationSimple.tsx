import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

const DeploymentVerificationSimple = () => {
  const navigate = useNavigate()
  const [isDeploying, setIsDeploying] = useState(false)
  const [deploymentComplete, setDeploymentComplete] = useState(false)

  const validations = [
    { id: 1, name: 'Build Verification', status: 'passed' },
    { id: 2, name: 'Security Checks', status: 'passed' },
    { id: 3, name: 'Dependencies', status: 'warning' },
    { id: 4, name: 'Environment Config', status: 'passed' },
    { id: 5, name: 'Database Migration', status: 'passed' },
    { id: 6, name: 'Tests', status: 'passed' }
  ]

  const handleDeploy = () => {
    setIsDeploying(true)
    toast.loading('Deploying to production...', { id: 'deploy' })

    // Simulate deployment
    setTimeout(() => {
      setIsDeploying(false)
      setDeploymentComplete(true)
      toast.success('Deployment successful! Your changes are now live in production.', {
        id: 'deploy',
        duration: 4000
      })
    }, 3000)
  }

  const getStatusIcon = (status: string) => {
    if (status === 'passed') {
      return (
        <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      )
    } else if (status === 'warning') {
      return (
        <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      )
    }
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-8 py-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          <h1 className="text-2xl font-semibold text-gray-900">Deploy to Production</h1>
          <p className="text-sm text-gray-500 mt-1">Review and deploy your changes</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-8 py-8">
        {/* Deployment Info Card */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Deployment Information</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Environment:</span>
              <span className="ml-2 font-medium text-gray-900">Production</span>
            </div>
            <div>
              <span className="text-gray-500">Version:</span>
              <span className="ml-2 font-medium text-gray-900">v3.4.2</span>
            </div>
            <div>
              <span className="text-gray-500">Branch:</span>
              <span className="ml-2 font-medium text-gray-900">main</span>
            </div>
            <div>
              <span className="text-gray-500">Target:</span>
              <span className="ml-2 font-medium text-gray-900">eCOA Production</span>
            </div>
          </div>
        </div>

        {/* Validation Checks */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Pre-deployment Checks</h2>
          <div className="space-y-3">
            {validations.map((validation) => (
              <div
                key={validation.id}
                className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0"
              >
                <span className="text-sm text-gray-700">{validation.name}</span>
                <div className="flex items-center gap-2">
                  {getStatusIcon(validation.status)}
                  <span className={`text-xs font-medium ${
                    validation.status === 'passed' ? 'text-green-600' : 'text-yellow-600'
                  }`}>
                    {validation.status === 'passed' ? 'Passed' : 'Warning'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Warning Message */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-yellow-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <h3 className="text-sm font-semibold text-yellow-900">Minor Issues Detected</h3>
              <p className="text-sm text-yellow-800 mt-1">1 dependency has a medium-severity vulnerability. Deployment can proceed.</p>
            </div>
          </div>
        </div>

        {/* Deploy Button */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => {
              toast.error('Deployment cancelled')
              navigate(-1)
            }}
            className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleDeploy}
            disabled={isDeploying || deploymentComplete}
            className={`px-8 py-2.5 rounded-lg font-semibold transition-all ${
              isDeploying
                ? 'bg-gray-400 text-white cursor-not-allowed'
                : deploymentComplete
                ? 'bg-green-500 text-white cursor-not-allowed'
                : 'bg-orange-500 text-white hover:bg-orange-600 shadow-md hover:shadow-lg'
            }`}
          >
            {isDeploying ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Deploying...
              </span>
            ) : deploymentComplete ? (
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Deployed
              </span>
            ) : (
              'Deploy to Production'
            )}
          </button>
        </div>

        {deploymentComplete && (
          <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-green-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h3 className="text-sm font-semibold text-green-900">Deployment Successful</h3>
                <p className="text-sm text-green-800 mt-1">Your changes have been deployed to production.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default DeploymentVerificationSimple
