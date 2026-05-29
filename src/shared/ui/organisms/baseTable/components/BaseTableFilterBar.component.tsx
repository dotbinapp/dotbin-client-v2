import { useState } from 'react'
import { Check, SlidersHorizontal } from 'lucide-react'
import { themeClass } from '@shared/styles/theme.styles'
import { composeClassName } from '@shared/ui/utils/className.utils'
import type { BaseTableFilterOption } from '../baseTable.types'

interface BaseTableFilterBarProps<TFilter extends string> {
  activeFilterValues: TFilter[]
  filterOptions: BaseTableFilterOption<TFilter>[]
  onFilterToggle?: (filterValue: TFilter) => void
}

function BaseTableFilterBar<TFilter extends string>({
  activeFilterValues,
  filterOptions,
  onFilterToggle,
}: Readonly<BaseTableFilterBarProps<TFilter>>) {
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false)
  const canToggleFilters = filterOptions.length > 0 && Boolean(onFilterToggle)
  const activeFilterCount = activeFilterValues.length

  const toggleFilterMenu = () => {
    if (!canToggleFilters) return

    setIsFilterMenuOpen((isOpen) => !isOpen)
  }

  return (
    <div className="relative">
      <button
        aria-disabled={!canToggleFilters || undefined}
        aria-expanded={canToggleFilters ? isFilterMenuOpen : undefined}
        className={composeClassName(
          'inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-xl border border-ui-border bg-ui-surface px-3 text-sm font-semibold text-ui-text-muted shadow-sm transition-colors hover:border-ui-border-strong hover:text-ui-text disabled:cursor-not-allowed disabled:opacity-55 disabled:hover:border-ui-border disabled:hover:text-ui-text-muted',
          activeFilterCount > 0 && 'border-primary-300 bg-ui-primary-soft text-ui-primary-text',
          themeClass.focus,
        )}
        disabled={!canToggleFilters}
        onClick={toggleFilterMenu}
        type="button"
      >
        <SlidersHorizontal aria-hidden="true" size={16} />
        Filtros
        {activeFilterCount > 0 ? (
          <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-primary-600 px-1.5 text-xs font-black text-white">
            {activeFilterCount}
          </span>
        ) : null}
      </button>

      {isFilterMenuOpen ? (
        <div className="absolute right-0 top-12 z-20 min-w-56 rounded-xl border border-ui-border bg-ui-surface-elevated p-1 shadow-[var(--theme-shadow-elevated)]">
          {filterOptions.map((filterOption) => {
            const isSelected = activeFilterValues.includes(filterOption.value)

            return (
              <button
                aria-pressed={isSelected}
                className={composeClassName(
                  'flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-semibold transition-colors hover:bg-ui-surface-hover hover:text-ui-text',
                  isSelected ? 'bg-ui-primary-soft text-ui-primary-text' : 'text-ui-text-muted',
                )}
                key={filterOption.value}
                onClick={() => {
                  onFilterToggle?.(filterOption.value)
                  setIsFilterMenuOpen(false)
                }}
                type="button"
              >
                {filterOption.Icon ? <filterOption.Icon aria-hidden="true" size={16} /> : null}
                <span className="flex-1">{filterOption.label}</span>
                {isSelected ? <Check aria-hidden="true" size={15} /> : null}
              </button>
            )
          })}
        </div>
      ) : null}
    </div>
  )
}

export default BaseTableFilterBar
