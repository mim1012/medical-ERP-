import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '../lib/api-client'

export interface Settlement {
  id?: string
  code: string
  client: string
  period: string
  salesAmount: number
  collectedAmount: number
  unpaidAmount: number
  status: string
  dueDate: string
}

export function useSettlement(params?: { search?: string; status?: string }) {
  return useQuery({
    queryKey: ['settlement', params],
    queryFn: async () => {
      const { data } = await apiClient.get('/settlement', { params })
      return (data.data ?? []) as Settlement[]
    },
  })
}

export function useCreateSettlement() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (dto: Omit<Settlement, 'id'>) => {
      const { data } = await apiClient.post('/settlement', dto)
      return data.data as Settlement
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['settlement'] }),
  })
}

export function useUpdateSettlement() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...dto }: Partial<Settlement> & { id: string }) => {
      const { data } = await apiClient.patch(`/settlement/${id}`, dto)
      return data.data as Settlement
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['settlement'] }),
  })
}

export function useDeleteSettlement() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/settlement/${id}`)
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['settlement'] }),
  })
}
