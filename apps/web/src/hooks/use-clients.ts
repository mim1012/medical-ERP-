import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '../lib/api-client'

export type ClientType = 'HOSPITAL' | 'CLINIC' | 'PHARMACY' | 'OTHER'

export interface Client {
  id: string
  name: string
  type: ClientType
  bizNumber: string | null
  address: string | null
  phone: string | null
  email: string | null
  manager: string | null
  notes: string | null
  organizationId: string
  createdAt: string
  updatedAt: string
}

export interface CreateClientDto {
  name: string
  type: ClientType
  bizNumber?: string
  address?: string
  phone?: string
  email?: string
  manager?: string
  notes?: string
}

export function useClients(params?: { name?: string; type?: ClientType; page?: number; limit?: number }) {
  return useQuery({
    queryKey: ['clients', params],
    queryFn: async () => {
      const { data } = await apiClient.get('/clients', { params })
      return (data.data ?? []) as Client[]
    },
  })
}

export function useCreateClient() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (dto: CreateClientDto) => {
      const { data } = await apiClient.post('/clients', dto)
      return data.data as Client
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['clients'] }),
  })
}

export function useUpdateClient() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...dto }: Partial<CreateClientDto> & { id: string }) => {
      const { data } = await apiClient.patch(`/clients/${id}`, dto)
      return data.data as Client
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['clients'] }),
  })
}

export function useDeleteClient() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/clients/${id}`)
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['clients'] }),
  })
}
