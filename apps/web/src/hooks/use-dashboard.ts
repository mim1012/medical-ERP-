import { useQuery } from '@tanstack/react-query'
import { apiClient } from '../lib/api-client'

export interface DashboardStats {
  monthlyRevenue: number
  unpaidBalance: number
  todayShipments: number
  asRequests: number
  expiringProducts: number
  warrantyExpiry: number
  monthlyRevenueChart: { month: string; revenue: number }[]
  clientRevenue: { name: string; revenue: number }[]
  productShare: { name: string; value: number; color: string }[]
  recentShipments: {
    id: string
    client: string
    product: string
    quantity: number
    date: string
    status: string
  }[]
  recentService: {
    id: string
    client: string
    product: string
    type: string
    date: string
    status: string
  }[]
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
