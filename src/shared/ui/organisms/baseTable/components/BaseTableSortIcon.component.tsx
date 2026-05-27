import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react'
import type { BaseTableSortDirection } from '../baseTable.types'

interface BaseTableSortIconProps {
  direction?: BaseTableSortDirection
  isActive: boolean
}

function BaseTableSortIcon({ direction, isActive }: Readonly<BaseTableSortIconProps>) {
  if (!isActive) return <ArrowUpDown aria-hidden="true" className="opacity-35" size={14} />

  if (direction === 'asc') return <ArrowUp aria-hidden="true" className="text-ui-primary-text" size={14} />

  return <ArrowDown aria-hidden="true" className="text-ui-primary-text" size={14} />
}

export default BaseTableSortIcon
