import type { BaseTableStatusFilterOption } from './baseTable.types'

export const DEFAULT_SKELETON_ROWS = 8

export const DEFAULT_PAGE_SIZE_OPTIONS = [15, 30, 50]

export const BASE_TABLE_STATUS_FILTER_OPTIONS: BaseTableStatusFilterOption[] = [
  { label: 'Activos', value: 'active' },
  { label: 'Inactivos', value: 'inactive' },
  { label: 'Todos', value: 'all' },
]

export const CELL_ALIGN_CLASS = {
  center: 'text-center',
  left: 'text-left',
  right: 'text-right',
} as const
