import type { BaseTableSortState } from '@shared/ui/organisms'
import type { PatientTableFilter, PatientTablePreview, PatientTableSortField } from './patientTable.types'

export function getVisiblePatients(
  patients: PatientTablePreview[],
  searchTerm: string,
  activeFilterValues: PatientTableFilter[],
  sortState: BaseTableSortState<PatientTableSortField>,
) {
  const normalizedSearchTerm = searchTerm.trim().toLocaleLowerCase()
  const filteredPatients = patients.filter((patient) => {
    const matchesSearch = normalizedSearchTerm
      ? patient.fullName.toLocaleLowerCase().includes(normalizedSearchTerm) ||
        patient.instagramAccount?.toLocaleLowerCase().includes(normalizedSearchTerm) ||
        patient.phone.toLocaleLowerCase().includes(normalizedSearchTerm)
      : true

    const matchesFilters = activeFilterValues.every((filterValue) => patientMatchesFilter(patient, filterValue))

    return matchesSearch && matchesFilters
  })

  if (!sortState) return filteredPatients

  return [...filteredPatients].sort((firstPatient, secondPatient) => {
    const comparison = comparePatients(firstPatient, secondPatient, sortState.field)

    return sortState.direction === 'asc' ? comparison : -comparison
  })
}

export function formatPatientVisitDate(lastVisitAt: string | null) {
  if (!lastVisitAt) return '—'

  return new Intl.DateTimeFormat('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(lastVisitAt))
}

export function getInstagramProfileUrl(instagramAccount: string) {
  return `https://instagram.com/${instagramAccount.replace('@', '')}`
}

export function getWhatsAppUrl(phone: string) {
  return `https://wa.me/${phone.replace(/\D/g, '')}`
}

export function getPaginatedPatients(patients: PatientTablePreview[], page: number, pageSize: number) {
  const startIndex = (page - 1) * pageSize

  return patients.slice(startIndex, startIndex + pageSize)
}

function patientMatchesFilter(patient: PatientTablePreview, filterValue: PatientTableFilter) {
  if (filterValue === 'active') return patient.isActive
  if (filterValue === 'inactive') return !patient.isActive
  if (filterValue === 'withInstagram') return Boolean(patient.instagramAccount)

  return Boolean(patient.phone)
}

function comparePatients(
  firstPatient: PatientTablePreview,
  secondPatient: PatientTablePreview,
  sortField: PatientTableSortField,
) {
  if (sortField === 'fullName') {
    return firstPatient.fullName.localeCompare(secondPatient.fullName)
  }

  return getVisitTimestamp(firstPatient.lastVisitAt) - getVisitTimestamp(secondPatient.lastVisitAt)
}

function getVisitTimestamp(lastVisitAt: string | null) {
  if (!lastVisitAt) return 0

  return new Date(lastVisitAt).getTime()
}
