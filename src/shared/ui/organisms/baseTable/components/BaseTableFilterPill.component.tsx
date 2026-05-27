import { X } from 'lucide-react'
import { themeClass } from '@shared/styles/theme.styles'
import { composeClassName } from '@shared/ui/utils/className.utils'
import type { BaseTableFilterOption } from '../baseTable.types'

interface BaseTableFilterPillProps<TFilter extends string> {
  filterOption: BaseTableFilterOption<TFilter>
  onRemove: () => void
}

function BaseTableFilterPill<TFilter extends string>({ filterOption, onRemove }: Readonly<BaseTableFilterPillProps<TFilter>>) {
  return (
    <button
      className={composeClassName(
        'inline-flex min-h-9 cursor-pointer items-center gap-2 rounded-full border border-ui-border bg-ui-surface px-3 text-sm font-semibold text-ui-text-muted shadow-sm transition-colors hover:border-ui-border-strong hover:text-ui-text',
        themeClass.focus,
      )}
      onClick={onRemove}
      type="button"
    >
      {filterOption.Icon ? <filterOption.Icon aria-hidden="true" size={16} /> : null}
      {filterOption.label}
      <X aria-hidden="true" className="opacity-60" size={13} />
    </button>
  )
}

export default BaseTableFilterPill
