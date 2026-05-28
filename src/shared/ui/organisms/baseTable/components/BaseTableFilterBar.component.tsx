import { useState } from 'react'
import { Plus } from 'lucide-react'
import { themeClass } from '@shared/styles/theme.styles'
import { composeClassName } from '@shared/ui/utils/className.utils'
import type { BaseTableFilterOption } from '../baseTable.types'
import BaseTableFilterPill from './BaseTableFilterPill.component'

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
  const selectedFilterOptions = filterOptions.filter((filterOption) => activeFilterValues.includes(filterOption.value))
  const availableFilterOptions = filterOptions.filter((filterOption) => !activeFilterValues.includes(filterOption.value))
  const canAddFilter = availableFilterOptions.length > 0 && Boolean(onFilterToggle)

  const toggleFilterMenu = () => {
    if (!canAddFilter) return

    setIsFilterMenuOpen((isOpen) => !isOpen)
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {selectedFilterOptions.map((filterOption) => (
        <BaseTableFilterPill
          filterOption={filterOption}
          key={filterOption.value}
          onRemove={() => onFilterToggle?.(filterOption.value)}
        />
      ))}

      <div className="relative">
        <button
          aria-disabled={!canAddFilter || undefined}
          aria-expanded={canAddFilter ? isFilterMenuOpen : undefined}
          className={composeClassName(
            'inline-flex min-h-9 cursor-pointer items-center gap-2 rounded-full border border-ui-border bg-ui-surface px-3 text-sm font-semibold text-ui-text-muted shadow-sm transition-colors hover:border-ui-border-strong hover:text-ui-text disabled:cursor-not-allowed disabled:opacity-55 disabled:hover:border-ui-border disabled:hover:text-ui-text-muted',
            themeClass.focus,
          )}
          disabled={!canAddFilter}
          onClick={toggleFilterMenu}
          type="button"
        >
          <Plus aria-hidden="true" size={15} />
          Agregar filtro
        </button>

        {isFilterMenuOpen ? (
          <div className="absolute left-0 top-11 z-20 min-w-44 rounded-xl border border-ui-border bg-ui-surface-elevated p-1 shadow-[var(--theme-shadow-elevated)]">
            {availableFilterOptions.length > 0 ? (
              availableFilterOptions.map((filterOption) => (
                <button
                  className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-semibold text-ui-text-muted transition-colors hover:bg-ui-surface-hover hover:text-ui-text"
                  key={filterOption.value}
                  onClick={() => {
                    onFilterToggle?.(filterOption.value)
                    setIsFilterMenuOpen(false)
                  }}
                  type="button"
                >
                  {filterOption.Icon ? <filterOption.Icon aria-hidden="true" size={16} /> : null}
                  {filterOption.label}
                </button>
              ))
            ) : (
              <p className="px-3 py-2 text-sm font-medium text-ui-text-subtle">Sin filtros disponibles</p>
            )}
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default BaseTableFilterBar
