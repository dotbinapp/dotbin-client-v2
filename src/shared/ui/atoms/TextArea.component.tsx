import type { ComponentProps, ReactNode } from 'react'
import { forwardRef, useId } from 'react'
import { themeClass } from '../../styles/theme.styles'
import { composeClassName } from '../utils/className.utils'

type TextAreaSize = 'md' | 'compact'

interface TextAreaProps extends ComponentProps<'textarea'> {
  error?: string
  helperText?: ReactNode
  label?: string
  size?: TextAreaSize
}

const TEXTAREA_SIZE_CLASS: Record<TextAreaSize, string> = {
  compact: 'min-h-28 rounded-lg p-2.5 text-sm',
  md: 'min-h-36 rounded-xl p-3 text-base',
}

const TEXTAREA_BASE_CLASS =
  'w-full resize-y border bg-ui-surface text-ui-text shadow-[var(--theme-shadow-surface)] outline-none transition-all placeholder:text-ui-text-subtle focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus-visible:!outline-none disabled:cursor-not-allowed disabled:border-ui-border disabled:bg-ui-surface-muted disabled:text-ui-text-subtle disabled:ring-0'

const SUPPORT_TEXT_CLASS = 'mt-1.5 text-xs font-medium'

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ className = '', disabled, error, helperText, id, label, required, size = 'md', ...props }, ref) => {
    const generatedId = useId()
    const textareaId = id ?? generatedId
    const helperId = helperText ? `${textareaId}-helper` : undefined
    const errorId = error ? `${textareaId}-error` : undefined

    return (
      <div className="w-full">
        {label ? (
          <label className={`mb-1.5 block text-sm font-bold ${themeClass.text.default}`} htmlFor={textareaId}>
            {label}
            {required ? <span className="ml-1 text-primary-600 dark:text-primary-300">*</span> : null}
          </label>
        ) : null}

        <textarea
          aria-describedby={composeClassName(helperId, errorId) || undefined}
          aria-invalid={error ? true : undefined}
          className={composeClassName(
            TEXTAREA_BASE_CLASS,
            TEXTAREA_SIZE_CLASS[size],
            error ? 'border-red-300 bg-red-50/30 focus:border-red-400 dark:border-red-400/45 dark:bg-red-500/10 dark:focus:border-red-300' : 'border-ui-border-strong',
            className,
          )}
          disabled={disabled}
          id={textareaId}
          ref={ref}
          required={required}
          {...props}
        />

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

TextArea.displayName = 'TextArea'

export default TextArea
