import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '../lib/api-client'

export interface TaxInvoice {
  id?: string
  code: string
  client: string
  issueDate: string
  supplyAmount: number
  taxAmount: number
  totalAmount: number
  status: string
  dueDate?: string
}

export function useTaxInvoices(params?: { search?: string; status?: string }) {
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
    mutationFn: async (dto: Omit<TaxInvoice, 'id'>) => {
      const { data } = await apiClient.post('/tax-invoice', dto)
      return data.data as TaxInvoice
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['tax-invoice'] }),
  })
}

export function useUpdateTaxInvoice() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...dto }: Partial<TaxInvoice> & { id: string }) => {
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
