import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '../lib/api-client'
import type { Client } from './use-clients'

export type DocumentType = 'CONTRACT' | 'CERTIFICATE' | 'MANUAL' | 'WARRANTY' | 'OTHER'

export interface DocumentRecord {
  id: string
  title: string
  type: DocumentType
  clientId: string | null
  client: Client | null
  fileUrl: string | null
  expiresAt: string | null
  notes: string | null
  organizationId: string
  createdAt: string
  updatedAt: string
}

export interface CreateDocumentDto {
  title: string
  type: DocumentType
  clientId?: string
  fileUrl?: string
  expiresAt?: string
  notes?: string
}

export function useDocuments(params?: { clientId?: string; type?: DocumentType }) {
  return useQuery({
    queryKey: ['document', params],
    queryFn: async () => {
      const { data } = await apiClient.get('/document', { params })
      return (data.data ?? []) as DocumentRecord[]
    },
  })
}

export function useCreateDocument() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (dto: CreateDocumentDto) => {
      const { data } = await apiClient.post('/document', dto)
      return data.data as DocumentRecord
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['document'] }),
  })
}

export function useUpdateDocument() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...dto }: Partial<CreateDocumentDto> & { id: string }) => {
      const { data } = await apiClient.patch(`/document/${id}`, dto)
      return data.data as DocumentRecord
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['document'] }),
  })
}

export function useDeleteDocument() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/document/${id}`)
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['document'] }),
  })
}
