import { useQuery } from '@tanstack/react-query'
import { apiClient } from '../lib/api-client'

export interface LogEntry {
  id: string
  action: string
  user: string
  target: string
  description: string
  timestamp: string
  ipAddress?: string
}

export function useLogs(params?: { search?: string; action?: string }) {
  return useQuery({
    queryKey: ['log', params],
    queryFn: async () => {
      const { data } = await apiClient.get('/log', { params })
      return (data.data ?? []) as LogEntry[]
    },
  })
}
