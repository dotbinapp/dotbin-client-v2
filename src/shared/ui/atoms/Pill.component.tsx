import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from 'react'
import { themeClass } from '../../styles/theme.styles'
import { composeClassName } from '../utils/className.utils'

interface PillBaseProps {
  active?: boolean
  activeClassName?: string
  children: ReactNode
  className?: string
  count?: number
  dotClassName?: string
  inactiveClassName?: string
}

type PillProps =
  | (PillBaseProps & ButtonHTMLAttributes<HTMLButtonElement> & { as?: 'button' })
  | (PillBaseProps & HTMLAttributes<HTMLSpanElement> & { as: 'span' })

const PILL_BASE_CLASS =
  'inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400/60'

function Pill({
  active = false,
  activeClassName = 'border-primary-300 bg-primary-100 text-primary-800 ring-primary-400/40',
  as = 'button',
  children,
  className = '',
  count,
  dotClassName,
  inactiveClassName = `${themeClass.surface.default} ${themeClass.text.default} hover:bg-ui-surface-hover`,
  ...props
}: Readonly<PillProps>) {
  const pillClassName = composeClassName(
    PILL_BASE_CLASS,
    active ? `ring-2 ${activeClassName}` : inactiveClassName,
    className,
  )
  const content = (
    <>
      {dotClassName ? <span className={composeClassName('size-1.5 rounded-full', dotClassName)} aria-hidden="true" /> : null}
      <span>{children}</span>
      {typeof count === 'number' ? (
        <span className="ml-1 rounded-full bg-ui-surface-muted px-1.5 py-0.5 text-[10px] font-bold tabular-nums text-ui-text-muted">
          {count}
        </span>
      ) : null}
    </>
  )

  if (as === 'span') {
    return (
      <span className={pillClassName} {...(props as HTMLAttributes<HTMLSpanElement>)}>
        {content}
      </span>
    )
  }

  const buttonProps = props as ButtonHTMLAttributes<HTMLButtonElement>

  return (
    <button
      className={pillClassName}
      type={buttonProps.type ?? 'button'}
      {...buttonProps}
    >
      {content}
    </button>
  )
}

export default Pill
