export type ServiceListSortField = 'description' | 'durationMinutes' | 'name' | 'price'
export type ServiceListSortDirection = 'asc' | 'desc'

export interface ServiceCreatePayload {
  cost: number
  depositAmount?: number
  description?: string
  durationMinutes: number
  name: string
  postServiceInstructions?: string
  requiresDeposit: boolean
}

export interface ServiceSummary {
  category: string | null
  cost: number
  depositAmount: number | null
  description: string | null
  durationMinutes: number
  hasPostServiceInstructions: boolean
  id: string
  name: string
  postServiceInstructions: string | null
  requiresDeposit: boolean
}

export interface ServiceListParams {
  isActive?: boolean
  limit: number
  offset: number
  searchTerm?: string
  sortDirection?: ServiceListSortDirection
  sortField?: ServiceListSortField
}

export interface ServiceListResult {
  services: ServiceSummary[]
  total: number
}
