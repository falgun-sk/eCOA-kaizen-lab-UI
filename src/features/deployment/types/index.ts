export type ValidationStatus = 'pending' | 'running' | 'passed' | 'warning' | 'failed'

export interface ValidationCheck {
  label: string
  status: ValidationStatus
  details?: string
}

export interface ValidationSection {
  id: string
  title: string
  status: ValidationStatus
  checks: ValidationCheck[]
  canExpand?: boolean
  expandLabel?: string
}

export interface LogEntry {
  timestamp: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
}

export interface DeploymentStats {
  passed: number
  warnings: number
  failed: number
  running: number
}

export interface DeploymentMetadata {
  release: string
  target: string
  triggeredBy: string
  time: string
  deploymentId: string
  traceId: string
}

export interface DeploymentVerificationData {
  metadata: DeploymentMetadata
  stats: DeploymentStats
  progress: number
  sections: ValidationSection[]
  logs: LogEntry[]
  warnings: string[]
  isComplete: boolean
}
