import { useQuery } from '@tanstack/react-query'
import { apiClient } from '../lib/api-client'

export interface AuditLog {
  id: string
  action: string
  resource: string
  resourceId: string | null
  userId: string | null
  details: Record<string, unknown> | null
  organizationId: string
  createdAt: string
}

export function useLogs(params?: { action?: string; resource?: string; userId?: string; from?: string; to?: string }) {
  return useQuery({
    queryKey: ['log', params],
    queryFn: async () => {
      const { data } = await apiClient.get('/log', { params })
      return (data.data ?? []) as AuditLog[]
    },
  })
}
