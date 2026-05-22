import type { ComponentProps, ReactNode } from 'react'
import { forwardRef, useId } from 'react'
import { ChevronDown } from 'lucide-react'
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
          <label className="mb-1.5 block text-sm font-bold text-slate-700" htmlFor={selectId}>
            {label}
            {required ? <span className="ml-1 text-primary-600">*</span> : null}
          </label>
        ) : null}

        <div className="relative w-full">
          <select
            aria-describedby={composeClassName(helperId, errorId) || undefined}
            aria-invalid={error ? true : undefined}
            className={composeClassName(
              'w-full appearance-none border bg-white text-slate-700 shadow-sm outline-none transition-all focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-50 disabled:text-slate-400 disabled:ring-0',
              SELECT_SIZE_CLASS[size],
              error ? 'border-red-300 bg-red-50/30 focus:border-red-400 focus:ring-red-500/25' : 'border-slate-300',
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
              disabled ? 'text-slate-300' : 'text-slate-400',
            )}
            size={18}
          />
        </div>

        {helperText ? (
          <p className="mt-1.5 text-xs font-medium text-slate-500" id={helperId}>
            {helperText}
          </p>
        ) : null}
        {error ? (
          <p className="mt-1.5 text-xs font-medium text-red-600" id={errorId}>
            {error}
          </p>
        ) : null}
      </div>
    )
  },
)

Select.displayName = 'Select'

export default Select
