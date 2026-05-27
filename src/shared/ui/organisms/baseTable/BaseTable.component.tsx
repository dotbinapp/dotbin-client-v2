import { useEffect, useState } from 'react'
import { Search } from 'lucide-react'
import { useDebounce } from '@shared/hooks'
import { themeClass } from '@shared/styles/theme.styles'
import { Input, Text } from '@shared/ui/atoms'
import { composeClassName } from '@shared/ui/utils/className.utils'
import { CELL_ALIGN_CLASS, DEFAULT_SKELETON_ROWS } from './baseTable.constants'
import type { BaseTableProps } from './baseTable.types'
import { getAriaSort } from './baseTable.utils'
import BaseTableFilterBar from './components/BaseTableFilterBar.component'
import BaseTableHeaderLabel from './components/BaseTableHeaderLabel.component'
import BaseTablePagination from './components/BaseTablePagination.component'
import BaseTableSkeletonRows from './components/BaseTableSkeletonRows.component'
import BaseTableSortIcon from './components/BaseTableSortIcon.component'

function BaseTable<TRow, TSortField extends string = string, TFilter extends string = string>({
  activeFilterValues = [],
  actions,
  columns,
  emptyMessage = 'No se encontraron resultados',
  filterOptions = [],
  getRowClassName,
  loading = false,
  onFilterToggle,
  onRowClick,
  onSearchChange,
  onSortChange,
  pagination,
  rowKey,
  rows,
  searchPlaceholder = 'Buscar...',
  initialSearchValue = '',
  skeletonRows = DEFAULT_SKELETON_ROWS,
  sortState = null,
}: Readonly<BaseTableProps<TRow, TSortField, TFilter>>) {
  const [searchTerm, setSearchTerm] = useState(initialSearchValue)
  const debouncedSearchTerm = useDebounce(searchTerm)

  useEffect(() => {
    onSearchChange?.(debouncedSearchTerm)
  }, [debouncedSearchTerm, onSearchChange])

  const handleSort = (sortField: TSortField) => {
    if (!onSortChange) return

    if (sortState?.field !== sortField) {
      onSortChange({ field: sortField, direction: 'asc' })
      return
    }

    if (sortState.direction === 'asc') {
      onSortChange({ field: sortField, direction: 'desc' })
      return
    }

    onSortChange(null)
  }

  return (
    <section className={composeClassName('flex h-full min-h-0 flex-col gap-4', themeClass.text.default)}>
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 flex-1 flex-col gap-3 md:flex-row md:items-center">
          {onSearchChange ? (
            <div className="w-full md:max-w-md">
              <Input
                Icon={Search}
                aria-label="Buscar registros"
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder={searchPlaceholder}
                size="compact"
                type="search"
                value={searchTerm}
              />
            </div>
          ) : null}

          <BaseTableFilterBar
            activeFilterValues={activeFilterValues}
            filterOptions={filterOptions}
            onFilterToggle={onFilterToggle}
          />
        </div>

        {actions ? <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div> : null}
      </div>

      <div className="min-h-0 flex-1 overflow-auto rounded-xl border border-ui-border bg-ui-surface shadow-[var(--theme-shadow-surface)]">
        <table className="w-full min-w-max border-collapse text-left">
          <thead className="sticky top-0 z-10 bg-ui-surface-elevated/95 backdrop-blur-md">
            <tr className="border-b border-ui-border">
              {columns.map((column) => (
                <th
                  aria-sort={getAriaSort(column.sortField, sortState)}
                  className={composeClassName(
                    'border-r border-ui-border px-3 py-2.5 text-sm font-bold last:border-r-0',
                    themeClass.text.subtle,
                    CELL_ALIGN_CLASS[column.align ?? 'left'],
                    column.widthClassName,
                  )}
                  key={column.id}
                  scope="col"
                >
                  {column.sortField ? (
                    <button
                      className={composeClassName(
                        'inline-flex cursor-pointer items-center gap-2 rounded-lg transition-colors hover:text-ui-primary-text',
                        themeClass.focus,
                      )}
                      onClick={() => handleSort(column.sortField as TSortField)}
                      type="button"
                    >
                      <BaseTableHeaderLabel HeaderIcon={column.HeaderIcon} label={column.label} />
                      <BaseTableSortIcon isActive={sortState?.field === column.sortField} direction={sortState?.direction} />
                    </button>
                  ) : (
                    <BaseTableHeaderLabel HeaderIcon={column.HeaderIcon} label={column.label} />
                  )}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {loading ? <BaseTableSkeletonRows columnCount={columns.length} rowCount={skeletonRows} /> : null}

            {!loading && rows.map((row, rowIndex) => (
              <tr
                className={composeClassName(
                  'border-b border-ui-border transition-colors last:border-b-0 hover:bg-ui-surface-hover',
                  onRowClick && 'cursor-pointer',
                  getRowClassName?.(row, rowIndex),
                )}
                key={rowKey(row)}
                onClick={() => onRowClick?.(row)}
              >
                {columns.map((column) => (
                  <td
                    className={composeClassName(
                      'border-r border-ui-border px-3 py-2 text-sm font-medium last:border-r-0',
                      CELL_ALIGN_CLASS[column.align ?? 'left'],
                      themeClass.text.default,
                    )}
                    key={column.id}
                  >
                    {column.renderCell(row)}
                  </td>
                ))}
              </tr>
            ))}

            {!loading && rows.length === 0 ? (
              <tr>
                <td className="px-4 py-10 text-center" colSpan={columns.length}>
                  <Text tone="muted">{emptyMessage}</Text>
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      {pagination ? <BaseTablePagination pagination={pagination} /> : null}
    </section>
  )
}

export default BaseTable
