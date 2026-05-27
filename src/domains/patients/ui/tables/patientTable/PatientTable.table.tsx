import { useMemo, useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { Plus } from 'lucide-react'
import { useAppSelector } from '@app/store/hooks'
import { selectSessionCenter } from '@domains/identity-access'
import { usePatientsQuery } from '@domains/patients/queries/patients.query'
import { Button } from '@shared/ui/atoms'
import { BaseTable } from '@shared/ui/organisms'
import type { BaseTableSortState } from '@shared/ui/organisms'
import { PATIENT_TABLE_COLUMNS } from './patientTable.constants'
import type { PatientTableSortField } from './patientTable.types'

const INITIAL_PAGE = 1
const INITIAL_PAGE_SIZE = 15

function PatientTable() {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0()
  const center = useAppSelector(selectSessionCenter)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortState, setSortState] = useState<BaseTableSortState<PatientTableSortField>>(null)
  const [page, setPage] = useState(INITIAL_PAGE)
  const [pageSize, setPageSize] = useState(INITIAL_PAGE_SIZE)

  const patientListParams = useMemo(
    () => ({
      limit: pageSize,
      offset: (page - 1) * pageSize,
      searchTerm: searchTerm || undefined,
      sortDirection: sortState?.direction,
      sortField: sortState?.field,
    }),
    [page, pageSize, searchTerm, sortState],
  )

  const patientsQuery = usePatientsQuery({
    centerId: isAuthenticated ? center?.id : undefined,
    getAccessToken: getAccessTokenSilently,
    params: patientListParams,
  })

  const patients = patientsQuery.data?.patients ?? []
  const totalPatients = patientsQuery.data?.total ?? 0

  const handleSearchChange = (nextSearchTerm: string) => {
    setPage(INITIAL_PAGE)
    setSearchTerm(nextSearchTerm)
  }

  const handlePageSizeChange = (nextPageSize: number) => {
    setPage(INITIAL_PAGE)
    setPageSize(nextPageSize)
  }

  const handleSortChange = (nextSortState: BaseTableSortState<PatientTableSortField>) => {
    setPage(INITIAL_PAGE)
    setSortState(nextSortState)
  }

  return (
    <BaseTable
      actions={
        <Button Icon={Plus} size="sm">
          Crear paciente
        </Button>
      }
      columns={PATIENT_TABLE_COLUMNS}
      emptyMessage={patientsQuery.isError ? 'No se pudieron cargar los pacientes' : 'No hay pacientes para mostrar'}
      loading={patientsQuery.isLoading}
      onSearchChange={handleSearchChange}
      onSortChange={handleSortChange}
      pagination={{
        onPageChange: setPage,
        onPageSizeChange: handlePageSizeChange,
        page,
        pageSize,
        totalRows: totalPatients,
      }}
      rowKey={(patient) => patient.id}
      rows={patients}
      searchPlaceholder="Buscar por nombre"
      sortState={sortState}
    />
  )
}

export default PatientTable
