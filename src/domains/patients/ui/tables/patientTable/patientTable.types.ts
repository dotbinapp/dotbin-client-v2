export type PatientTableSortField = 'fullName' | 'lastVisitAt'

export type PatientTableFilter = 'active' | 'inactive' | 'withInstagram' | 'withPhone'

export interface PatientTablePreview {
  documentNumber: string
  fullName: string
  id: string
  instagramAccount: string | null
  isActive: boolean
  lastVisitAt: string | null
  phone: string
  visits: number
}
