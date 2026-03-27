// ============================================
// Shared types for Frontend & Backend
// ============================================

// Organization / Tenant
export type Plan = 'FREE' | 'PRO' | 'ENTERPRISE'

export interface Organization {
  id: string
  name: string
  bizNumber?: string
  address?: string
  phone?: string
  email?: string
  plan: Plan
  createdAt: string
  updatedAt: string
}

// User
export type UserRole = 'ADMIN' | 'MANAGER' | 'STAFF'

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  organizationId: string
  createdAt: string
  updatedAt: string
}

// Client
export type ClientType = 'HOSPITAL' | 'CLINIC' | 'PHARMACY' | 'OTHER'

export interface Client {
  id: string
  name: string
  type: ClientType
  bizNumber?: string
  address?: string
  phone?: string
  email?: string
  manager?: string
  notes?: string
  organizationId: string
  createdAt: string
  updatedAt: string
}

// Product
export interface Product {
  id: string
  name: string
  category?: string
  brand?: string
  model?: string
  licenseNumber?: string
  unitPrice?: number
  description?: string
  organizationId: string
  createdAt: string
  updatedAt: string
}

// Inventory
export interface Inventory {
  id: string
  productId: string
  quantity: number
  safetyStock: number
  lotNumber?: string
  organizationId: string
  updatedAt: string
}

// Shipment
export type ShipmentStatus =
  | 'REQUESTED'
  | 'APPROVED'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED'

export interface Shipment {
  id: string
  clientId: string
  status: ShipmentStatus
  shippedAt?: string
  deliveredAt?: string
  notes?: string
  organizationId: string
  createdAt: string
  updatedAt: string
}

export interface ShipmentItem {
  id: string
  shipmentId: string
  productId: string
  quantity: number
  unitPrice: number
}

// Receiving
export type ReceivingStatus =
  | 'PENDING'
  | 'INSPECTING'
  | 'COMPLETED'
  | 'REJECTED'

export interface Receiving {
  id: string
  supplier: string
  status: ReceivingStatus
  receivedAt?: string
  notes?: string
  organizationId: string
  createdAt: string
  updatedAt: string
}

export interface ReceivingItem {
  id: string
  receivingId: string
  productId: string
  quantity: number
  unitPrice: number
}

// Service
export type ServiceType = 'INSTALLATION' | 'REPAIR' | 'MAINTENANCE'
export type ServiceStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED'

export interface ServiceCase {
  id: string
  clientId: string
  type: ServiceType
  status: ServiceStatus
  description?: string
  assignee?: string
  resolvedAt?: string
  organizationId: string
  createdAt: string
  updatedAt: string
}

// API Response
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  meta?: PaginationMeta
}

export interface PaginationMeta {
  total: number
  page: number
  limit: number
  totalPages: number
}

// API Query Params
export interface PaginationParams {
  page?: number
  limit?: number
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}
