import type { ButtonHTMLAttributes, ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import { composeClassName } from '../utils/className.utils'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'link'
type ButtonSize = 'sm' | 'md' | 'lg' | 'icon'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode
  fullWidth?: boolean
  iconOnly?: boolean
  Icon?: LucideIcon
  loading?: boolean
  size?: ButtonSize
  variant?: ButtonVariant
}

const BUTTON_BASE_CLASS =
  'inline-flex items-center justify-center gap-2 font-bold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-50'

const BUTTON_VARIANT_CLASS: Record<ButtonVariant, string> = {
  primary: 'bg-primary-600 text-white shadow-lg shadow-primary-900/20 hover:bg-primary-700 active:scale-[0.98]',
  secondary:
    'border border-slate-200 bg-white text-slate-800 shadow-sm hover:border-primary-200 hover:bg-primary-50/60 hover:text-primary-700 active:scale-[0.98]',
  ghost: 'text-slate-600 hover:bg-white/45 hover:text-slate-800 active:scale-[0.98]',
  danger: 'border border-transparent text-slate-500 hover:border-red-100/60 hover:bg-red-50/70 hover:text-red-600 active:scale-[0.98]',
  link: 'h-auto rounded-lg p-0 text-primary-700 hover:text-primary-800 hover:underline disabled:no-underline',
}

const BUTTON_SIZE_CLASS: Record<ButtonSize, string> = {
  sm: 'min-h-10 rounded-xl px-3 text-xs',
  md: 'min-h-12 rounded-xl px-4 text-sm',
  lg: 'min-h-[3.25rem] rounded-2xl px-5 text-base',
  icon: 'size-12 rounded-2xl p-0',
}

function Button({
  children,
  className = '',
  disabled,
  fullWidth = false,
  iconOnly = false,
  Icon,
  loading = false,
  size = iconOnly ? 'icon' : 'md',
  type = 'button',
  variant = 'primary',
  ...props
}: Readonly<ButtonProps>) {
  return (
    <button
      className={composeClassName(
        BUTTON_BASE_CLASS,
        BUTTON_VARIANT_CLASS[variant],
        BUTTON_SIZE_CLASS[size],
        fullWidth && 'w-full',
        className,
      )}
      disabled={disabled || loading}
      type={type}
      {...props}
    >
      {Icon ? <Icon aria-hidden="true" className="shrink-0" size={size === 'sm' ? 16 : 18} /> : null}
      {iconOnly ? <span className="sr-only">{props['aria-label']}</span> : children}
    </button>
  )
}

export default Button
