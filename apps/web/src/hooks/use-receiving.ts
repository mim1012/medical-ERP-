import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '../lib/api-client'
import type { Product } from './use-products'

export type ReceivingStatus = 'PENDING' | 'INSPECTING' | 'COMPLETED' | 'REJECTED'

export interface ReceivingItem {
  id: string
  receivingId: string
  productId: string
  product: Product
  quantity: number
  unitPrice: string  // Decimal serialized as string
}

export interface Receiving {
  id: string
  supplier: string
  status: ReceivingStatus
  receivedAt: string | null
  notes: string | null
  organizationId: string
  createdAt: string
  updatedAt: string
  items: ReceivingItem[]
}

export interface CreateReceivingDto {
  supplier: string
  notes?: string
  items: Array<{
    productId: string
    quantity: number
    unitPrice: number
  }>
}

export function useReceiving(params?: { supplier?: string; status?: ReceivingStatus }) {
  return useQuery({
    queryKey: ['receiving', params],
    queryFn: async () => {
      const { data } = await apiClient.get('/receiving', { params })
      return (data.data ?? []) as Receiving[]
    },
  })
}

export function useCreateReceiving() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (dto: CreateReceivingDto) => {
      const { data } = await apiClient.post('/receiving', dto)
      return data.data as Receiving
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['receiving'] }),
  })
}

export function useUpdateReceiving() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...dto }: { id: string; status?: ReceivingStatus; notes?: string }) => {
      const { data } = await apiClient.patch(`/receiving/${id}`, dto)
      return data.data as Receiving
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['receiving'] }),
  })
}

export function useDeleteReceiving() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/receiving/${id}`)
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['receiving'] }),
  })
}
