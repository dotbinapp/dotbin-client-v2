import type { ReactNode } from 'react'
import { useEffect, useRef, useState } from 'react'
import { ArrowDown, ArrowUp, ArrowUpDown, Search } from 'lucide-react'
import { useDebounce } from '@shared/hooks'
import { themeClass } from '@shared/styles/theme.styles'
import { Input, Skeleton, Text } from '@shared/ui/atoms'
import { composeClassName } from '@shared/ui/utils/className.utils'

type BaseTableSortDirection = 'asc' | 'desc'

export type BaseTableSortState<TSortField extends string> = {
  direction: BaseTableSortDirection
  field: TSortField
} | null

export interface BaseTableColumn<TRow, TSortField extends string = string> {
  align?: 'left' | 'center' | 'right'
  header: ReactNode
  id: string
  renderCell: (row: TRow) => ReactNode
  sortField?: TSortField
  widthClassName?: string
}

interface BaseTableProps<TRow, TSortField extends string = string> {
  actions?: ReactNode
  columns: BaseTableColumn<TRow, TSortField>[]
  emptyMessage?: string
  filters?: ReactNode
  getRowClassName?: (row: TRow, rowIndex: number) => string
  hasMore?: boolean
  loading?: boolean
  loadingMore?: boolean
  onLoadMore?: () => void
  onRowClick?: (row: TRow) => void
  onSearchChange?: (searchTerm: string) => void
  onSortChange?: (sortState: BaseTableSortState<TSortField>) => void
  rowKey: (row: TRow) => string
  rows: TRow[]
  searchDelayMs?: number
  searchPlaceholder?: string
  initialSearchValue?: string
  skeletonRows?: number
  sortState?: BaseTableSortState<TSortField>
}

const DEFAULT_SEARCH_DELAY_MS = 350
const DEFAULT_SKELETON_ROWS = 8

const CELL_ALIGN_CLASS = {
  center: 'text-center',
  left: 'text-left',
  right: 'text-right',
} as const

function BaseTable<TRow, TSortField extends string = string>({
  actions,
  columns,
  emptyMessage = 'No se encontraron resultados',
  filters,
  getRowClassName,
  hasMore = false,
  loading = false,
  loadingMore = false,
  onLoadMore,
  onRowClick,
  onSearchChange,
  onSortChange,
  rowKey,
  rows,
  searchDelayMs = DEFAULT_SEARCH_DELAY_MS,
  searchPlaceholder = 'Buscar...',
  initialSearchValue = '',
  skeletonRows = DEFAULT_SKELETON_ROWS,
  sortState = null,
}: Readonly<BaseTableProps<TRow, TSortField>>) {
  const [searchTerm, setSearchTerm] = useState(initialSearchValue)
  const debouncedSearchTerm = useDebounce(searchTerm, searchDelayMs)
  const sentinelRef = useRef<HTMLTableRowElement>(null)
  const canLoadMore = hasMore && !loading && !loadingMore && Boolean(onLoadMore)

  useEffect(() => {
    onSearchChange?.(debouncedSearchTerm)
  }, [debouncedSearchTerm, onSearchChange])

  useEffect(() => {
    const sentinel = sentinelRef.current

    if (!sentinel || !canLoadMore || !onLoadMore) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) onLoadMore()
      },
      { rootMargin: '160px 0px', threshold: 0.1 },
    )

    observer.observe(sentinel)

    return () => observer.disconnect()
  }, [canLoadMore, onLoadMore])

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

          {filters ? <div className="flex flex-wrap items-center gap-2">{filters}</div> : null}
        </div>

        {actions ? <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div> : null}
      </div>

      <div className="min-h-0 flex-1 overflow-auto rounded-[1.5rem] border border-ui-border bg-ui-surface shadow-[var(--theme-shadow-surface)]">
        <table className="w-full min-w-max border-collapse text-left">
          <thead className="sticky top-0 z-10 border-b border-ui-border bg-ui-surface-elevated/95 backdrop-blur-md">
            <tr>
              {columns.map((column) => (
                <th
                  aria-sort={getAriaSort(column.sortField, sortState)}
                  className={composeClassName(
                    'px-4 py-3 text-xs font-black uppercase tracking-[0.08em]',
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
                      {column.header}
                      <SortIcon isActive={sortState?.field === column.sortField} direction={sortState?.direction} />
                    </button>
                  ) : (
                    column.header
                  )}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-ui-border">
            {loading ? <SkeletonRows columnCount={columns.length} rowCount={skeletonRows} /> : null}

            {!loading && rows.map((row, rowIndex) => (
              <tr
                className={composeClassName(
                  'transition-colors odd:bg-ui-surface-muted/40 hover:bg-ui-surface-hover',
                  onRowClick && 'cursor-pointer',
                  getRowClassName?.(row, rowIndex),
                )}
                key={rowKey(row)}
                onClick={() => onRowClick?.(row)}
              >
                {columns.map((column) => (
                  <td
                    className={composeClassName(
                      'px-4 py-3 text-sm font-medium',
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

            {!loading && (hasMore || loadingMore) ? (
              <tr ref={sentinelRef}>
                <td className="px-4 py-5 text-center" colSpan={columns.length}>
                  {loadingMore ? <Text tone="muted">Cargando más...</Text> : null}
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </section>
  )
}

function SortIcon({ direction, isActive }: Readonly<{ direction?: BaseTableSortDirection; isActive: boolean }>) {
  if (!isActive) return <ArrowUpDown aria-hidden="true" className="opacity-35" size={14} />

  if (direction === 'asc') return <ArrowUp aria-hidden="true" className="text-ui-primary-text" size={14} />

  return <ArrowDown aria-hidden="true" className="text-ui-primary-text" size={14} />
}

function SkeletonRows({ columnCount, rowCount }: Readonly<{ columnCount: number; rowCount: number }>) {
  return Array.from({ length: rowCount }, (_, rowIndex) => (
    <tr key={`table-skeleton-${rowIndex}`}>
      {Array.from({ length: columnCount }, (_, columnIndex) => (
        <td className="px-4 py-3" key={`table-skeleton-${rowIndex}-${columnIndex}`}>
          <Skeleton size="md" />
        </td>
      ))}
    </tr>
  ))
}

function getAriaSort<TSortField extends string>(
  sortField: TSortField | undefined,
  sortState: BaseTableSortState<TSortField>,
) {
  if (!sortField || sortState?.field !== sortField) return undefined

  return sortState.direction === 'asc' ? 'ascending' : 'descending'
}

export default BaseTable
