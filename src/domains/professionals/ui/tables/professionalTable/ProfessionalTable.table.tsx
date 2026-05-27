import { useMemo, useState } from 'react'
import { Plus } from 'lucide-react'
import type { ProfessionalSummary } from '@domains/professionals/model'
import { Button } from '@shared/ui/atoms'
import { BaseTable } from '@shared/ui/organisms'
import type { BaseTableSortState } from '@shared/ui/organisms'
import { getProfessionalTableColumns } from './professionalTable.constants'
import type { ProfessionalTableSortField } from './professionalTable.types'

const INITIAL_PAGE = 1
const INITIAL_PAGE_SIZE = 15
const EMPTY_PROFESSIONALS: ProfessionalSummary[] = []

interface ProfessionalTableProps {
  professionals?: ProfessionalSummary[]
  loading?: boolean
  onCreateProfessional?: () => void
  onEditProfessional?: (professional: ProfessionalSummary) => void
}

function getProfessionalSortValue(professional: ProfessionalSummary, sortField: ProfessionalTableSortField) {
  if (sortField === 'specialty') return professional.specialty ?? ''

  return professional.fullName
}

function ProfessionalTable({ professionals = EMPTY_PROFESSIONALS, loading = false, onCreateProfessional, onEditProfessional }: Readonly<ProfessionalTableProps>) {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortState, setSortState] = useState<BaseTableSortState<ProfessionalTableSortField>>(null)
  const [page, setPage] = useState(INITIAL_PAGE)
  const [pageSize, setPageSize] = useState(INITIAL_PAGE_SIZE)

  const professionalTableColumns = useMemo(() => getProfessionalTableColumns({ onEditProfessional }), [onEditProfessional])

  const filteredProfessionals = useMemo(() => {
    const normalizedSearchTerm = searchTerm.trim().toLocaleLowerCase()

    if (!normalizedSearchTerm) return professionals

    return professionals.filter((professional) => professional.fullName.toLocaleLowerCase().includes(normalizedSearchTerm))
  }, [professionals, searchTerm])

  const sortedProfessionals = useMemo(() => {
    if (!sortState) return filteredProfessionals

    return filteredProfessionals.toSorted((currentProfessional, nextProfessional) => {
      const currentValue = getProfessionalSortValue(currentProfessional, sortState.field)
      const nextValue = getProfessionalSortValue(nextProfessional, sortState.field)
      const sortResult = currentValue.localeCompare(nextValue, 'es')

      return sortState.direction === 'asc' ? sortResult : -sortResult
    })
  }, [filteredProfessionals, sortState])

  const totalProfessionals = sortedProfessionals.length
  const totalPages = Math.max(1, Math.ceil(totalProfessionals / pageSize))
  const currentPage = Math.min(page, totalPages)

  const paginatedProfessionals = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize

    return sortedProfessionals.slice(startIndex, startIndex + pageSize)
  }, [currentPage, pageSize, sortedProfessionals])

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

  return (
    <BaseTable
      actions={
        <Button disabled={!onCreateProfessional} Icon={Plus} onClick={onCreateProfessional} size="sm">
          Crear profesional
        </Button>
      }
      columns={professionalTableColumns}
      emptyMessage="No hay profesionales para mostrar"
      loading={loading}
      onSearchChange={handleSearchChange}
      onSortChange={handleSortChange}
      pagination={{
        onPageChange: setPage,
        onPageSizeChange: handlePageSizeChange,
        page: currentPage,
        pageSize,
        totalRows: totalProfessionals,
      }}
      rowKey={(professional) => professional.id}
      rows={paginatedProfessionals}
      searchPlaceholder="Buscar por nombre"
      sortState={sortState}
    />
  )
}

export default ProfessionalTable
