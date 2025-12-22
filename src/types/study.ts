/**
 * Study Types
 */

export type StudyStatus = 'active' | 'inactive' | 'completed' | 'archived'
export type StudyPhase = 'Start-Up' | 'Build' | 'UAT' | 'Maintenance' | 'Phase II' | 'Phase III'

export interface Study {
  id: string
  name: string
  protocol: string
  phase: StudyPhase | string
  status: StudyStatus
  sponsor?: string
  sites: number
  subjects?: number
  patients?: number
  progress?: number
  pendingCount?: number
  lastUpdated?: string
  createdAt: string
  updatedAt: string
}

export interface StudyListParams {
  search?: string
  status?: StudyStatus
  phase?: string
  page?: number
  pageSize?: number
}

export interface StudyListResponse {
  data: Study[]
  total: number
  page: number
  pageSize: number
}

export interface StudyPhaseInfo {
  id: string
  name: string
  status: 'completed' | 'in_progress' | 'pending'
}

export interface StudyTeamMember {
  id: string
  name: string
  role: string
  email: string
}

export interface CreateStudyRequest {
  name: string
  protocol: string
  phase: string
  sponsor?: string
  sites?: number
}

export interface UpdateStudyRequest extends Partial<CreateStudyRequest> {
  status?: StudyStatus
}
