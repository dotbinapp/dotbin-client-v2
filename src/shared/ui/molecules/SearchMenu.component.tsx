import type { ReactNode } from 'react'
import { useEffect, useId, useRef, useState } from 'react'
import { LoaderCircle } from 'lucide-react'
import { themeClass } from '@shared/styles/theme.styles'
import { composeClassName } from '@shared/ui/utils/className.utils'
import SearchBar from './SearchBar.component'

type SearchMenuSize = 'md' | 'compact'

const SEARCH_MENU_OPEN_INPUT_CLASS = 'rounded-b-none border-primary-500 !shadow-none !ring-0 focus:rounded-b-none focus:border-primary-500 focus:!ring-0'
const SEARCH_MENU_PANEL_CLASS = 'search-menu-panel-enter absolute left-0 right-0 top-full z-30 -mt-px max-h-64 origin-top overflow-y-auto rounded-b-xl rounded-t-none border border-t-0 border-primary-500 bg-ui-surface p-1 !shadow-none'

interface SearchMenuProps<TItem> {
  ariaLabel: string
  disabled?: boolean
  emptyMessage?: ReactNode
  getItemKey: (item: TItem) => string
  getItemLabel: (item: TItem) => ReactNode
  inputId?: string
  items: TItem[]
  loading?: boolean
  minSearchLength?: number
  onSearch: (searchTerm: string) => Promise<void> | void
  onSelect: (item: TItem) => void
  placeholder?: string
  renderItem?: (item: TItem) => ReactNode
  searchPrompt?: ReactNode
  size?: SearchMenuSize
}

function SearchMenu<TItem>({
  ariaLabel,
  disabled = false,
  emptyMessage = 'No hay resultados.',
  getItemKey,
  getItemLabel,
  inputId,
  items,
  loading = false,
  minSearchLength = 2,
  onSearch,
  onSelect,
  placeholder,
  renderItem,
  searchPrompt,
  size = 'compact',
}: Readonly<SearchMenuProps<TItem>>) {
  const menuId = useId()
  const containerRef = useRef<HTMLDivElement>(null)
  const [searchResetCount, setSearchResetCount] = useState(0)
  const [submittedSearchTerm, setSubmittedSearchTerm] = useState('')
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const normalizedSearchTerm = submittedSearchTerm.trim()
  const canShowResults = normalizedSearchTerm.length >= minSearchLength
  const shouldShowMenu = canShowResults && isMenuOpen

  useEffect(() => {
    if (!shouldShowMenu) return

    const closeMenuOnOutsidePointerDown = (event: PointerEvent) => {
      if (!containerRef.current || !(event.target instanceof Node)) return
      if (containerRef.current.contains(event.target)) return

      setIsMenuOpen(false)
    }

    document.addEventListener('pointerdown', closeMenuOnOutsidePointerDown)

    return () => document.removeEventListener('pointerdown', closeMenuOnOutsidePointerDown)
  }, [shouldShowMenu])

  const searchItems = (nextSearchTerm: string) => {
    setSubmittedSearchTerm(nextSearchTerm)
    setIsMenuOpen(nextSearchTerm.trim().length >= minSearchLength)
    void onSearch(nextSearchTerm)
  }

  const selectItem = (item: TItem) => {
    onSelect(item)
    setSubmittedSearchTerm('')
    setIsMenuOpen(false)
    setSearchResetCount((currentCount) => currentCount + 1)
  }

  return (
    <div className="relative" ref={containerRef}>
      <SearchBar
        aria-controls={shouldShowMenu ? menuId : undefined}
        aria-expanded={shouldShowMenu}
        ariaLabel={ariaLabel}
        className={shouldShowMenu ? SEARCH_MENU_OPEN_INPUT_CLASS : undefined}
        disabled={disabled}
        id={inputId}
        key={searchResetCount}
        loading={loading}
        onFocus={() => {
          if (canShowResults) setIsMenuOpen(true)
        }}
        onKeyDown={(event) => {
          if (event.key === 'Escape') setIsMenuOpen(false)
        }}
        onSearch={searchItems}
        placeholder={placeholder}
        size={size}
      />

      {shouldShowMenu ? (
        <div className={SEARCH_MENU_PANEL_CLASS} id={menuId}>
          {loading ? (
            <div className="flex items-center gap-2 px-3 py-3 text-sm font-semibold text-ui-text-muted">
              <LoaderCircle aria-hidden="true" className="animate-spin" size={16} />
              Buscando...
            </div>
          ) : null}

          {!loading && items.length === 0 ? (
            <div className="px-3 py-3 text-sm font-semibold text-ui-text-muted">{emptyMessage}</div>
          ) : null}

          {!loading && items.length > 0 ? (
            <ul className="space-y-1">
              {items.map((item) => (
                <li key={getItemKey(item)}>
                  <button
                    className={composeClassName('flex w-full cursor-pointer items-center justify-between gap-3 rounded-xl px-3 py-2 text-left text-sm font-bold text-ui-text transition-colors hover:bg-ui-surface-hover', themeClass.focus)}
                    onClick={() => selectItem(item)}
                    type="button"
                  >
                    {renderItem ? renderItem(item) : getItemLabel(item)}
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}

      {!canShowResults && searchPrompt ? <p className="mt-1.5 text-xs font-semibold text-ui-text-muted">{searchPrompt}</p> : null}
    </div>
  )
}

export default SearchMenu
export type { SearchMenuProps }
