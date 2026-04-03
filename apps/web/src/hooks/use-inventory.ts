import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '../lib/api-client'

export interface InventoryItem {
  id?: string
  productCode: string
  productName: string
  category: string
  lotNumber?: string
  serialNumber?: string
  expiryDate?: string
  quantity: number
  location: string
  status: string
  lastUpdated: string
}

export function useInventory(params?: { search?: string; category?: string }) {
  return useQuery({
    queryKey: ['inventory', params],
    queryFn: async () => {
      const { data } = await apiClient.get('/inventory', { params })
      return (data.data ?? []) as InventoryItem[]
    },
  })
}

export function useUpdateInventory() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...dto }: Partial<InventoryItem> & { id: string }) => {
      const { data } = await apiClient.patch(`/inventory/${id}`, dto)
      return data.data as InventoryItem
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['inventory'] }),
  })
}
