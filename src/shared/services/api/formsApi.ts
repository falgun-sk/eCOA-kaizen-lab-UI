/**
 * Forms API Service
 * Handles form builder related API calls
 */

import { apiClient } from './client'
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

// Mock data for development
const MOCK_FORMS: Form[] = [
  {
    id: '1',
    studyId: '1',
    name: 'Daily Symptom Diary',
    type: 'diary',
    status: 'published',
    version: '1.2',
    components: [],
    createdAt: '2024-01-20',
    updatedAt: '2024-03-15',
  },
  {
    id: '2',
    studyId: '1',
    name: 'Weekly Assessment',
    type: 'assessment',
    status: 'draft',
    version: '1.0',
    components: [],
    createdAt: '2024-02-10',
    updatedAt: '2024-03-18',
  },
  {
    id: '3',
    studyId: '1',
    name: 'Adverse Event Report',
    type: 'report',
    status: 'review',
    version: '2.0',
    components: [],
    createdAt: '2024-03-01',
    updatedAt: '2024-03-20',
  },
]

const MOCK_DELAY = 300

const mockResponse = <T>(data: T): Promise<T> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), MOCK_DELAY)
  })
}

interface CreateFormRequest {
  name: string
  type: Form['type']
}

interface UpdateFormRequest {
  name?: string
  type?: Form['type']
  status?: Form['status']
}

export const formsApi = {
  // Get all forms for a study
  async getForms(studyId: string, params: FormListParams = {}): Promise<FormListResponse> {
    // TODO: Replace with actual API call
    // return apiClient.get<FormListResponse>(`/studies/${studyId}/forms`, { params })

    let filtered = MOCK_FORMS.filter((f) => f.studyId === studyId)

    if (params.status) {
      filtered = filtered.filter((f) => f.status === params.status)
    }
    if (params.type) {
      filtered = filtered.filter((f) => f.type === params.type)
    }

    return mockResponse<FormListResponse>({
      data: filtered,
      total: filtered.length,
    })
  },

  // Get single form
  async getForm(studyId: string, formId: string): Promise<Form> {
    // TODO: Replace with actual API call
    // return apiClient.get<Form>(`/studies/${studyId}/forms/${formId}`)

    const form = MOCK_FORMS.find((f) => f.id === formId && f.studyId === studyId)
    if (!form) {
      throw new Error('Form not found')
    }
    return mockResponse<Form>(form)
  },

  // Create new form
  async createForm(studyId: string, data: CreateFormRequest): Promise<Form> {
    // TODO: Replace with actual API call
    // return apiClient.post<Form>(`/studies/${studyId}/forms`, data)

    const newForm: Form = {
      ...data,
      id: String(MOCK_FORMS.length + 1),
      studyId,
      status: 'draft',
      version: '1.0',
      components: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    return mockResponse<Form>(newForm)
  },

  // Update form
  async updateForm(studyId: string, formId: string, data: UpdateFormRequest): Promise<Form> {
    // TODO: Replace with actual API call
    // return apiClient.put<Form>(`/studies/${studyId}/forms/${formId}`, data)

    const form = MOCK_FORMS.find((f) => f.id === formId)
    if (!form) {
      throw new Error('Form not found')
    }
    return mockResponse<Form>({
      ...form,
      ...data,
      updatedAt: new Date().toISOString(),
    })
  },

  // Delete form
  async deleteForm(studyId: string, formId: string): Promise<SuccessResponse> {
    // TODO: Replace with actual API call
    // return apiClient.delete<SuccessResponse>(`/studies/${studyId}/forms/${formId}`)

    return mockResponse<SuccessResponse>({ success: true })
  },

  // Save form components
  async saveFormComponents(
    studyId: string,
    formId: string,
    components: FormComponent[]
  ): Promise<SaveFormComponentsResponse> {
    // TODO: Replace with actual API call
    // return apiClient.put<SaveFormComponentsResponse>(`/studies/${studyId}/forms/${formId}/components`, { components })

    return mockResponse<SaveFormComponentsResponse>({
      success: true,
      components,
      updatedAt: new Date().toISOString(),
    })
  },

  // Publish form
  async publishForm(studyId: string, formId: string): Promise<PublishFormResponse> {
    // TODO: Replace with actual API call
    // return apiClient.post<PublishFormResponse>(`/studies/${studyId}/forms/${formId}/publish`, {})

    return mockResponse<PublishFormResponse>({
      success: true,
      status: 'published',
      publishedAt: new Date().toISOString(),
    })
  },

  // Submit form for review
  async submitForReview(studyId: string, formId: string): Promise<{ success: boolean; status: string; submittedAt: string }> {
    // TODO: Replace with actual API call
    // return apiClient.post(`/studies/${studyId}/forms/${formId}/submit-review`, {})

    return mockResponse({
      success: true,
      status: 'review',
      submittedAt: new Date().toISOString(),
    })
  },

  // Get form versions
  async getFormVersions(studyId: string, formId: string): Promise<FormVersion[]> {
    // TODO: Replace with actual API call
    // return apiClient.get<FormVersion[]>(`/studies/${studyId}/forms/${formId}/versions`)

    return mockResponse<FormVersion[]>([
      { version: '1.0', createdAt: '2024-01-20', status: 'archived' },
      { version: '1.1', createdAt: '2024-02-15', status: 'archived' },
      { version: '1.2', createdAt: '2024-03-15', status: 'current' },
    ])
  },
}
