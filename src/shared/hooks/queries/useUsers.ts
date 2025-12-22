/**
 * Users Query Hooks
 * React Query hooks for user management
 */

import { useQuery, useMutation, useQueryClient, UseQueryOptions } from '@tanstack/react-query'
import { usersApi } from '../../services/api'
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

// Query keys
export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (filters: UserListParams) => [...userKeys.lists(), filters] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
}

// Get all users
export const useUsers = (
  params: UserListParams = {},
  options: Omit<UseQueryOptions<UserListResponse, Error>, 'queryKey' | 'queryFn'> = {}
) => {
  return useQuery({
    queryKey: userKeys.list(params),
    queryFn: () => usersApi.getUsers(params),
    ...options,
  })
}

// Get single user
export const useUser = (
  id: string,
  options: Omit<UseQueryOptions<UserProfile, Error>, 'queryKey' | 'queryFn'> = {}
) => {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: () => usersApi.getUser(id),
    enabled: !!id,
    ...options,
  })
}

// Create user mutation
export const useCreateUser = () => {
  const queryClient = useQueryClient()

  return useMutation<UserProfile, Error, CreateUserRequest>({
    mutationFn: (data) => usersApi.createUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() })
    },
  })
}

// Update user mutation
export const useUpdateUser = () => {
  const queryClient = useQueryClient()

  return useMutation<UserProfile, Error, { id: string; data: UpdateUserRequest }>({
    mutationFn: ({ id, data }) => usersApi.updateUser(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: userKeys.detail(id) })
      queryClient.invalidateQueries({ queryKey: userKeys.lists() })
    },
  })
}

// Delete user mutation
export const useDeleteUser = () => {
  const queryClient = useQueryClient()

  return useMutation<SuccessResponse, Error, string>({
    mutationFn: (id) => usersApi.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() })
    },
  })
}

// Update user status mutation
export const useUpdateUserStatus = () => {
  const queryClient = useQueryClient()

  return useMutation<{ id: string; status: UserStatus }, Error, { id: string; status: UserStatus }>({
    mutationFn: ({ id, status }) => usersApi.updateUserStatus(id, status),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: userKeys.detail(id) })
      queryClient.invalidateQueries({ queryKey: userKeys.lists() })
    },
  })
}

// Update user roles mutation
export const useUpdateUserRoles = () => {
  const queryClient = useQueryClient()

  return useMutation<{ id: string; roles: RoleType[] }, Error, { id: string; roles: RoleType[] }>({
    mutationFn: ({ id, roles }) => usersApi.updateUserRoles(id, roles),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: userKeys.detail(id) })
      queryClient.invalidateQueries({ queryKey: userKeys.lists() })
    },
  })
}

// Invite user mutation
export const useInviteUser = () => {
  return useMutation<InviteUserResponse, Error, { email: string; roles: RoleType[] }>({
    mutationFn: ({ email, roles }) => usersApi.inviteUser(email, roles),
  })
}
