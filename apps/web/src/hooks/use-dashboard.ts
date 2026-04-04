import { useQuery } from '@tanstack/react-query'
import { apiClient } from '../lib/api-client'

export interface DashboardStats {
  totalClients: number
  totalProducts: number
  monthlyShipments: number
  lowStockCount: number
  openServiceCases: number
  unpaidBalance: number
  recentNotifications: Array<{
    id: string
    title: string
    message: string
    type: string
    isRead: boolean
    createdAt: string
  }>
  monthlyRevenueChart: Array<{ month: string; revenue: number }>
  recentShipments: Array<{
    id: string
    clientName: string
    itemCount: number
    status: string
    createdAt: string
  }>
}

export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: async () => {
      const { data } = await apiClient.get('/dashboard/stats')
      return data.data as DashboardStats
    },
  })
}
