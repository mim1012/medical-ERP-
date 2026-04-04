import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '../lib/api-client'
import type { Client } from './use-clients'

export type ServiceType = 'INSTALLATION' | 'REPAIR' | 'MAINTENANCE'
export type ServiceStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED'

export interface ServiceCase {
  id: string
  clientId: string
  client: Client
  type: ServiceType
  status: ServiceStatus
  description: string | null
  assignee: string | null
  resolvedAt: string | null
  organizationId: string
  createdAt: string
  updatedAt: string
}

export interface CreateServiceDto {
  clientId: string
  type: ServiceType
  description?: string
  assignee?: string
}

export function useService(params?: { clientId?: string; type?: ServiceType; status?: ServiceStatus }) {
  return useQuery({
    queryKey: ['service', params],
    queryFn: async () => {
      const { data } = await apiClient.get('/service', { params })
      return (data.data ?? []) as ServiceCase[]
    },
  })
}

export function useCreateService() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (dto: CreateServiceDto) => {
      const { data } = await apiClient.post('/service', dto)
      return data.data as ServiceCase
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['service'] }),
  })
}

export function useUpdateService() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({
      id,
      ...dto
    }: { id: string; status?: ServiceStatus; assignee?: string; description?: string }) => {
      const { data } = await apiClient.patch(`/service/${id}`, dto)
      return data.data as ServiceCase
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['service'] }),
  })
}

export function useDeleteService() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/service/${id}`)
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['service'] }),
  })
}
