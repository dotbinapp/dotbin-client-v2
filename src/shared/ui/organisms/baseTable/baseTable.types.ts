import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'

export type BaseTableSortDirection = 'asc' | 'desc'

export type BaseTableSortState<TSortField extends string> = {
  direction: BaseTableSortDirection
  field: TSortField
} | null

export interface BaseTableColumn<TRow, TSortField extends string = string> {
  align?: 'left' | 'center' | 'right'
  HeaderIcon?: LucideIcon
  id: string
  label: string
  renderCell: (row: TRow) => ReactNode
  sortField?: TSortField
  widthClassName?: string
}

export interface BaseTableFilterOption<TFilter extends string = string> {
  Icon?: LucideIcon
  apiField?: string
  label: string
  value: TFilter
}

export interface BaseTablePaginationConfig {
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: number) => void
  page: number
  pageSize: number
  pageSizeOptions?: number[]
  totalRows: number
}

export interface BaseTableProps<TRow, TSortField extends string = string, TFilter extends string = string> {
  activeFilterValues?: TFilter[]
  actions?: ReactNode
  columns: BaseTableColumn<TRow, TSortField>[]
  emptyMessage?: string
  filterOptions?: BaseTableFilterOption<TFilter>[]
  getRowClassName?: (row: TRow, rowIndex: number) => string
  loading?: boolean
  onFilterToggle?: (filterValue: TFilter) => void
  onRowClick?: (row: TRow) => void
  onSearchChange?: (searchTerm: string) => void
  onSortChange?: (sortState: BaseTableSortState<TSortField>) => void
  pagination?: BaseTablePaginationConfig
  rowKey: (row: TRow) => string
  rows: TRow[]
  searchPlaceholder?: string
  initialSearchValue?: string
  skeletonRows?: number
  sortState?: BaseTableSortState<TSortField>
}
