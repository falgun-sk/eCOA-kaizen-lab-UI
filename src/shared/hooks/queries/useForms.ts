/**
 * Forms Query Hooks
 * React Query hooks for form builder
 */

import { useQuery, useMutation, useQueryClient, UseQueryOptions } from '@tanstack/react-query'
import { formsApi } from '../../services/api'
import type {
  Form,
  FormComponent,
  FormListParams,
  FormListResponse,
  FormVersion,
  SaveFormComponentsResponse,
  PublishFormResponse,
  SuccessResponse
} from '../../../types'

// Query keys
export const formKeys = {
  all: ['forms'] as const,
  lists: () => [...formKeys.all, 'list'] as const,
  list: (studyId: string, filters: FormListParams) => [...formKeys.lists(), studyId, filters] as const,
  details: () => [...formKeys.all, 'detail'] as const,
  detail: (studyId: string, formId: string) => [...formKeys.details(), studyId, formId] as const,
  versions: (studyId: string, formId: string) => [...formKeys.detail(studyId, formId), 'versions'] as const,
}

// Get all forms for a study
export const useForms = (
  studyId: string,
  params: FormListParams = {},
  options: Omit<UseQueryOptions<FormListResponse, Error>, 'queryKey' | 'queryFn'> = {}
) => {
  return useQuery({
    queryKey: formKeys.list(studyId, params),
    queryFn: () => formsApi.getForms(studyId, params),
    enabled: !!studyId,
    ...options,
  })
}

// Get single form
export const useForm = (
  studyId: string,
  formId: string,
  options: Omit<UseQueryOptions<Form, Error>, 'queryKey' | 'queryFn'> = {}
) => {
  return useQuery({
    queryKey: formKeys.detail(studyId, formId),
    queryFn: () => formsApi.getForm(studyId, formId),
    enabled: !!studyId && !!formId,
    ...options,
  })
}

// Get form versions
export const useFormVersions = (
  studyId: string,
  formId: string,
  options: Omit<UseQueryOptions<FormVersion[], Error>, 'queryKey' | 'queryFn'> = {}
) => {
  return useQuery({
    queryKey: formKeys.versions(studyId, formId),
    queryFn: () => formsApi.getFormVersions(studyId, formId),
    enabled: !!studyId && !!formId,
    ...options,
  })
}

interface CreateFormData {
  name: string
  type: Form['type']
}

// Create form mutation
export const useCreateForm = () => {
  const queryClient = useQueryClient()

  return useMutation<Form, Error, { studyId: string; data: CreateFormData }>({
    mutationFn: ({ studyId, data }) => formsApi.createForm(studyId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: formKeys.lists() })
    },
  })
}

interface UpdateFormData {
  name?: string
  type?: Form['type']
  status?: Form['status']
}

// Update form mutation
export const useUpdateForm = () => {
  const queryClient = useQueryClient()

  return useMutation<Form, Error, { studyId: string; formId: string; data: UpdateFormData }>({
    mutationFn: ({ studyId, formId, data }) =>
      formsApi.updateForm(studyId, formId, data),
    onSuccess: (_, { studyId, formId }) => {
      queryClient.invalidateQueries({ queryKey: formKeys.detail(studyId, formId) })
      queryClient.invalidateQueries({ queryKey: formKeys.lists() })
    },
  })
}

// Delete form mutation
export const useDeleteForm = () => {
  const queryClient = useQueryClient()

  return useMutation<SuccessResponse, Error, { studyId: string; formId: string }>({
    mutationFn: ({ studyId, formId }) => formsApi.deleteForm(studyId, formId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: formKeys.lists() })
    },
  })
}

// Save form components mutation
export const useSaveFormComponents = () => {
  const queryClient = useQueryClient()

  return useMutation<SaveFormComponentsResponse, Error, { studyId: string; formId: string; components: FormComponent[] }>({
    mutationFn: ({ studyId, formId, components }) =>
      formsApi.saveFormComponents(studyId, formId, components),
    onSuccess: (_, { studyId, formId }) => {
      queryClient.invalidateQueries({ queryKey: formKeys.detail(studyId, formId) })
    },
  })
}

// Publish form mutation
export const usePublishForm = () => {
  const queryClient = useQueryClient()

  return useMutation<PublishFormResponse, Error, { studyId: string; formId: string }>({
    mutationFn: ({ studyId, formId }) => formsApi.publishForm(studyId, formId),
    onSuccess: (_, { studyId, formId }) => {
      queryClient.invalidateQueries({ queryKey: formKeys.detail(studyId, formId) })
      queryClient.invalidateQueries({ queryKey: formKeys.lists() })
    },
  })
}

// Submit form for review mutation
export const useSubmitFormForReview = () => {
  const queryClient = useQueryClient()

  return useMutation<{ success: boolean; status: string; submittedAt: string }, Error, { studyId: string; formId: string }>({
    mutationFn: ({ studyId, formId }) =>
      formsApi.submitForReview(studyId, formId),
    onSuccess: (_, { studyId, formId }) => {
      queryClient.invalidateQueries({ queryKey: formKeys.detail(studyId, formId) })
      queryClient.invalidateQueries({ queryKey: formKeys.lists() })
    },
  })
}
