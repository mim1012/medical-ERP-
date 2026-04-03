import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '../lib/api-client'

export interface Shipment {
  id?: string
  code: string
  client: string
  product: string
  quantity: number
  date: string
  status: string
  address?: string
  trackingNumber?: string
}

export function useShipping(params?: { search?: string; status?: string }) {
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
    mutationFn: async (dto: Omit<Shipment, 'id'>) => {
      const { data } = await apiClient.post('/shipping', dto)
      return data.data as Shipment
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['shipping'] }),
  })
}

export function useUpdateShipment() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...dto }: Partial<Shipment> & { id: string }) => {
      const { data } = await apiClient.patch(`/shipping/${id}`, dto)
      return data.data as Shipment
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['shipping'] }),
  })
}

export function useUpdateShipmentStatus() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { data } = await apiClient.patch(`/shipping/${id}/status`, { status })
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
