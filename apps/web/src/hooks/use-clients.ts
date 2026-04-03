import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '../lib/api-client'

export interface Client {
  id?: string
  code: string
  name: string
  type: string
  representative: string
  contactPerson: string
  phone: string
  region: string
  unpaidBalance: number
  lastTransaction: string
  status: string
  registrationDate: string
  contractStart?: string
  contractEnd?: string
  beds?: number
  departments?: string[]
  annualRevenue?: number
  documentStatus?: {
    businessLicense: boolean
    bankAccount: boolean
    medicalLicense: boolean
    contract: boolean
  }
  grade?: string
}

export function useClients(params?: { search?: string; type?: string }) {
  return useQuery({
    queryKey: ['clients', params],
    queryFn: async () => {
      const { data } = await apiClient.get('/clients', { params })
      return (data.data ?? []) as Client[]
    },
  })
}

export function useCreateClient() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (dto: Omit<Client, 'id'>) => {
      const { data } = await apiClient.post('/clients', dto)
      return data.data as Client
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['clients'] }),
  })
}

export function useUpdateClient() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...dto }: Partial<Client> & { id: string }) => {
      const { data } = await apiClient.patch(`/clients/${id}`, dto)
      return data.data as Client
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['clients'] }),
  })
}

export function useDeleteClient() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/clients/${id}`)
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['clients'] }),
  })
}
