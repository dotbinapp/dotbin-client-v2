import type { ComponentProps, ReactNode } from 'react'
import { forwardRef, useId } from 'react'
import type { LucideIcon } from 'lucide-react'
import { composeClassName } from '../utils/className.utils'

type FieldSize = 'md' | 'compact'

interface InputProps extends Omit<ComponentProps<'input'>, 'size'> {
  error?: string
  helperText?: ReactNode
  Icon?: LucideIcon
  label?: string
  size?: FieldSize
}

const FIELD_SIZE_CLASS: Record<FieldSize, string> = {
  compact: 'min-h-11 rounded-lg p-2.5 text-sm',
  md: 'min-h-[3.25rem] rounded-xl p-3 text-base',
}

const FIELD_BASE_CLASS =
  'w-full border bg-white text-slate-700 shadow-sm outline-none transition-all placeholder:text-slate-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-50 disabled:text-slate-400 disabled:ring-0'

const SUPPORT_TEXT_CLASS = 'mt-1.5 text-xs font-medium'

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', disabled, error, helperText, Icon, id, label, required, size = 'md', ...props }, ref) => {
    const generatedId = useId()
    const inputId = id ?? generatedId
    const helperId = helperText ? `${inputId}-helper` : undefined
    const errorId = error ? `${inputId}-error` : undefined

    return (
      <div className="w-full">
        {label ? (
          <label className="mb-1.5 block text-sm font-bold text-slate-700" htmlFor={inputId}>
            {label}
            {required ? <span className="ml-1 text-primary-600">*</span> : null}
          </label>
        ) : null}

        <div className="relative w-full">
          {Icon ? (
            <Icon
              aria-hidden="true"
              className={composeClassName(
                'pointer-events-none absolute left-3 top-1/2 -translate-y-1/2',
                disabled ? 'text-slate-300' : error ? 'text-red-400' : 'text-slate-400',
              )}
              size={size === 'compact' ? 16 : 18}
            />
          ) : null}

          <input
            aria-describedby={composeClassName(helperId, errorId) || undefined}
            aria-invalid={error ? true : undefined}
            className={composeClassName(
              FIELD_BASE_CLASS,
              FIELD_SIZE_CLASS[size],
              Icon && (size === 'compact' ? 'pl-9' : 'pl-10'),
              error ? 'border-red-300 bg-red-50/30 focus:border-red-400 focus:ring-red-500/25' : 'border-slate-300',
              className,
            )}
            disabled={disabled}
            id={inputId}
            ref={ref}
            required={required}
            {...props}
          />
        </div>

        {helperText ? (
          <p className={composeClassName(SUPPORT_TEXT_CLASS, 'text-slate-500')} id={helperId}>
            {helperText}
          </p>
        ) : null}
        {error ? (
          <p className={composeClassName(SUPPORT_TEXT_CLASS, 'text-red-600')} id={errorId}>
            {error}
          </p>
        ) : null}
      </div>
    )
  },
)

Input.displayName = 'Input'

export default Input
