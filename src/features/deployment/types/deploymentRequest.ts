export type DeploymentStatus = 'pending' | 'approved' | 'rejected' | 'deployed' | 'failed'

export interface DeploymentRequest {
  id: string
  studyId: string
  studyName: string
  version: string
  branch: string
  environment: 'production' | 'uat' | 'staging'
  status: DeploymentStatus
  requestedBy: {
    id: string
    name: string
    role: string
  }
  requestedAt: string
  reviewedBy?: {
    id: string
    name: string
    role: string
  }
  reviewedAt?: string
  approvalComments?: string
  rejectionReason?: string
  deployedAt?: string
  validationChecks: ValidationCheck[]
  warnings: string[]
}

export interface ValidationCheck {
  id: number
  name: string
  status: 'passed' | 'warning' | 'failed'
  details?: string
}

export interface DeploymentAuditEntry {
  timestamp: string
  action: string
  user: string
  role: string
  details?: string
}
