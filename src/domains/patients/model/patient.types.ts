export type PatientListSortField = 'fullName'
export type PatientListSortDirection = 'asc' | 'desc'

export interface PatientSummary {
  fullName: string
  id: string
  instagramAccount: string | null
  isActive: boolean
  lastVisitAt: string | null
  phone: string | null
  visits: number
}

export interface PatientListParams {
  limit: number
  offset: number
  searchTerm?: string
  sortDirection?: PatientListSortDirection
  sortField?: PatientListSortField
}

export interface PatientListResult {
  patients: PatientSummary[]
  total: number
}
