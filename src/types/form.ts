/**
 * Form Builder Types
 */

export type FormStatus = 'draft' | 'review' | 'published' | 'archived'
export type FormType = 'diary' | 'assessment' | 'report' | 'questionnaire'

export interface Form {
  id: string
  studyId: string
  name: string
  type: FormType
  status: FormStatus
  version: string
  components: FormComponent[]
  createdAt: string
  updatedAt: string
  publishedAt?: string
}

export interface FormComponent {
  id: string
  type: ComponentType
  label: string
  required?: boolean
  placeholder?: string
  options?: string[]
  validation?: ValidationRules
  logic?: BranchingLogic
}

export type ComponentType =
  | 'text'
  | 'textarea'
  | 'number'
  | 'date'
  | 'time'
  | 'datetime'
  | 'select'
  | 'radio'
  | 'checkbox'
  | 'slider'
  | 'rating'
  | 'file'
  | 'signature'

export interface ValidationRules {
  min?: number
  max?: number
  minLength?: number
  maxLength?: number
  pattern?: string
  customMessage?: string
}

export interface BranchingLogic {
  condition: BranchingCondition
  action: BranchingAction
  targetId?: string
}

export type BranchingCondition =
  | 'equals'
  | 'not_equals'
  | 'greater_than'
  | 'less_than'
  | 'contains'
  | 'is_empty'
  | 'is_not_empty'

export type BranchingAction = 'show' | 'hide' | 'skip_to' | 'require'

export interface FormListParams {
  status?: FormStatus
  type?: FormType
}

export interface FormListResponse {
  data: Form[]
  total: number
}

export interface FormVersion {
  version: string
  createdAt: string
  status: 'current' | 'archived'
}

export interface SaveFormComponentsResponse {
  success: boolean
  components: FormComponent[]
  updatedAt: string
}

export interface PublishFormResponse {
  success: boolean
  status: FormStatus
  publishedAt: string
}
