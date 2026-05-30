import type { ReactNode } from 'react'
import { X } from 'lucide-react'
import { themeClass } from '@shared/styles/theme.styles'
import { Pill } from '@shared/ui/atoms'
import { composeClassName } from '@shared/ui/utils/className.utils'

interface SelectedPillListProps<TItem> {
  ariaLabel: string
  disabled?: boolean
  getItemKey: (item: TItem) => string
  getItemLabel: (item: TItem) => ReactNode
  getRemoveAriaLabel?: (item: TItem) => string
  items: TItem[]
  onRemove: (item: TItem) => void
}

const SELECTED_PILL_CLASS = 'border-primary-200 bg-primary-100 py-1.5 pr-1.5 text-primary-800 shadow-[var(--theme-shadow-surface)] dark:border-primary-400/30 dark:bg-primary-500/20 dark:text-primary-100'

function SelectedPillList<TItem>({
  ariaLabel,
  disabled = false,
  getItemKey,
  getItemLabel,
  getRemoveAriaLabel,
  items,
  onRemove,
}: Readonly<SelectedPillListProps<TItem>>) {
  if (items.length === 0) return null

  return (
    <ul aria-label={ariaLabel} className="flex flex-wrap gap-2">
      {items.map((item) => {
        const itemLabel = getItemLabel(item)

        return (
          <li key={getItemKey(item)}>
            <Pill as="span" inactiveClassName={SELECTED_PILL_CLASS}>
              <span className="inline-flex items-center gap-1.5 leading-none">
                <span className="leading-none">{itemLabel}</span>
                <button
                  aria-label={getRemoveAriaLabel?.(item) ?? 'Quitar elemento'}
                  className={composeClassName(
                    'inline-flex size-5 cursor-pointer items-center justify-center rounded-full text-primary-700 transition-colors hover:bg-primary-200 hover:text-primary-900 disabled:cursor-not-allowed disabled:opacity-45 dark:text-primary-100 dark:hover:bg-primary-400/20',
                    themeClass.focus,
                  )}
                  disabled={disabled}
                  onClick={() => onRemove(item)}
                  type="button"
                >
                  <X aria-hidden="true" size={13} strokeWidth={2.4} />
                </button>
              </span>
            </Pill>
          </li>
        )
      })}
    </ul>
  )
}

export default SelectedPillList
export type { SelectedPillListProps }
