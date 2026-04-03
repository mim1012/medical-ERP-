import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '../lib/api-client'

export interface Product {
  id?: string
  code: string
  name: string
  modelName: string
  category: string
  manufacturer: string
  approvalNumber: string
  lotManagement: boolean
  serialManagement: boolean
  expiryManagement: boolean
  stockQuantity: number
  status: string
  registrationDate: string
  deviceGrade?: string
  standardPrice?: number
  supplyPrice?: number
  salePrice?: number
  safetyStock?: number
  minStock?: number
  maxStock?: number
  insuranceCode?: string
  insuranceCovered?: boolean
  expiryDate?: string
  manufacturingCountry?: string
  originCountry?: string
}

export function useProducts(params?: { search?: string; category?: string }) {
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
    mutationFn: async (dto: Omit<Product, 'id'>) => {
      const { data } = await apiClient.post('/products', dto)
      return data.data as Product
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['products'] }),
  })
}

export function useUpdateProduct() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...dto }: Partial<Product> & { id: string }) => {
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
