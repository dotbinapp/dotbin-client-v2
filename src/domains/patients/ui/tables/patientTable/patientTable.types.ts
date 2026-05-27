export type PatientTableSortField = 'fullName' | 'lastVisitAt'

export type PatientStatusFilter = 'all' | 'active' | 'inactive'

export interface PatientTablePreview {
  documentNumber: string
  fullName: string
  id: string
  isActive: boolean
  lastVisitAt: string | null
  phone: string
  visits: number
}
