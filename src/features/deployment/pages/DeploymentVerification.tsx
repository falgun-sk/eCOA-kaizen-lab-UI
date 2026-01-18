import { useState, useEffect } from 'react'
import {
  DeploymentHeader,
  HeroStatusCard,
  ValidationSectionItem,
  LiveLogPanel,
  DecisionPanel,
  DeploymentFooter
} from '../components'
import { DeploymentVerificationData, LogEntry, ValidationSection } from '../types'
import { useMockDeploymentData } from '../utils/mockData'

const DeploymentVerification = () => {
  const mockData = useMockDeploymentData()
  const [data, setData] = useState<DeploymentVerificationData>(mockData)
  const [isRunning, setIsRunning] = useState(false)

  useEffect(() => {
    if (!isRunning) return

    // Simulate deployment verification process
    const interval = setInterval(() => {
      setData(prevData => {
        const newProgress = Math.min(prevData.progress + 5, 100)
        const isComplete = newProgress >= 100

        // Add new log entry
        const newLog: LogEntry = {
          timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
          message: isComplete
            ? 'All validations complete'
            : `Processing validation ${Math.floor(newProgress / 10)}...`,
          type: isComplete ? 'success' : 'info'
        }

        // Update stats based on progress
        const passed = Math.floor(newProgress / 7)
        const running = isComplete ? 0 : 3

        return {
          ...prevData,
          progress: newProgress,
          isComplete,
          stats: {
            ...prevData.stats,
            passed,
            running
          },
          logs: [...prevData.logs, newLog]
        }
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isRunning])

  const handleRun = () => {
    setIsRunning(true)
  }

  const handleProceed = () => {
    console.log('Proceeding to deploy...')
    alert('Deployment initiated!')
  }

  const handleDownloadReport = () => {
    console.log('Downloading report...')
    alert('Report downloaded!')
  }

  const handleCancel = () => {
    console.log('Deployment cancelled')
    alert('Deployment cancelled')
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <DeploymentHeader metadata={data.metadata} onRun={!isRunning ? handleRun : undefined} />

      <div className="flex-1 overflow-hidden">
        <HeroStatusCard stats={data.stats} progress={data.progress} />

        <div className="mx-8 mb-6 grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-400px)]">
          {/* Left Side - Validation Sections */}
          <div className="border border-gray-300 rounded-lg bg-white overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-gray-300 bg-gray-50">
              <h2 className="text-lg font-semibold text-gray-900">VALIDATION SECTIONS</h2>
            </div>
            <div className="flex-1 overflow-y-auto">
              {data.sections.map((section) => (
                <ValidationSectionItem key={section.id} section={section} />
              ))}
            </div>
          </div>

          {/* Right Side - Live Log */}
          <div className="border border-gray-300 rounded-lg bg-white overflow-hidden">
            <LiveLogPanel logs={data.logs} />
          </div>
        </div>

        <DecisionPanel
          warnings={data.warnings}
          onProceed={handleProceed}
          onDownloadReport={handleDownloadReport}
          onCancel={handleCancel}
          isDeploymentComplete={data.isComplete}
        />
      </div>

      <DeploymentFooter metadata={data.metadata} />
    </div>
  )
}

export default DeploymentVerification
