import type { BaseTableSortState } from '@shared/ui/organisms'
import type { PatientStatusFilter, PatientTablePreview, PatientTableSortField } from './patientTable.types'

export function getVisiblePatients(
  patients: PatientTablePreview[],
  searchTerm: string,
  statusFilter: PatientStatusFilter,
  sortState: BaseTableSortState<PatientTableSortField>,
) {
  const normalizedSearchTerm = searchTerm.trim().toLocaleLowerCase()
  const filteredPatients = patients.filter((patient) => {
    const matchesSearch = normalizedSearchTerm
      ? patient.fullName.toLocaleLowerCase().includes(normalizedSearchTerm) ||
        patient.documentNumber.toLocaleLowerCase().includes(normalizedSearchTerm)
      : true

    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'active' && patient.isActive) ||
      (statusFilter === 'inactive' && !patient.isActive)

    return matchesSearch && matchesStatus
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
