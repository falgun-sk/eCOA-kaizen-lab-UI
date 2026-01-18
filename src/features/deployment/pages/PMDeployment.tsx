import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

interface ValidationCheck {
  id: string
  label: string
  status: 'passed' | 'failed' | 'checking'
  details?: string
}

const PMDeployment = () => {
  const { studyId } = useParams()
  const navigate = useNavigate()
  const [isDeploying, setIsDeploying] = useState(false)
  const [deploymentComplete, setDeploymentComplete] = useState(false)
  const [validationChecks, setValidationChecks] = useState<ValidationCheck[]>([
    { id: 'build', label: 'Build is finalized', status: 'checking' },
    { id: 'uat', label: 'UAT is approved', status: 'checking' },
    { id: 'reviews', label: 'No open review comments', status: 'checking' },
    { id: 'signoffs', label: 'All required sign-offs complete', status: 'checking' }
  ])

  // Mock study data
  const study = {
    id: studyId,
    name: 'Cancer Research Study 2024',
    version: '2.1.0',
    branch: 'main',
    environment: 'production'
  }

  useEffect(() => {
    // Simulate validation checks
    const timer = setTimeout(() => {
      setValidationChecks([
        { id: 'build', label: 'Build is finalized', status: 'passed', details: 'Build #127 completed successfully' },
        { id: 'uat', label: 'UAT is approved', status: 'passed', details: 'Approved by Lead Reviewer on Jan 15, 2026' },
        { id: 'reviews', label: 'No open review comments', status: 'passed', details: 'All 14 review comments resolved' },
        { id: 'signoffs', label: 'All required sign-offs complete', status: 'passed', details: 'Medical Director, Compliance Officer signed off' }
      ])
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  const allChecksPassed = validationChecks.every(check => check.status === 'passed')
  const isChecking = validationChecks.some(check => check.status === 'checking')

  const handleDeploy = () => {
    if (!allChecksPassed) {
      toast.error('Cannot deploy: Some validation checks have not passed', { duration: 3000 })
      return
    }

    setIsDeploying(true)
    toast.loading('Deploying to production...', { id: 'deploy' })

    // Simulate deployment process
    setTimeout(() => {
      setIsDeploying(false)
      setDeploymentComplete(true)
      toast.success('Deployment successful! Study is now live in production.', {
        id: 'deploy',
        duration: 4000
      })
    }, 3000)
  }

  const getStatusIcon = (status: string) => {
    if (status === 'passed') {
      return (
        <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
          <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      )
    } else if (status === 'failed') {
      return (
        <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center">
          <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
      )
    } else {
      return (
        <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
          <svg className="w-4 h-4 text-gray-400 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      )
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-8 py-6">
          <button
            onClick={() => navigate(`/studies/${studyId}`)}
            className="flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Study
          </button>

          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Deploy to Production</h1>
            <p className="text-sm text-gray-500 mt-1">{study.name}</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-8 py-8">
        {/* Deployment Info Card */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Deployment Information</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Study Name</p>
              <p className="text-sm font-medium text-gray-900 mt-1">{study.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Version</p>
              <p className="text-sm font-medium text-gray-900 mt-1">{study.version}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Branch</p>
              <p className="text-sm font-medium text-gray-900 mt-1">{study.branch}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Target Environment</p>
              <p className="text-sm font-medium text-gray-900 mt-1 capitalize">{study.environment}</p>
            </div>
          </div>
        </div>

        {/* Pre-deployment Validation Checks */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Pre-deployment Validation</h2>
            {isChecking && (
              <span className="text-sm text-gray-500">Running validation checks...</span>
            )}
            {!isChecking && allChecksPassed && (
              <span className="text-sm text-green-600 font-medium">All checks passed</span>
            )}
          </div>

          <div className="space-y-4">
            {validationChecks.map((check) => (
              <div key={check.id} className="flex items-start gap-3">
                {getStatusIcon(check.status)}
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{check.label}</p>
                  {check.details && (
                    <p className="text-xs text-gray-500 mt-1">{check.details}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Warning Message */}
        {!isChecking && allChecksPassed && !deploymentComplete && (
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-6">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-orange-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div>
                <p className="text-sm font-medium text-orange-900">Deployment to production is irreversible</p>
                <p className="text-xs text-orange-700 mt-1">Please ensure all changes have been reviewed and tested thoroughly before proceeding.</p>
              </div>
            </div>
          </div>
        )}

        {/* Deployment Success Message */}
        {deploymentComplete && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="text-lg font-semibold text-green-900">Deployment Successful</p>
                <p className="text-sm text-green-700">Study is now live in production</p>
              </div>
            </div>
            <div className="text-xs text-green-700">
              <p>Deployed at: {new Date().toLocaleString()}</p>
              <p className="mt-1">Deployment ID: DEP-{Date.now()}</p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(`/studies/${studyId}`)}
            className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium text-sm"
          >
            {deploymentComplete ? 'Return to Study' : 'Cancel'}
          </button>

          {!deploymentComplete && (
            <button
              onClick={handleDeploy}
              disabled={!allChecksPassed || isDeploying || isChecking}
              className={`px-8 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 ${
                allChecksPassed && !isDeploying && !isChecking
                  ? 'bg-orange-500 text-white hover:bg-orange-600 shadow-md hover:shadow-lg hover:scale-105 border border-orange-600'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {isDeploying ? 'Deploying...' : 'Deploy to Production'}
            </button>
          )}
        </div>

        {/* Info Box */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="text-xs text-blue-800">
              <p className="font-medium">Deployment Process</p>
              <p className="mt-1">As Project Manager, you have the authority to deploy studies to production after ensuring all mandatory approvals and validation checks are complete. This action will be logged in the audit trail.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PMDeployment
