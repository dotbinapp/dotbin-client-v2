import type { LucideIcon } from 'lucide-react'

interface BaseTableHeaderLabelProps {
  HeaderIcon?: LucideIcon
  label: string
}

function BaseTableHeaderLabel({ HeaderIcon, label }: Readonly<BaseTableHeaderLabelProps>) {
  return (
    <span className="inline-flex items-center gap-2 whitespace-nowrap">
      {HeaderIcon ? <HeaderIcon aria-hidden="true" size={16} /> : null}
      {label}
    </span>
  )
}

export default BaseTableHeaderLabel
