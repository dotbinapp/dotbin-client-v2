import { useMemo, useState } from 'react'
import { FolderPlus, Plus, Sparkles } from 'lucide-react'
import { ServiceCreateDialog } from '@domains/services/ui/dialogs'
import { MenuButton } from '@shared/ui/molecules'
import { BaseTable } from '@shared/ui/organisms'
import { SERVICE_TABLE_COLUMNS, SERVICE_TABLE_PREVIEW_ROWS } from './serviceTable.constants'

const INITIAL_PAGE = 1
const INITIAL_PAGE_SIZE = 2

function serviceMatchesSearch(searchTerm: string) {
  const normalizedSearchTerm = searchTerm.trim().toLowerCase()

  return (service: (typeof SERVICE_TABLE_PREVIEW_ROWS)[number]) => {
    if (!normalizedSearchTerm) return true

    return [service.name, service.description, service.category]
      .filter(Boolean)
      .some((searchableValue) => searchableValue?.toLowerCase().includes(normalizedSearchTerm))
  }
}

function ServiceTable() {
  const [searchTerm, setSearchTerm] = useState('')
  const [page, setPage] = useState(INITIAL_PAGE)
  const [pageSize, setPageSize] = useState(INITIAL_PAGE_SIZE)
  const [isServiceCreateDialogOpen, setIsServiceCreateDialogOpen] = useState(false)

  const filteredServices = useMemo(
    () => SERVICE_TABLE_PREVIEW_ROWS.filter(serviceMatchesSearch(searchTerm)),
    [searchTerm],
  )

  const paginatedServices = useMemo(
    () => filteredServices.slice((page - 1) * pageSize, page * pageSize),
    [filteredServices, page, pageSize],
  )

  const handleSearchChange = (nextSearchTerm: string) => {
    setPage(INITIAL_PAGE)
    setSearchTerm(nextSearchTerm)
  }

  const handlePageSizeChange = (nextPageSize: number) => {
    setPage(INITIAL_PAGE)
    setPageSize(nextPageSize)
  }

  return (
    <>
      <BaseTable
        actions={(
          <MenuButton
            Icon={Plus}
            options={[
              { Icon: Sparkles, label: 'Nuevo servicio', onSelect: () => setIsServiceCreateDialogOpen(true) },
              { Icon: FolderPlus, disabled: true, label: 'Nueva categoría' },
            ]}
            panelPlacement="bottom-end"
            size="md"
            triggerSize="sm"
          >
            Nuevo
          </MenuButton>
        )}
        columns={SERVICE_TABLE_COLUMNS}
        emptyMessage="No hay servicios para mostrar"
        onSearchChange={handleSearchChange}
        pagination={{
          onPageChange: setPage,
          onPageSizeChange: handlePageSizeChange,
          page,
          pageSize,
          pageSizeOptions: [2, 4, 8],
          totalRows: filteredServices.length,
        }}
        rowKey={(service) => service.id}
        rows={paginatedServices}
        searchPlaceholder="Buscar por servicio"
      />

      <ServiceCreateDialog isOpen={isServiceCreateDialogOpen} onClose={() => setIsServiceCreateDialogOpen(false)} />
    </>
  )
}

export default ServiceTable
