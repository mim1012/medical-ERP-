import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '../lib/api-client'

export interface ServiceCase {
  id?: string
  code: string
  client: string
  product: string
  type: string
  requestDate: string
  status: string
  engineer?: string
  description?: string
}

export function useService(params?: { search?: string; type?: string; status?: string }) {
  return useQuery({
    queryKey: ['service', params],
    queryFn: async () => {
      const { data } = await apiClient.get('/service', { params })
      return (data.data ?? []) as ServiceCase[]
    },
  })
}

export function useCreateService() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (dto: Omit<ServiceCase, 'id'>) => {
      const { data } = await apiClient.post('/service', dto)
      return data.data as ServiceCase
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['service'] }),
  })
}

export function useUpdateService() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...dto }: Partial<ServiceCase> & { id: string }) => {
      const { data } = await apiClient.patch(`/service/${id}`, dto)
      return data.data as ServiceCase
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['service'] }),
  })
}

export function useDeleteService() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/service/${id}`)
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['service'] }),
  })
}
