import type { ComponentProps } from 'react'
import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { LoaderCircle, Search, X } from 'lucide-react'
import { useDebounce } from '@shared/hooks'
import { themeClass } from '@shared/styles/theme.styles'
import { composeClassName } from '@shared/ui/utils/className.utils'

type SearchBarSize = 'md' | 'compact'

interface SearchBarProps extends Omit<ComponentProps<'input'>, 'defaultValue' | 'onChange' | 'size' | 'type' | 'value'> {
  ariaLabel?: string
  initialValue?: string
  loading?: boolean
  onSearch: (searchTerm: string) => Promise<void> | void
  size?: SearchBarSize
}

const SEARCH_BAR_SIZE_CLASS: Record<SearchBarSize, string> = {
  compact: 'min-h-11 rounded-lg py-2.5 pl-9 pr-20 text-sm',
  md: 'min-h-[3.25rem] rounded-xl py-3 pl-10 pr-20 text-base',
}

const SEARCH_ICON_SIZE: Record<SearchBarSize, number> = {
  compact: 16,
  md: 18,
}

const SEARCH_BAR_BASE_CLASS =
  'w-full border bg-ui-surface text-ui-text shadow-[var(--theme-shadow-surface)] outline-none transition-all placeholder:text-ui-text-subtle focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus-visible:!outline-none disabled:cursor-not-allowed disabled:border-ui-border disabled:bg-ui-surface-muted disabled:text-ui-text-subtle disabled:ring-0'

function SearchBar({
  ariaLabel = 'Buscar',
  className = '',
  disabled = false,
  id,
  initialValue = '',
  loading = false,
  onSearch,
  placeholder = 'Buscar...',
  size = 'compact',
  ...props
}: Readonly<SearchBarProps>) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const [searchTerm, setSearchTerm] = useState(initialValue)
  const debouncedSearchTerm = useDebounce(searchTerm)
  const lastSubmittedSearchTermRef = useRef<string | null>(null)
  const hasSearchTerm = searchTerm.length > 0

  const submitSearch = useCallback((nextSearchTerm: string) => {
    if (lastSubmittedSearchTermRef.current === nextSearchTerm) return

    lastSubmittedSearchTermRef.current = nextSearchTerm
    void onSearch(nextSearchTerm)
  }, [onSearch])

  useEffect(() => {
    submitSearch(debouncedSearchTerm)
  }, [debouncedSearchTerm, submitSearch])

  const clearSearch = () => {
    if (!hasSearchTerm) return

    setSearchTerm('')
  }

  return (
    <div className="relative w-full">
      <Search
        aria-hidden="true"
        className={composeClassName(
          'pointer-events-none absolute left-3 top-1/2 -translate-y-1/2',
          disabled ? themeClass.text.subtle : themeClass.text.muted,
        )}
        size={SEARCH_ICON_SIZE[size]}
      />

      <input
        aria-busy={loading || undefined}
        aria-label={ariaLabel}
        className={composeClassName(SEARCH_BAR_BASE_CLASS, SEARCH_BAR_SIZE_CLASS[size], 'border-ui-border-strong', className)}
        disabled={disabled}
        id={inputId}
        onChange={(event) => setSearchTerm(event.target.value)}
        placeholder={placeholder}
        type="search"
        value={searchTerm}
        {...props}
      />

      <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1">
        {loading ? <LoaderCircle aria-hidden="true" className="animate-spin text-ui-text-subtle" size={16} /> : null}

        {hasSearchTerm ? (
          <button
            aria-label="Limpiar búsqueda"
            className={composeClassName(
              'inline-flex size-7 cursor-pointer items-center justify-center rounded-lg text-ui-text-muted transition-colors hover:bg-ui-surface-hover hover:text-ui-text disabled:cursor-not-allowed disabled:opacity-45',
              themeClass.focus,
            )}
            disabled={disabled}
            onClick={clearSearch}
            type="button"
          >
            <X aria-hidden="true" size={15} />
          </button>
        ) : null}
      </div>
    </div>
  )
}

export default SearchBar
export type { SearchBarProps }
