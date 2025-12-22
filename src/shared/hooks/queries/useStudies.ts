/**
 * Studies Query Hooks
 * React Query hooks for study management
 */

import { useQuery, useMutation, useQueryClient, UseQueryOptions } from '@tanstack/react-query'
import { studiesApi } from '../../services/api'
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

// Query keys
export const studyKeys = {
  all: ['studies'] as const,
  lists: () => [...studyKeys.all, 'list'] as const,
  list: (filters: StudyListParams) => [...studyKeys.lists(), filters] as const,
  details: () => [...studyKeys.all, 'detail'] as const,
  detail: (id: string) => [...studyKeys.details(), id] as const,
  phases: (id: string) => [...studyKeys.detail(id), 'phases'] as const,
  team: (id: string) => [...studyKeys.detail(id), 'team'] as const,
}

// Get all studies
export const useStudies = (
  params: StudyListParams = {},
  options: Omit<UseQueryOptions<StudyListResponse, Error>, 'queryKey' | 'queryFn'> = {}
) => {
  return useQuery({
    queryKey: studyKeys.list(params),
    queryFn: () => studiesApi.getStudies(params),
    ...options,
  })
}

// Get single study
export const useStudy = (
  id: string,
  options: Omit<UseQueryOptions<Study, Error>, 'queryKey' | 'queryFn'> = {}
) => {
  return useQuery({
    queryKey: studyKeys.detail(id),
    queryFn: () => studiesApi.getStudy(id),
    enabled: !!id,
    ...options,
  })
}

// Get study phases
export const useStudyPhases = (
  studyId: string,
  options: Omit<UseQueryOptions<StudyPhaseInfo[], Error>, 'queryKey' | 'queryFn'> = {}
) => {
  return useQuery({
    queryKey: studyKeys.phases(studyId),
    queryFn: () => studiesApi.getStudyPhases(studyId),
    enabled: !!studyId,
    ...options,
  })
}

// Get study team
export const useStudyTeam = (
  studyId: string,
  options: Omit<UseQueryOptions<StudyTeamMember[], Error>, 'queryKey' | 'queryFn'> = {}
) => {
  return useQuery({
    queryKey: studyKeys.team(studyId),
    queryFn: () => studiesApi.getStudyTeam(studyId),
    enabled: !!studyId,
    ...options,
  })
}

// Create study mutation
export const useCreateStudy = () => {
  const queryClient = useQueryClient()

  return useMutation<Study, Error, CreateStudyRequest>({
    mutationFn: (data) => studiesApi.createStudy(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: studyKeys.lists() })
    },
  })
}

// Update study mutation
export const useUpdateStudy = () => {
  const queryClient = useQueryClient()

  return useMutation<Study, Error, { id: string; data: UpdateStudyRequest }>({
    mutationFn: ({ id, data }) => studiesApi.updateStudy(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: studyKeys.detail(id) })
      queryClient.invalidateQueries({ queryKey: studyKeys.lists() })
    },
  })
}

// Delete study mutation
export const useDeleteStudy = () => {
  const queryClient = useQueryClient()

  return useMutation<SuccessResponse, Error, string>({
    mutationFn: (id) => studiesApi.deleteStudy(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: studyKeys.lists() })
    },
  })
}
