export type ProfessionalListSortField = 'email' | 'fullName' | 'specialty'
export type ProfessionalListSortDirection = 'asc' | 'desc'

export interface ProfessionalCreatePayload {
  email?: string
  firstName: string
  lastName: string
  phone?: string
  specialty?: string
}

export interface ProfessionalSummary {
  email: string | null
  firstName: string
  fullName: string
  id: string
  lastName: string
  phone: string | null
  specialty: string | null
}

export interface ProfessionalListParams {
  isActive?: boolean
  limit: number
  offset: number
  searchTerm?: string
  sortDirection?: ProfessionalListSortDirection
  sortField?: ProfessionalListSortField
}

export interface ProfessionalListResult {
  professionals: ProfessionalSummary[]
  total: number
}
