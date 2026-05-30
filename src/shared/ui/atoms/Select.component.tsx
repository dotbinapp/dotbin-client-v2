import type { ComponentProps, ReactNode } from 'react'
import { forwardRef, useId } from 'react'
import { ChevronDown } from 'lucide-react'
import { themeClass } from '../../styles/theme.styles'
import { composeClassName } from '../utils/className.utils'

type FieldSize = 'md' | 'compact'

interface SelectProps extends Omit<ComponentProps<'select'>, 'size'> {
  error?: string
  helperText?: ReactNode
  label?: string
  size?: FieldSize
}

const SELECT_SIZE_CLASS: Record<FieldSize, string> = {
  compact: 'min-h-11 rounded-lg py-2.5 pl-3 pr-10 text-sm',
  md: 'min-h-[3.25rem] rounded-xl py-3 pl-3 pr-10 text-base',
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ children, className = '', disabled, error, helperText, id, label, required, size = 'md', ...props }, ref) => {
    const generatedId = useId()
    const selectId = id ?? generatedId
    const helperId = helperText ? `${selectId}-helper` : undefined
    const errorId = error ? `${selectId}-error` : undefined

    return (
      <div className="w-full">
        {label ? (
          <label className={`mb-1.5 block text-sm font-bold ${themeClass.text.default}`} htmlFor={selectId}>
            {label}
            {required ? <span className="ml-1 text-primary-600 dark:text-primary-300">*</span> : null}
          </label>
        ) : null}

        <div className="relative w-full">
          <select
            aria-describedby={composeClassName(helperId, errorId) || undefined}
            aria-invalid={error ? true : undefined}
            className={composeClassName(
              'w-full appearance-none border bg-ui-surface text-ui-text shadow-[var(--theme-shadow-surface)] outline-none transition-all focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 disabled:cursor-not-allowed disabled:border-ui-border disabled:bg-ui-surface-muted disabled:text-ui-text-subtle disabled:ring-0',
              SELECT_SIZE_CLASS[size],
              error ? 'border-red-300 bg-red-50/30 focus:border-red-400 focus:ring-red-500/25 dark:border-red-400/45 dark:bg-red-500/10 dark:focus:border-red-300' : 'border-ui-border-strong',
              className,
            )}
            disabled={disabled}
            id={selectId}
            ref={ref}
            required={required}
            {...props}
          >
            {children}
          </select>

          <ChevronDown
            aria-hidden="true"
            className={composeClassName(
              'pointer-events-none absolute right-3 top-1/2 -translate-y-1/2',
              disabled ? themeClass.text.subtle : themeClass.text.muted,
            )}
            size={18}
          />
        </div>

        {helperText ? (
          <p className={`mt-1.5 text-xs font-medium ${themeClass.text.muted}`} id={helperId}>
            {helperText}
          </p>
        ) : null}
        {error ? (
          <p className="mt-1.5 text-xs font-medium text-red-600 dark:text-red-300" id={errorId}>
            {error}
          </p>
        ) : null}
      </div>
    )
  },
)

Select.displayName = 'Select'

export default Select
