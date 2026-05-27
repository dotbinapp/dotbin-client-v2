import { useMemo, useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@shared/ui/atoms'
import { BaseTable } from '@shared/ui/organisms'
import type { BaseTableSortState } from '@shared/ui/organisms'
import { MOCK_PATIENTS, PATIENT_TABLE_COLUMNS, PATIENT_TABLE_FILTERS } from './patientTable.constants'
import type { PatientTableFilter, PatientTableSortField } from './patientTable.types'
import { getPaginatedPatients, getVisiblePatients } from './patientTable.utils'

const INITIAL_PAGE = 1
const INITIAL_PAGE_SIZE = 15

function PatientTable() {
  const [searchTerm, setSearchTerm] = useState('')
  const [activeFilterValues, setActiveFilterValues] = useState<PatientTableFilter[]>([])
  const [sortState, setSortState] = useState<BaseTableSortState<PatientTableSortField>>(null)
  const [page, setPage] = useState(INITIAL_PAGE)
  const [pageSize, setPageSize] = useState(INITIAL_PAGE_SIZE)

  const visiblePatients = useMemo(
    () => getVisiblePatients(MOCK_PATIENTS, searchTerm, activeFilterValues, sortState),
    [activeFilterValues, searchTerm, sortState],
  )

  const paginatedPatients = useMemo(
    () => getPaginatedPatients(visiblePatients, page, pageSize),
    [page, pageSize, visiblePatients],
  )

  const handleFilterToggle = (filterValue: PatientTableFilter) => {
    setPage(INITIAL_PAGE)
    setActiveFilterValues((currentFilterValues) =>
      currentFilterValues.includes(filterValue)
        ? currentFilterValues.filter((currentFilterValue) => currentFilterValue !== filterValue)
        : [...currentFilterValues, filterValue],
    )
  }

  const handleSearchChange = (nextSearchTerm: string) => {
    setPage(INITIAL_PAGE)
    setSearchTerm(nextSearchTerm)
  }

  const handlePageSizeChange = (nextPageSize: number) => {
    setPage(INITIAL_PAGE)
    setPageSize(nextPageSize)
  }

  return (
    <BaseTable
      activeFilterValues={activeFilterValues}
      actions={
        <Button Icon={Plus} size="sm">
          Crear paciente
        </Button>
      }
      columns={PATIENT_TABLE_COLUMNS}
      emptyMessage="No hay pacientes para mostrar"
      filterOptions={PATIENT_TABLE_FILTERS}
      onFilterToggle={handleFilterToggle}
      onSearchChange={handleSearchChange}
      onSortChange={setSortState}
      pagination={{
        onPageChange: setPage,
        onPageSizeChange: handlePageSizeChange,
        page,
        pageSize,
        totalRows: visiblePatients.length,
      }}
      rowKey={(patient) => patient.id}
      rows={paginatedPatients}
      searchPlaceholder="Buscar por nombre, Instagram o teléfono..."
      sortState={sortState}
    />
  )
}

export default PatientTable
