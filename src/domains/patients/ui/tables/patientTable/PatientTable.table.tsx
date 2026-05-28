import { useCallback, useMemo, useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { Plus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAppSelector } from '@app/store/hooks'
import { APP_PERMISSION_CODES, selectSessionCenter, usePermissions } from '@domains/identity-access'
import { usePatientSaveFlow } from '@domains/patients/application'
import type { PatientSummary } from '@domains/patients/model'
import { usePatientsQuery } from '@domains/patients/queries/patients.query'
import { PATIENTS_ROUTE_PATH } from '@domains/patients/routes'
import { PatientCreateDialog } from '@domains/patients/ui/dialogs'
import { Button } from '@shared/ui/atoms'
import { BaseTable } from '@shared/ui/organisms'
import type { BaseTableSortState } from '@shared/ui/organisms'
import { getPatientTableColumns } from './patientTable.constants'
import type { PatientTableSortField } from './patientTable.types'

const INITIAL_PAGE = 1
const INITIAL_PAGE_SIZE = 15

function PatientTable() {
  const navigate = useNavigate()
  const { getAccessTokenSilently, isAuthenticated } = useAuth0()
  const center = useAppSelector(selectSessionCenter)
  const { hasPermission } = usePermissions()
  const canManagePatients = hasPermission(APP_PERMISSION_CODES.PATIENTS_ADMIN)
  const canViewPatient = hasPermission(APP_PERMISSION_CODES.PATIENTS_READ)
  
  const [searchTerm, setSearchTerm] = useState('')
  const [sortState, setSortState] = useState<BaseTableSortState<PatientTableSortField>>(null)
  const [page, setPage] = useState(INITIAL_PAGE)
  const [pageSize, setPageSize] = useState(INITIAL_PAGE_SIZE)
  const [isPatientDialogOpen, setIsPatientDialogOpen] = useState(false)
  const [activePatient, setActivePatient] = useState<PatientSummary | null>(null)

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

  const firstPagePatientListParams = useMemo(
    () => ({
      ...patientListParams,
      offset: 0,
    }),
    [patientListParams],
  )

  const { createPatient, isCreatingPatient, isUpdatingPatient, updatePatient } = usePatientSaveFlow({
    centerId: center?.id,
    getAccessToken: getAccessTokenSilently,
    listParams: firstPagePatientListParams,
    onCreated: () => setPage(INITIAL_PAGE),
  })

  const patientsQuery = usePatientsQuery({
    centerId: isAuthenticated ? center?.id : undefined,
    getAccessToken: getAccessTokenSilently,
    params: patientListParams,
  })

  const patients = patientsQuery.data?.patients ?? []
  const totalPatients = patientsQuery.data?.total ?? 0

  const openCreatePatientDialog = () => {
    setActivePatient(null)
    setIsPatientDialogOpen(true)
  }

  const openEditPatientDialog = useCallback((patient: PatientSummary) => {
    setActivePatient(patient)
    setIsPatientDialogOpen(true)
  }, [])

  const openPatientDetail = useCallback((patient: PatientSummary) => {
    navigate(`${PATIENTS_ROUTE_PATH}/${patient.id}`)
  }, [navigate])

  const closePatientDialog = () => {
    setActivePatient(null)
    setIsPatientDialogOpen(false)
  }

  const patientTableColumns = useMemo(
    () => getPatientTableColumns({ canEditPatient: canManagePatients, canViewPatient, onEditPatient: openEditPatientDialog, onViewPatient: openPatientDetail }),
    [canManagePatients, canViewPatient, openEditPatientDialog, openPatientDetail],
  )

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
    <>
      <BaseTable
        actions={canManagePatients ? (
          <Button Icon={Plus} onClick={openCreatePatientDialog} size="sm">
            Crear paciente
          </Button>
        ) : undefined}
        columns={patientTableColumns}
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

      <PatientCreateDialog
        activePatient={activePatient}
        isCreating={isCreatingPatient}
        isOpen={isPatientDialogOpen}
        isUpdating={isUpdatingPatient}
        onClose={closePatientDialog}
        onCreatePatient={createPatient}
        onUpdatePatient={updatePatient}
      />
    </>
  )
}

export default PatientTable
