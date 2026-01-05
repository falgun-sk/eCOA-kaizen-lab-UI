/**
 * User Management Types
 */

import { ROLES } from '../features/access/constants/roles'

export type RoleType = typeof ROLES[keyof typeof ROLES]
export type UserStatus = 'active' | 'inactive'

export interface UserProfile {
  id: string
  name: string
  email: string
  roles: RoleType[]
  status: UserStatus
  lastLogin?: string | null
  createdAt: string
}

export interface UserListParams {
  search?: string
  role?: RoleType
  status?: UserStatus
  page?: number
  pageSize?: number
}

export interface UserListResponse {
  data: UserProfile[]
  total: number
  page: number
  pageSize: number
}

export interface CreateUserRequest {
  name: string
  email: string
  roles: RoleType[]
  status?: UserStatus
}

export interface UpdateUserRequest extends Partial<CreateUserRequest> {}

export interface InviteUserRequest {
  email: string
  roles: RoleType[]
}

export interface InviteUserResponse {
  success: boolean
  message: string
}
