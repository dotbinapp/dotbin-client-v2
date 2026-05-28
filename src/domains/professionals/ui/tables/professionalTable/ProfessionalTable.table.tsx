import { useCallback, useMemo, useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { Plus, Trash2 } from 'lucide-react'
import { useAppSelector } from '@app/store/hooks'
import { APP_PERMISSION_CODES, selectSessionCenter, usePermissions } from '@domains/identity-access'
import { useProfessionalDeleteFlow, useProfessionalSaveFlow } from '@domains/professionals/application'
import type { ProfessionalSummary } from '@domains/professionals/model'
import { useProfessionalsQuery } from '@domains/professionals/queries/professionals.query'
import { ProfessionalCreateDialog } from '@domains/professionals/ui/dialogs'
import { Button } from '@shared/ui/atoms'
import { ConfirmModal } from '@shared/ui/molecules'
import { BaseTable } from '@shared/ui/organisms'
import type { BaseTableSortState } from '@shared/ui/organisms'
import { getProfessionalTableColumns } from './professionalTable.constants'
import type { ProfessionalTableSortField } from './professionalTable.types'

const INITIAL_PAGE = 1
const INITIAL_PAGE_SIZE = 15

interface ProfessionalTableProps {
  onEditProfessional?: (professional: ProfessionalSummary) => void
}

function ProfessionalTable({ onEditProfessional }: Readonly<ProfessionalTableProps>) {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0()
  const center = useAppSelector(selectSessionCenter)
  const { hasPermission } = usePermissions()
  const canManageProfessionals = hasPermission(APP_PERMISSION_CODES.DOCTORS_ADMIN)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortState, setSortState] = useState<BaseTableSortState<ProfessionalTableSortField>>(null)
  const [page, setPage] = useState(INITIAL_PAGE)
  const [pageSize, setPageSize] = useState(INITIAL_PAGE_SIZE)
  const [isProfessionalDialogOpen, setIsProfessionalDialogOpen] = useState(false)
  const [activeProfessional, setActiveProfessional] = useState<ProfessionalSummary | null>(null)
  const [professionalToDelete, setProfessionalToDelete] = useState<ProfessionalSummary | null>(null)

  const openEditProfessionalDialog = useCallback((professional: ProfessionalSummary) => {
    setActiveProfessional(professional)
    setIsProfessionalDialogOpen(true)
    onEditProfessional?.(professional)
  }, [onEditProfessional])

  const openProfessionalDeleteConfirmation = useCallback((professional: ProfessionalSummary) => {
    setProfessionalToDelete(professional)
  }, [])

  const professionalTableColumns = useMemo(
    () => getProfessionalTableColumns({ canEditProfessional: canManageProfessionals, onDeleteProfessional: openProfessionalDeleteConfirmation, onEditProfessional: openEditProfessionalDialog }),
    [canManageProfessionals, openEditProfessionalDialog, openProfessionalDeleteConfirmation],
  )

  const professionalListParams = useMemo(
    () => ({
      limit: pageSize,
      offset: (page - 1) * pageSize,
      searchTerm: searchTerm || undefined,
      sortDirection: sortState?.direction,
      sortField: sortState?.field,
    }),
    [page, pageSize, searchTerm, sortState],
  )

  const firstPageProfessionalListParams = useMemo(
    () => ({
      ...professionalListParams,
      offset: 0,
    }),
    [professionalListParams],
  )

  const { createProfessional, isCreatingProfessional, isUpdatingProfessional, updateProfessional } = useProfessionalSaveFlow({
    centerId: center?.id,
    getAccessToken: getAccessTokenSilently,
    listParams: firstPageProfessionalListParams,
    onCreated: () => setPage(INITIAL_PAGE),
  })
  const { deleteProfessional, isDeletingProfessional } = useProfessionalDeleteFlow({
    centerId: center?.id,
    getAccessToken: getAccessTokenSilently,
  })

  const professionalsQuery = useProfessionalsQuery({
    centerId: isAuthenticated ? center?.id : undefined,
    getAccessToken: getAccessTokenSilently,
    params: professionalListParams,
  })

  const professionals = professionalsQuery.data?.professionals ?? []
  const totalProfessionals = professionalsQuery.data?.total ?? 0

  const handleSearchChange = (nextSearchTerm: string) => {
    setPage(INITIAL_PAGE)
    setSearchTerm(nextSearchTerm)
  }

  const handlePageSizeChange = (nextPageSize: number) => {
    setPage(INITIAL_PAGE)
    setPageSize(nextPageSize)
  }

  const handleSortChange = (nextSortState: BaseTableSortState<ProfessionalTableSortField>) => {
    setPage(INITIAL_PAGE)
    setSortState(nextSortState)
  }

  const openCreateProfessionalDialog = () => {
    setActiveProfessional(null)
    setIsProfessionalDialogOpen(true)
  }

  const closeProfessionalDialog = () => {
    setActiveProfessional(null)
    setIsProfessionalDialogOpen(false)
  }

  const closeProfessionalDeleteConfirmation = () => {
    if (isDeletingProfessional) return

    setProfessionalToDelete(null)
  }

  const confirmProfessionalDelete = async () => {
    if (!professionalToDelete) return

    const wasDeleted = await deleteProfessional(professionalToDelete)

    if (wasDeleted) {
      setProfessionalToDelete(null)
    }
  }

  return (
    <>
      <BaseTable
        actions={canManageProfessionals ? (
          <Button Icon={Plus} onClick={openCreateProfessionalDialog} size="sm">
            Crear profesional
          </Button>
        ) : undefined}
        columns={professionalTableColumns}
        emptyMessage={professionalsQuery.isError ? 'No se pudieron cargar los profesionales' : 'No hay profesionales para mostrar'}
        loading={professionalsQuery.isLoading}
        onSearchChange={handleSearchChange}
        onSortChange={handleSortChange}
        pagination={{
          onPageChange: setPage,
          onPageSizeChange: handlePageSizeChange,
          page,
          pageSize,
          totalRows: totalProfessionals,
        }}
        rowKey={(professional) => professional.id}
        rows={professionals}
        searchPlaceholder="Buscar por nombre"
        sortState={sortState}
      />

      <ProfessionalCreateDialog
        activeProfessional={activeProfessional}
        isCreating={isCreatingProfessional}
        isOpen={isProfessionalDialogOpen}
        isUpdating={isUpdatingProfessional}
        onClose={closeProfessionalDialog}
        onCreateProfessional={createProfessional}
        onUpdateProfessional={updateProfessional}
      />

      {professionalToDelete ? (
        <ConfirmModal
          description={`Se desactivará a ${professionalToDelete.fullName} y dejará de mostrarse en el listado.`}
          Icon={Trash2}
          loading={isDeletingProfessional}
          onClose={closeProfessionalDeleteConfirmation}
          onConfirm={() => void confirmProfessionalDelete()}
          primaryAction="danger"
          title="Eliminar profesional"
        />
      ) : null}
    </>
  )
}

export default ProfessionalTable
