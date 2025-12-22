/**
 * Users API Service
 * Handles user management API calls
 */

import { apiClient } from './client'
import type {
  UserProfile,
  UserListParams,
  UserListResponse,
  CreateUserRequest,
  UpdateUserRequest,
  InviteUserResponse,
  SuccessResponse,
  RoleType,
  UserStatus
} from '../../../types'

// Mock data for development
const MOCK_USERS: (UserProfile & { role?: string })[] = [
  {
    id: '1',
    name: 'John Admin',
    email: 'john.admin@kaizen.com',
    roles: ['admin'] as RoleType[],
    role: 'admin',
    status: 'active',
    lastLogin: '2024-03-21T10:30:00Z',
    createdAt: '2024-01-01',
  },
  {
    id: '2',
    name: 'Sarah Designer',
    email: 'sarah.designer@kaizen.com',
    roles: ['study_designer'] as RoleType[],
    role: 'study_designer',
    status: 'active',
    lastLogin: '2024-03-20T14:45:00Z',
    createdAt: '2024-01-15',
  },
  {
    id: '3',
    name: 'Mike Manager',
    email: 'mike.manager@kaizen.com',
    roles: ['project_manager'] as RoleType[],
    role: 'project_manager',
    status: 'active',
    lastLogin: '2024-03-21T09:00:00Z',
    createdAt: '2024-02-01',
  },
  {
    id: '4',
    name: 'Emily Reviewer',
    email: 'emily.reviewer@kaizen.com',
    roles: ['build_reviewer'] as RoleType[],
    role: 'build_reviewer',
    status: 'active',
    lastLogin: '2024-03-19T16:20:00Z',
    createdAt: '2024-02-10',
  },
  {
    id: '5',
    name: 'Tom UAT',
    email: 'tom.uat@kaizen.com',
    roles: ['uat_member'] as RoleType[],
    role: 'uat_member',
    status: 'inactive',
    lastLogin: '2024-02-28T11:00:00Z',
    createdAt: '2024-02-15',
  },
]

const MOCK_DELAY = 300

const mockResponse = <T>(data: T): Promise<T> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), MOCK_DELAY)
  })
}

export const usersApi = {
  // Get all users with optional filters
  async getUsers(params: UserListParams = {}): Promise<UserListResponse> {
    // TODO: Replace with actual API call
    // return apiClient.get<UserListResponse>('/users', { params })

    let filtered = [...MOCK_USERS]

    if (params.status) {
      filtered = filtered.filter((u) => u.status === params.status)
    }
    if (params.role) {
      filtered = filtered.filter((u) => u.roles.includes(params.role))
    }
    if (params.search) {
      const search = params.search.toLowerCase()
      filtered = filtered.filter(
        (u) =>
          u.name.toLowerCase().includes(search) ||
          u.email.toLowerCase().includes(search)
      )
    }

    return mockResponse<UserListResponse>({
      data: filtered,
      total: filtered.length,
      page: params.page || 1,
      pageSize: params.pageSize || 10,
    })
  },

  // Get single user by ID
  async getUser(id: string): Promise<UserProfile> {
    // TODO: Replace with actual API call
    // return apiClient.get<UserProfile>(`/users/${id}`)

    const user = MOCK_USERS.find((u) => u.id === id)
    if (!user) {
      throw new Error('User not found')
    }
    return mockResponse<UserProfile>(user)
  },

  // Create new user
  async createUser(data: CreateUserRequest): Promise<UserProfile> {
    // TODO: Replace with actual API call
    // return apiClient.post<UserProfile>('/users', data)

    const newUser: UserProfile = {
      ...data,
      id: String(MOCK_USERS.length + 1),
      status: data.status || 'active',
      lastLogin: null,
      createdAt: new Date().toISOString(),
    }
    return mockResponse<UserProfile>(newUser)
  },

  // Update user
  async updateUser(id: string, data: UpdateUserRequest): Promise<UserProfile> {
    // TODO: Replace with actual API call
    // return apiClient.put<UserProfile>(`/users/${id}`, data)

    const user = MOCK_USERS.find((u) => u.id === id)
    if (!user) {
      throw new Error('User not found')
    }
    return mockResponse<UserProfile>({ ...user, ...data })
  },

  // Delete user
  async deleteUser(id: string): Promise<SuccessResponse> {
    // TODO: Replace with actual API call
    // return apiClient.delete<SuccessResponse>(`/users/${id}`)

    return mockResponse<SuccessResponse>({ success: true })
  },

  // Update user status
  async updateUserStatus(id: string, status: UserStatus): Promise<{ id: string; status: UserStatus }> {
    // TODO: Replace with actual API call
    // return apiClient.patch(`/users/${id}/status`, { status })

    return mockResponse({ id, status })
  },

  // Update user roles
  async updateUserRoles(id: string, roles: RoleType[]): Promise<{ id: string; roles: RoleType[] }> {
    // TODO: Replace with actual API call
    // return apiClient.patch(`/users/${id}/roles`, { roles })

    return mockResponse({ id, roles })
  },

  // Invite user
  async inviteUser(email: string, roles: RoleType[]): Promise<InviteUserResponse> {
    // TODO: Replace with actual API call
    // return apiClient.post<InviteUserResponse>('/users/invite', { email, roles })

    return mockResponse<InviteUserResponse>({
      success: true,
      message: `Invitation sent to ${email}`,
    })
  },
}
