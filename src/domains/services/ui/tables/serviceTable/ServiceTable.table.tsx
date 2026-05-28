import { useCallback, useMemo, useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { FolderPlus, Plus, Sparkles } from 'lucide-react'
import { useAppSelector } from '@app/store/hooks'
import { selectSessionCenter } from '@domains/identity-access'
import { useServiceSaveFlow } from '@domains/services/application'
import type { ServiceListSortField, ServiceSummary } from '@domains/services/model'
import { useServicesQuery } from '@domains/services/queries/services.query'
import { ServiceCreateDialog } from '@domains/services/ui/dialogs'
import { MenuButton } from '@shared/ui/molecules'
import { BaseTable } from '@shared/ui/organisms'
import type { BaseTableSortState } from '@shared/ui/organisms'
import { getServiceTableColumns } from './serviceTable.constants'

const INITIAL_PAGE = 1
const INITIAL_PAGE_SIZE = 15

function ServiceTable() {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0()
  const center = useAppSelector(selectSessionCenter)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortState, setSortState] = useState<BaseTableSortState<ServiceListSortField>>(null)
  const [page, setPage] = useState(INITIAL_PAGE)
  const [pageSize, setPageSize] = useState(INITIAL_PAGE_SIZE)
  const [isServiceDialogOpen, setIsServiceDialogOpen] = useState(false)
  const [activeService, setActiveService] = useState<ServiceSummary | null>(null)

  const openEditServiceDialog = useCallback((service: ServiceSummary) => {
    setActiveService(service)
    setIsServiceDialogOpen(true)
  }, [])

  const serviceTableColumns = useMemo(
    () => getServiceTableColumns({ onEditService: openEditServiceDialog }),
    [openEditServiceDialog],
  )

  const serviceListParams = useMemo(
    () => ({
      limit: pageSize,
      offset: (page - 1) * pageSize,
      searchTerm: searchTerm || undefined,
      sortDirection: sortState?.direction,
      sortField: sortState?.field,
    }),
    [page, pageSize, searchTerm, sortState],
  )

  const firstPageServiceListParams = useMemo(
    () => ({
      ...serviceListParams,
      offset: 0,
    }),
    [serviceListParams],
  )

  const { createService, isCreatingService, isUpdatingService, updateService } = useServiceSaveFlow({
    centerId: center?.id,
    getAccessToken: getAccessTokenSilently,
    listParams: firstPageServiceListParams,
    onCreated: () => setPage(INITIAL_PAGE),
  })

  const servicesQuery = useServicesQuery({
    centerId: isAuthenticated ? center?.id : undefined,
    getAccessToken: getAccessTokenSilently,
    params: serviceListParams,
  })

  const services = servicesQuery.data?.services ?? []
  const totalServices = servicesQuery.data?.total ?? 0

  const handleSearchChange = useCallback((nextSearchTerm: string) => {
    setPage(INITIAL_PAGE)
    setSearchTerm(nextSearchTerm)
  }, [])

  const handlePageSizeChange = useCallback((nextPageSize: number) => {
    setPage(INITIAL_PAGE)
    setPageSize(nextPageSize)
  }, [])

  const handleSortChange = useCallback((nextSortState: BaseTableSortState<ServiceListSortField>) => {
    setPage(INITIAL_PAGE)
    setSortState(nextSortState)
  }, [])

  const openCreateServiceDialog = () => {
    setActiveService(null)
    setIsServiceDialogOpen(true)
  }

  const closeServiceDialog = () => {
    setActiveService(null)
    setIsServiceDialogOpen(false)
  }

  return (
    <>
      <BaseTable
        actions={(
          <MenuButton
            Icon={Plus}
            options={[
              { Icon: Sparkles, label: 'Nuevo servicio', onSelect: openCreateServiceDialog },
              { Icon: FolderPlus, disabled: true, label: 'Nueva categoría' },
            ]}
            panelPlacement="bottom-end"
            size="md"
            triggerSize="sm"
          >
            Nuevo
          </MenuButton>
        )}
        columns={serviceTableColumns}
        emptyMessage={servicesQuery.isError ? 'No se pudieron cargar los servicios' : 'No hay servicios para mostrar'}
        loading={servicesQuery.isLoading}
        onSearchChange={handleSearchChange}
        onSortChange={handleSortChange}
        pagination={{
          onPageChange: setPage,
          onPageSizeChange: handlePageSizeChange,
          page,
          pageSize,
          totalRows: totalServices,
        }}
        rowKey={(service) => service.id}
        rows={services}
        searchPlaceholder="Buscar por tratamiento"
        sortState={sortState}
      />

      <ServiceCreateDialog
        activeService={activeService}
        isCreating={isCreatingService}
        isOpen={isServiceDialogOpen}
        isUpdating={isUpdatingService}
        onClose={closeServiceDialog}
        onCreateService={createService}
        onUpdateService={updateService}
      />
    </>
  )
}

export default ServiceTable
