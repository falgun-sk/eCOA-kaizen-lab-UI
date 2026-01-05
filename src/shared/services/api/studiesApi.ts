/**
 * Studies API Service
 * Handles study-related API calls
 */

import { apiClient } from './client'
import type {
  Study,
  StudyListParams,
  StudyListResponse,
  StudyPhaseInfo,
  StudyTeamMember,
  CreateStudyRequest,
  UpdateStudyRequest,
  SuccessResponse
} from '../../../types'

// Mock data for development
const MOCK_STUDIES: Study[] = [
  {
    id: '1',
    name: 'BEACON-2024',
    protocol: 'BCN-001',
    phase: 'Start-Up',
    status: 'active',
    sponsor: 'Pharma Corp',
    sites: 12,
    subjects: 450,
    progress: 65,
    createdAt: '2024-01-15',
    updatedAt: '2024-03-20',
  },
  {
    id: '2',
    name: 'SUMMIT-PRO',
    protocol: 'SUM-002',
    phase: 'UAT',
    status: 'active',
    sponsor: 'BioTech Inc',
    sites: 8,
    subjects: 280,
    progress: 45,
    createdAt: '2024-02-01',
    updatedAt: '2024-03-18',
  },
  {
    id: '3',
    name: 'HORIZON-PLUS',
    protocol: 'HRZ-003',
    phase: 'Maintenance',
    status: 'active',
    sponsor: 'MedLife Labs',
    sites: 15,
    subjects: 620,
    progress: 85,
    createdAt: '2023-11-10',
    updatedAt: '2024-03-21',
  },
]

const MOCK_DELAY = 300

const mockResponse = <T>(data: T): Promise<T> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), MOCK_DELAY)
  })
}

export const studiesApi = {
  // Get all studies with optional filters
  async getStudies(params: StudyListParams = {}): Promise<StudyListResponse> {
    // TODO: Replace with actual API call
    // const queryString = new URLSearchParams(params as Record<string, string>).toString()
    // return apiClient.get<StudyListResponse>(`/studies?${queryString}`)

    let filtered = [...MOCK_STUDIES]

    if (params.status) {
      filtered = filtered.filter((s) => s.status === params.status)
    }
    if (params.phase) {
      filtered = filtered.filter((s) => s.phase === params.phase)
    }
    if (params.search) {
      const search = params.search.toLowerCase()
      filtered = filtered.filter(
        (s) =>
          s.name.toLowerCase().includes(search) ||
          s.protocol.toLowerCase().includes(search)
      )
    }

    return mockResponse<StudyListResponse>({
      data: filtered,
      total: filtered.length,
      page: params.page || 1,
      pageSize: params.pageSize || 10,
    })
  },

  // Get single study by ID
  async getStudy(id: string): Promise<Study> {
    // TODO: Replace with actual API call
    // return apiClient.get<Study>(`/studies/${id}`)

    const study = MOCK_STUDIES.find((s) => s.id === id)
    if (!study) {
      throw new Error('Study not found')
    }
    return mockResponse<Study>(study)
  },

  // Create new study
  async createStudy(data: CreateStudyRequest): Promise<Study> {
    // TODO: Replace with actual API call
    // return apiClient.post<Study>('/studies', data)

    const newStudy: Study = {
      ...data,
      id: String(MOCK_STUDIES.length + 1),
      status: 'active',
      sites: data.sites || 0,
      progress: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    return mockResponse<Study>(newStudy)
  },

  // Update study
  async updateStudy(id: string, data: UpdateStudyRequest): Promise<Study> {
    // TODO: Replace with actual API call
    // return apiClient.put<Study>(`/studies/${id}`, data)

    const study = MOCK_STUDIES.find((s) => s.id === id)
    if (!study) {
      throw new Error('Study not found')
    }
    return mockResponse<Study>({
      ...study,
      ...data,
      updatedAt: new Date().toISOString()
    })
  },

  // Delete study
  async deleteStudy(id: string): Promise<SuccessResponse> {
    // TODO: Replace with actual API call
    // return apiClient.delete<SuccessResponse>(`/studies/${id}`)

    return mockResponse<SuccessResponse>({ success: true })
  },

  // Get study phases
  async getStudyPhases(studyId: string): Promise<StudyPhaseInfo[]> {
    // TODO: Replace with actual API call
    // return apiClient.get<StudyPhaseInfo[]>(`/studies/${studyId}/phases`)

    return mockResponse<StudyPhaseInfo[]>([
      { id: 'startup', name: 'Start-Up', status: 'completed' },
      { id: 'build', name: 'Build', status: 'in_progress' },
      { id: 'uat', name: 'UAT', status: 'pending' },
      { id: 'maintenance', name: 'Maintenance', status: 'pending' },
    ])
  },

  // Get study team members
  async getStudyTeam(studyId: string): Promise<StudyTeamMember[]> {
    // TODO: Replace with actual API call
    // return apiClient.get<StudyTeamMember[]>(`/studies/${studyId}/team`)

    return mockResponse<StudyTeamMember[]>([
      { id: '1', name: 'John Admin', role: 'admin', email: 'john@kaizen.com' },
      { id: '2', name: 'Sarah Designer', role: 'study_designer', email: 'sarah@kaizen.com' },
      { id: '3', name: 'Mike PM', role: 'project_manager', email: 'mike@kaizen.com' },
    ])
  },
}
