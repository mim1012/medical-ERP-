import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '../lib/api-client'

export interface Alert {
  id: string
  type: string
  title: string
  message: string
  isRead: boolean
  userId: string | null
  organizationId: string
  createdAt: string
}

export function useAlerts(params?: { isRead?: boolean }) {
  return useQuery({
    queryKey: ['alert', params],
    queryFn: async () => {
      const { data } = await apiClient.get('/alert', { params })
      return (data.data ?? []) as Alert[]
    },
  })
}

export function useUnreadAlertCount() {
  return useQuery({
    queryKey: ['alert', 'unread-count'],
    queryFn: async () => {
      const { data } = await apiClient.get('/alert/unread-count')
      return (data.data as { count: number }).count
    },
  })
}

export function useMarkAlertRead() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.patch(`/alert/${id}/read`)
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['alert'] }),
  })
}

export function useMarkAllAlertsRead() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async () => {
      await apiClient.patch('/alert/read-all')
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['alert'] }),
  })
}

export function useDeleteAlert() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/alert/${id}`)
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['alert'] }),
  })
}
