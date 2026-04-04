import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '../lib/api-client'

export interface Product {
  id: string
  name: string
  category: string | null
  brand: string | null
  model: string | null
  licenseNumber: string | null
  unitPrice: string | null  // Decimal serialized as string
  description: string | null
  organizationId: string
  createdAt: string
  updatedAt: string
}

export interface CreateProductDto {
  name: string
  category?: string
  brand?: string
  model?: string
  licenseNumber?: string
  unitPrice?: number
  description?: string
}

export function useProducts(params?: { name?: string; category?: string; page?: number; limit?: number }) {
  return useQuery({
    queryKey: ['products', params],
    queryFn: async () => {
      const { data } = await apiClient.get('/products', { params })
      return (data.data ?? []) as Product[]
    },
  })
}

export function useCreateProduct() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (dto: CreateProductDto) => {
      const { data } = await apiClient.post('/products', dto)
      return data.data as Product
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['products'] }),
  })
}

export function useUpdateProduct() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...dto }: Partial<CreateProductDto> & { id: string }) => {
      const { data } = await apiClient.patch(`/products/${id}`, dto)
      return data.data as Product
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['products'] }),
  })
}

export function useDeleteProduct() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/products/${id}`)
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['products'] }),
  })
}
