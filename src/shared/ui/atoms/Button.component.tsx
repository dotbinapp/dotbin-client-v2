import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { LoaderCircle } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { themeClass } from '../../styles/theme.styles'
import { composeClassName } from '../utils/className.utils'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'link'
type ButtonSize = 'sm' | 'md' | 'lg' | 'icon'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode
  fullWidth?: boolean
  iconOnly?: boolean
  Icon?: LucideIcon
  loading?: boolean
  onLoading?: boolean
  size?: ButtonSize
  variant?: ButtonVariant
}

const BUTTON_BASE_CLASS =
  `cursor-pointer inline-flex items-center justify-center gap-2 font-bold transition-all duration-200 ${themeClass.focus} disabled:cursor-not-allowed disabled:opacity-50`

const BUTTON_VARIANT_CLASS: Record<ButtonVariant, string> = {
  primary: 'bg-primary-600 text-white shadow-lg shadow-primary-900/20 hover:bg-primary-700 active:scale-[0.98]',
  secondary:
    `${themeClass.surface.default} ${themeClass.text.default} shadow-sm hover:border-primary-200 hover:bg-ui-primary-soft hover:text-ui-primary-text active:scale-[0.98]`,
  ghost: `${themeClass.interactive.ghost} active:scale-[0.98]`,
  danger: 'border border-red-500 bg-red-500 text-white shadow-lg shadow-red-900/20 hover:border-red-400 hover:bg-red-400 active:scale-[0.98]',
  link: `h-auto rounded-lg p-0 ${themeClass.text.primary} hover:underline disabled:no-underline`,
}

const BUTTON_SIZE_CLASS: Record<ButtonSize, string> = {
  sm: 'min-h-8 rounded-xl px-3 text-xs',
  md: 'min-h-10 rounded-xl px-4 text-sm',
  lg: 'min-h-12 rounded-2xl px-5 text-base',
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
  onLoading = false,
  size = iconOnly ? 'icon' : 'md',
  type = 'button',
  variant = 'primary',
  ...props
}: Readonly<ButtonProps>) {
  const isLoading = loading || onLoading

  return (
    <button
      aria-busy={isLoading || undefined}
      className={composeClassName(
        BUTTON_BASE_CLASS,
        BUTTON_VARIANT_CLASS[variant],
        BUTTON_SIZE_CLASS[size],
        fullWidth && 'w-full',
        className,
      )}
      disabled={disabled || isLoading}
      type={type}
      {...props}
    >
      {isLoading ? <LoaderCircle aria-hidden="true" className="shrink-0 animate-spin motion-reduce:animate-none" size={size === 'sm' ? 16 : 18} /> : null}
      {!isLoading && Icon ? <Icon aria-hidden="true" className="shrink-0" size={size === 'sm' ? 16 : 18} /> : null}
      {iconOnly ? <span className="sr-only">{props['aria-label']}</span> : children}
    </button>
  )
}

export default Button
