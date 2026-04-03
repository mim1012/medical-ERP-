import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '../lib/api-client'

export interface Document {
  id?: string
  code: string
  title: string
  type: string
  client?: string
  uploadDate: string
  expiryDate?: string
  status: string
  fileUrl?: string
}

export function useDocuments(params?: { search?: string; type?: string }) {
  return useQuery({
    queryKey: ['document', params],
    queryFn: async () => {
      const { data } = await apiClient.get('/document', { params })
      return (data.data ?? []) as Document[]
    },
  })
}

export function useCreateDocument() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (dto: Omit<Document, 'id'>) => {
      const { data } = await apiClient.post('/document', dto)
      return data.data as Document
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['document'] }),
  })
}

export function useUpdateDocument() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...dto }: Partial<Document> & { id: string }) => {
      const { data } = await apiClient.patch(`/document/${id}`, dto)
      return data.data as Document
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
