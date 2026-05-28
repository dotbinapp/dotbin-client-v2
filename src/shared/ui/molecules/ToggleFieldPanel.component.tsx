import type { ReactNode } from 'react'
import { Check } from 'lucide-react'
import { themeClass } from '../../styles/theme.styles'
import { composeClassName } from '../utils/className.utils'

interface ToggleFieldPanelProps {
  checked: boolean
  children: ReactNode
  description: string
  disabled?: boolean
  onCheckedChange: (checked: boolean) => void
  title: string
}

function ToggleFieldPanel({ checked, children, description, disabled = false, onCheckedChange, title }: Readonly<ToggleFieldPanelProps>) {
  return (
    <section
      className={composeClassName(
        'overflow-hidden rounded-2xl border bg-ui-surface transition-all duration-200',
        checked ? 'border-primary-300 shadow-[0_12px_32px_rgba(14,165,233,0.14)]' : 'border-ui-border shadow-[var(--theme-shadow-surface)]',
        disabled && 'opacity-60',
      )}
    >
      <button
        aria-pressed={checked}
        className={composeClassName(
          'flex w-full cursor-pointer items-start gap-3 p-3 text-left transition-colors hover:bg-ui-surface-hover',
          themeClass.focus,
          checked && 'bg-ui-primary-soft/60 hover:bg-ui-primary-soft',
          disabled && 'cursor-not-allowed hover:bg-transparent',
        )}
        disabled={disabled}
        onClick={() => onCheckedChange(!checked)}
        type="button"
      >
        <span
          aria-hidden="true"
          className={composeClassName(
            'mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-md border transition-colors',
            checked ? 'border-primary-600 bg-primary-600 text-white' : 'border-ui-border-strong bg-ui-surface text-transparent',
          )}
        >
          <Check size={14} strokeWidth={3} />
        </span>

        <span className="min-w-0 flex-1">
          <span className="block text-sm font-black text-ui-text-default">{title}</span>
          <span className="mt-0.5 block text-xs font-medium leading-5 text-ui-text-muted">{description}</span>
        </span>
      </button>

      <div
        className={composeClassName(
          'border-t border-ui-border bg-ui-surface-muted/45 p-3 transition-opacity',
          checked ? 'opacity-100' : 'opacity-55',
        )}
      >
        {children}
      </div>
    </section>
  )
}

export default ToggleFieldPanel
