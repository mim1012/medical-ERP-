import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '../lib/api-client'

export type UserRole = 'ADMIN' | 'MANAGER' | 'STAFF'

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  supabaseUserId: string | null
  organizationId: string
  createdAt: string
  updatedAt: string
}

export interface UpdateUserDto {
  name?: string
  role?: UserRole
}

export function useUsers(params?: { role?: UserRole }) {
  return useQuery({
    queryKey: ['users', params],
    queryFn: async () => {
      const { data } = await apiClient.get('/users', { params })
      return (data.data ?? []) as User[]
    },
  })
}

export function useUpdateUser() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...dto }: UpdateUserDto & { id: string }) => {
      const { data } = await apiClient.patch(`/users/${id}`, dto)
      return data.data as User
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['users'] }),
  })
}

export function useDeleteUser() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/users/${id}`)
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['users'] }),
  })
}
