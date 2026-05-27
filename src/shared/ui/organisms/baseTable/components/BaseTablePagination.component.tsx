import type { ReactNode } from 'react'
import { ChevronDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'
import { themeClass } from '@shared/styles/theme.styles'
import { composeClassName } from '@shared/ui/utils/className.utils'
import { DEFAULT_PAGE_SIZE_OPTIONS } from '../baseTable.constants'
import type { BaseTablePaginationConfig } from '../baseTable.types'

interface BaseTablePaginationProps {
  pagination: BaseTablePaginationConfig
}

function BaseTablePagination({ pagination }: Readonly<BaseTablePaginationProps>) {
  const pageSizeOptions = pagination.pageSizeOptions ?? DEFAULT_PAGE_SIZE_OPTIONS
  const totalPages = Math.max(1, Math.ceil(pagination.totalRows / pagination.pageSize))
  const firstRow = pagination.totalRows === 0 ? 0 : (pagination.page - 1) * pagination.pageSize + 1
  const lastRow = Math.min(pagination.page * pagination.pageSize, pagination.totalRows)
  const canGoPrevious = pagination.page > 1
  const canGoNext = pagination.page < totalPages

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-ui-border bg-ui-surface px-3 py-2 text-sm font-medium text-ui-text-muted md:flex-row md:items-center md:justify-between">
      <div className="flex flex-wrap items-center gap-3">
        <span>Rows per page</span>
        <label className="sr-only" htmlFor="base-table-page-size">
          Filas por página
        </label>
        <div className="relative">
          <select
            className="h-9 appearance-none rounded-xl border border-ui-border bg-ui-surface px-3 pr-8 font-semibold text-ui-text outline-none transition-colors focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
            id="base-table-page-size"
            onChange={(event) => pagination.onPageSizeChange(Number(event.target.value))}
            value={pagination.pageSize}
          >
            {pageSizeOptions.map((pageSizeOption) => (
              <option key={pageSizeOption} value={pageSizeOption}>
                {pageSizeOption}
              </option>
            ))}
          </select>
          <ChevronDown aria-hidden="true" className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2" size={15} />
        </div>
        <span>
          {firstRow}-{lastRow} of {pagination.totalRows} rows
        </span>
      </div>

      <div className="flex items-center gap-2">
        <PaginationButton disabled={!canGoPrevious} label="Primera página" onClick={() => pagination.onPageChange(1)}>
          <ChevronsLeft aria-hidden="true" size={16} />
        </PaginationButton>
        <PaginationButton disabled={!canGoPrevious} label="Página anterior" onClick={() => pagination.onPageChange(pagination.page - 1)}>
          <ChevronLeft aria-hidden="true" size={16} />
        </PaginationButton>
        <span className="px-2 font-semibold text-ui-text">
          {pagination.page} / {totalPages}
        </span>
        <PaginationButton disabled={!canGoNext} label="Página siguiente" onClick={() => pagination.onPageChange(pagination.page + 1)}>
          <ChevronRight aria-hidden="true" size={16} />
        </PaginationButton>
        <PaginationButton disabled={!canGoNext} label="Última página" onClick={() => pagination.onPageChange(totalPages)}>
          <ChevronsRight aria-hidden="true" size={16} />
        </PaginationButton>
      </div>
    </div>
  )
}

function PaginationButton({ children, disabled, label, onClick }: Readonly<{ children: ReactNode; disabled: boolean; label: string; onClick: () => void }>) {
  return (
    <button
      aria-label={label}
      className={composeClassName(
        'flex size-9 cursor-pointer items-center justify-center rounded-xl border border-ui-border bg-ui-surface text-ui-text-muted transition-colors hover:bg-ui-surface-hover hover:text-ui-text disabled:cursor-not-allowed disabled:opacity-45',
        themeClass.focus,
      )}
      disabled={disabled}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  )
}

export default BaseTablePagination
