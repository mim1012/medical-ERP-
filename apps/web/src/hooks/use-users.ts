import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '../lib/api-client'

export interface User {
  id?: string
  name: string
  email: string
  role: string
  department: string
  status: string
  lastLogin?: string
  createdAt?: string
}

export function useUsers(params?: { search?: string; role?: string }) {
  return useQuery({
    queryKey: ['users', params],
    queryFn: async () => {
      const { data } = await apiClient.get('/users', { params })
      return (data.data ?? []) as User[]
    },
  })
}

export function useCreateUser() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (dto: Omit<User, 'id'>) => {
      const { data } = await apiClient.post('/users', dto)
      return data.data as User
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['users'] }),
  })
}

export function useUpdateUser() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...dto }: Partial<User> & { id: string }) => {
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
