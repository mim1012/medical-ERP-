import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '../lib/api-client'
import type { Client } from './use-clients'
import type { Product } from './use-products'

export type ShipmentStatus = 'REQUESTED' | 'APPROVED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'

export interface ShipmentItem {
  id: string
  shipmentId: string
  productId: string
  product: Product
  quantity: number
  unitPrice: string  // Decimal serialized as string
}

export interface Shipment {
  id: string
  clientId: string
  client: Client
  status: ShipmentStatus
  shippedAt: string | null
  deliveredAt: string | null
  notes: string | null
  organizationId: string
  createdAt: string
  updatedAt: string
  items: ShipmentItem[]
}

export interface CreateShipmentDto {
  clientId: string
  notes?: string
  items: Array<{
    productId: string
    quantity: number
    unitPrice: number
  }>
}

export function useShipping(params?: { clientId?: string; status?: ShipmentStatus }) {
  return useQuery({
    queryKey: ['shipping', params],
    queryFn: async () => {
      const { data } = await apiClient.get('/shipping', { params })
      return (data.data ?? []) as Shipment[]
    },
  })
}

export function useCreateShipment() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (dto: CreateShipmentDto) => {
      const { data } = await apiClient.post('/shipping', dto)
      return data.data as Shipment
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['shipping'] }),
  })
}

export function useUpdateShipmentStatus() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, status, notes }: { id: string; status: ShipmentStatus; notes?: string }) => {
      const { data } = await apiClient.patch(`/shipping/${id}/status`, { status, notes })
      return data.data as Shipment
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['shipping'] }),
  })
}

export function useDeleteShipment() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/shipping/${id}`)
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['shipping'] }),
  })
}
