import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '../lib/api-client'
import type { Product } from './use-products'

export interface InventoryItem {
  id: string
  productId: string
  product: Product
  quantity: number
  safetyStock: number
  lotNumber: string | null
  organizationId: string
  updatedAt: string
}

export interface AdjustInventoryDto {
  quantity: number
}

export function useInventory(params?: { search?: string }) {
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
    mutationFn: async ({ id, ...dto }: { id: string; safetyStock?: number; lotNumber?: string }) => {
      const { data } = await apiClient.patch(`/inventory/${id}`, dto)
      return data.data as InventoryItem
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['inventory'] }),
  })
}

export function useAdjustInventory() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...dto }: AdjustInventoryDto & { id: string }) => {
      const { data } = await apiClient.post(`/inventory/${id}/adjust`, dto)
      return data.data as InventoryItem
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['inventory'] }),
  })
}
