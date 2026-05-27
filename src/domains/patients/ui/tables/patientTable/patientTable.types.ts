import type { PatientListSortField } from '@domains/patients/model/patient.types'

export type PatientTableSortField = PatientListSortField

export type PatientTableFilter = 'active' | 'inactive' | 'withInstagram' | 'withPhone'
