import type { BaseTableSortState } from './baseTable.types'

export function getAriaSort<TSortField extends string>(
  sortField: TSortField | undefined,
  sortState: BaseTableSortState<TSortField>,
) {
  if (!sortField || sortState?.field !== sortField) return undefined

  return sortState.direction === 'asc' ? 'ascending' : 'descending'
}
