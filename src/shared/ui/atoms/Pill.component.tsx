import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { composeClassName } from '../utils/className.utils'

interface PillProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean
  activeClassName?: string
  children: ReactNode
  count?: number
  dotClassName?: string
  inactiveClassName?: string
}

const PILL_BASE_CLASS =
  'inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400/60'

function Pill({
  active = false,
  activeClassName = 'border-primary-300 bg-primary-100 text-primary-800 ring-primary-400/40',
  children,
  className = '',
  count,
  dotClassName,
  inactiveClassName = 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50',
  type = 'button',
  ...props
}: Readonly<PillProps>) {
  return (
    <button
      className={composeClassName(
        PILL_BASE_CLASS,
        active ? `ring-2 ${activeClassName}` : inactiveClassName,
        className,
      )}
      type={type}
      {...props}
    >
      {dotClassName ? <span className={composeClassName('size-1.5 rounded-full', dotClassName)} aria-hidden="true" /> : null}
      <span>{children}</span>
      {typeof count === 'number' ? (
        <span className="ml-1 rounded-full bg-white/70 px-1.5 py-0.5 text-[10px] font-bold tabular-nums text-slate-600">
          {count}
        </span>
      ) : null}
    </button>
  )
}

export default Pill
