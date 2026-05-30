import type { ComponentProps, ReactNode } from 'react'
import { forwardRef, useId } from 'react'
import type { LucideIcon } from 'lucide-react'
import { themeClass } from '../../styles/theme.styles'
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
  'w-full border bg-ui-surface text-ui-text shadow-[var(--theme-shadow-surface)] outline-none transition-all placeholder:text-ui-text-subtle focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus-visible:!outline-none disabled:cursor-not-allowed disabled:border-ui-border disabled:bg-ui-surface-muted disabled:text-ui-text-subtle disabled:ring-0'

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
          <label className={`mb-1.5 block text-sm font-bold ${themeClass.text.default}`} htmlFor={inputId}>
            {label}
            {required ? <span className="ml-1 text-primary-600 dark:text-primary-300">*</span> : null}
          </label>
        ) : null}

        <div className="relative w-full">
          {Icon ? (
            <Icon
              aria-hidden="true"
              className={composeClassName(
                'pointer-events-none absolute left-3 top-1/2 -translate-y-1/2',
                disabled ? themeClass.text.subtle : error ? 'text-red-400 dark:text-red-300' : themeClass.text.muted,
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
              error ? 'border-red-300 bg-red-50/30 focus:border-red-400 dark:border-red-400/45 dark:bg-red-500/10 dark:focus:border-red-300' : 'border-ui-border-strong',
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
          <p className={composeClassName(SUPPORT_TEXT_CLASS, themeClass.text.muted)} id={helperId}>
            {helperText}
          </p>
        ) : null}
        {error ? (
          <p className={composeClassName(SUPPORT_TEXT_CLASS, 'text-red-600 dark:text-red-300')} id={errorId}>
            {error}
          </p>
        ) : null}
      </div>
    )
  },
)

Input.displayName = 'Input'

export default Input
