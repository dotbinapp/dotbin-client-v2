export type PatientListSortField = 'fullName'
export type PatientListSortDirection = 'asc' | 'desc'
export type PatientGender = 'female' | 'male'

export interface PatientSummary {
  dateOfBirth: string | null
  documentNumber: string | null
  email: string | null
  firstName: string
  fullName: string
  gender: PatientGender | null
  id: string
  instagramAccount: string | null
  isActive: boolean
  lastVisitAt: string | null
  lastName: string
  phone: string | null
  visits: number
}

export interface PatientDetail extends PatientSummary {
  lastServiceName: string | null
  nextVisitAt: string | null
}

export interface PatientCreatePayload {
  dateOfBirth?: string
  documentNumber?: number
  email?: string
  firstName: string
  gender?: PatientGender | ''
  instagramAccount?: string
  lastName: string
  phone?: string
}

export interface PatientListParams {
  isActive?: boolean
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
