import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '../lib/api-client'

export interface PurchaseOrder {
  id?: string
  code: string
  supplier: string
  orderDate: string
  expectedDate: string
  status: string
  items: { productCode: string; productName: string; quantity: number; unitPrice: number }[]
  totalAmount: number
}

export function useReceiving(params?: { search?: string; status?: string }) {
  return useQuery({
    queryKey: ['receiving', params],
    queryFn: async () => {
      const { data } = await apiClient.get('/receiving', { params })
      return (data.data ?? []) as PurchaseOrder[]
    },
  })
}

export function useCreateReceiving() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (dto: Omit<PurchaseOrder, 'id'>) => {
      const { data } = await apiClient.post('/receiving', dto)
      return data.data as PurchaseOrder
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['receiving'] }),
  })
}

export function useUpdateReceiving() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...dto }: Partial<PurchaseOrder> & { id: string }) => {
      const { data } = await apiClient.patch(`/receiving/${id}`, dto)
      return data.data as PurchaseOrder
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
