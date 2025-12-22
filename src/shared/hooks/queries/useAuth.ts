/**
 * Auth Query Hooks
 * React Query hooks for authentication
 */

import { useQuery, useMutation, useQueryClient, UseQueryOptions } from '@tanstack/react-query'
import { authApi } from '../../services/api'
import type { User, LoginCredentials, LoginResponse, ForgotPasswordResponse, ResetPasswordRequest } from '../../../types'

// Query keys
export const authKeys = {
  all: ['auth'] as const,
  user: () => [...authKeys.all, 'user'] as const,
}

// Get current user
export const useCurrentUser = (options: Omit<UseQueryOptions<User, Error>, 'queryKey' | 'queryFn'> = {}) => {
  return useQuery({
    queryKey: authKeys.user(),
    queryFn: () => authApi.getCurrentUser(),
    retry: false,
    staleTime: Infinity,
    ...options,
  })
}

// Login mutation
export const useLogin = () => {
  const queryClient = useQueryClient()

  return useMutation<LoginResponse, Error, LoginCredentials>({
    mutationFn: (credentials) => authApi.login(credentials),
    onSuccess: (data) => {
      localStorage.setItem('auth_token', data.token)
      queryClient.setQueryData(authKeys.user(), data.user)
    },
  })
}

// Microsoft SSO login mutation
export const useLoginWithMicrosoft = () => {
  const queryClient = useQueryClient()

  return useMutation<LoginResponse, Error, void>({
    mutationFn: () => authApi.loginWithMicrosoft(),
    onSuccess: (data) => {
      localStorage.setItem('auth_token', data.token)
      queryClient.setQueryData(authKeys.user(), data.user)
    },
  })
}

// Logout mutation
export const useLogout = () => {
  const queryClient = useQueryClient()

  return useMutation<{ success: boolean }, Error, void>({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      localStorage.removeItem('auth_token')
      queryClient.setQueryData(authKeys.user(), null)
      queryClient.clear()
    },
  })
}

// Forgot password mutation
export const useForgotPassword = () => {
  return useMutation<ForgotPasswordResponse, Error, string>({
    mutationFn: (email) => authApi.forgotPassword(email),
  })
}

// Reset password mutation
export const useResetPassword = () => {
  return useMutation<ForgotPasswordResponse, Error, ResetPasswordRequest>({
    mutationFn: ({ token, newPassword }) =>
      authApi.resetPassword(token, newPassword),
  })
}
