import type { ComponentProps, ReactNode } from 'react'
import { composeClassName } from '@shared/ui/utils/className.utils'

type StatusBadgeTone = 'success' | 'danger' | 'warning' | 'neutral'

interface StatusBadgeProps extends ComponentProps<'span'> {
  children: ReactNode
  tone?: StatusBadgeTone
}

const STATUS_BADGE_TONE_CLASS: Record<StatusBadgeTone, string> = {
  danger: 'border-red-200 bg-red-100 text-red-700 dark:border-red-400/35 dark:bg-red-500/15 dark:text-red-200',
  neutral: 'border-ui-border bg-ui-surface-muted text-ui-text-muted',
  success: 'border-green-200 bg-green-100 text-green-700 dark:border-green-400/35 dark:bg-green-500/15 dark:text-green-200',
  warning: 'border-amber-200 bg-amber-100 text-amber-700 dark:border-amber-400/35 dark:bg-amber-500/15 dark:text-amber-200',
}

function StatusBadge({ children, className = '', tone = 'neutral', ...props }: Readonly<StatusBadgeProps>) {
  return (
    <span
      className={composeClassName(
        'inline-flex rounded-full border px-3 py-1 text-xs font-black uppercase tracking-wide',
        STATUS_BADGE_TONE_CLASS[tone],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  )
}

export default StatusBadge
