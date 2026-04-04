import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '../lib/api-client'
import type { Client } from './use-clients'

export type TaxInvoiceStatus = 'DRAFT' | 'ISSUED' | 'CANCELLED'

export interface TaxInvoice {
  id: string
  clientId: string
  client: Client
  invoiceNumber: string
  amount: string   // Decimal serialized as string
  tax: string      // Decimal serialized as string
  status: TaxInvoiceStatus
  issuedAt: string | null
  notes: string | null
  organizationId: string
  createdAt: string
  updatedAt: string
}

export interface CreateTaxInvoiceDto {
  clientId: string
  amount: number
  tax: number
  notes?: string
}

export function useTaxInvoices(params?: { clientId?: string; status?: TaxInvoiceStatus }) {
  return useQuery({
    queryKey: ['tax-invoice', params],
    queryFn: async () => {
      const { data } = await apiClient.get('/tax-invoice', { params })
      return (data.data ?? []) as TaxInvoice[]
    },
  })
}

export function useCreateTaxInvoice() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (dto: CreateTaxInvoiceDto) => {
      const { data } = await apiClient.post('/tax-invoice', dto)
      return data.data as TaxInvoice
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['tax-invoice'] }),
  })
}

export function useUpdateTaxInvoice() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...dto }: Partial<CreateTaxInvoiceDto> & { id: string; status?: TaxInvoiceStatus }) => {
      const { data } = await apiClient.patch(`/tax-invoice/${id}`, dto)
      return data.data as TaxInvoice
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['tax-invoice'] }),
  })
}

export function useIssueTaxInvoice() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await apiClient.patch(`/tax-invoice/${id}/issue`)
      return data.data as TaxInvoice
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['tax-invoice'] }),
  })
}

export function useDeleteTaxInvoice() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/tax-invoice/${id}`)
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['tax-invoice'] }),
  })
}
