import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '../lib/api-client'
import type { Client } from './use-clients'

export type SettlementType = 'RECEIVABLE' | 'PAYABLE'
export type SettlementStatus = 'PENDING' | 'PARTIAL' | 'COMPLETED' | 'OVERDUE'

export interface Settlement {
  id: string
  clientId: string
  client: Client
  type: SettlementType
  amount: string  // Decimal serialized as string
  status: SettlementStatus
  dueDate: string | null
  settledAt: string | null
  notes: string | null
  organizationId: string
  createdAt: string
  updatedAt: string
}

export interface CreateSettlementDto {
  clientId: string
  type: SettlementType
  amount: number
  dueDate?: string
  notes?: string
}

export function useSettlement(params?: { clientId?: string; status?: SettlementStatus; type?: SettlementType }) {
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
    mutationFn: async (dto: CreateSettlementDto) => {
      const { data } = await apiClient.post('/settlement', dto)
      return data.data as Settlement
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['settlement'] }),
  })
}

export function useUpdateSettlement() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({
      id,
      ...dto
    }: {
      id: string
      status?: SettlementStatus
      settledAt?: string
      dueDate?: string
      notes?: string
    }) => {
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
