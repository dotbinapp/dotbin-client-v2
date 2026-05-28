import { useEffect, useRef, useState } from 'react'
import type { ComponentProps, ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import Button from '../atoms/Button.component'
import { themeClass } from '../../styles/theme.styles'
import { composeClassName } from '../utils/className.utils'

type ButtonProps = ComponentProps<typeof Button>
type MenuButtonSize = 'sm' | 'md' | 'l'
type MenuButtonPanelOffset = 'tight' | 'normal'
type MenuButtonPanelPlacement = 'bottom-start' | 'bottom-center' | 'bottom-end'

export interface MenuButtonOption {
  disabled?: boolean
  Icon?: LucideIcon
  label: string
  onSelect?: () => void
  tone?: 'default' | 'danger'
}

interface MenuButtonProps extends Omit<ButtonProps, 'onClick' | 'size'> {
  children?: ReactNode
  options: readonly MenuButtonOption[]
  panelOffset?: MenuButtonPanelOffset
  panelPlacement?: MenuButtonPanelPlacement
  size?: MenuButtonSize
  triggerSize?: ButtonProps['size']
}

const MENU_PANEL_SIZE_CLASS: Record<MenuButtonSize, string> = {
  sm: 'min-w-36 rounded-xl p-1',
  md: 'min-w-44 rounded-2xl p-1.5',
  l: 'min-w-52 rounded-2xl p-2',
}

const MENU_OPTION_SIZE_CLASS: Record<MenuButtonSize, string> = {
  sm: 'gap-2 rounded-lg px-2 py-1.5 text-xs',
  md: 'gap-2 rounded-xl px-2.5 py-2 text-sm',
  l: 'gap-3 rounded-xl px-3 py-2.5 text-sm',
}

const MENU_OPTION_ICON_SIZE: Record<MenuButtonSize, number> = {
  sm: 14,
  md: 15,
  l: 16,
}

const MENU_PANEL_OFFSET_CLASS: Record<MenuButtonPanelOffset, string> = {
  tight: 'mt-1',
  normal: 'mt-2',
}

const MENU_PANEL_PLACEMENT_CLASS: Record<MenuButtonPanelPlacement, string> = {
  'bottom-start': 'left-0 top-full',
  'bottom-center': 'left-1/2 top-full -translate-x-1/2',
  'bottom-end': 'right-0 top-full',
}

const MENU_PANEL_BASE_CLASS = `absolute z-[80] ${themeClass.surface.elevated}`
const MENU_OPTION_BASE_CLASS =
  `flex w-full cursor-pointer items-center text-left font-medium transition-colors ${themeClass.interactive.ghost} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40 disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:bg-transparent disabled:hover:text-current`
const MENU_OPTION_DANGER_CLASS = 'text-red-600 hover:bg-red-50 hover:text-red-700 focus-visible:ring-red-500/40'
const MENU_OPTION_ICON_TONE_CLASS = {
  danger: 'text-red-600',
  default: themeClass.text.primary,
} as const

function MenuButton({
  children,
  className = '',
  options,
  panelOffset = 'normal',
  panelPlacement = 'bottom-end',
  size = 'l',
  triggerSize,
  ...buttonProps
}: Readonly<MenuButtonProps>) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return

    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as Node

      if (!containerRef.current?.contains(target)) {
        setIsOpen(false)
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleOutsideClick)
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen])

  const selectOption = (option: MenuButtonOption) => {
    if (option.disabled || !option.onSelect) return

    option.onSelect()
    setIsOpen(false)
  }

  return (
    <div className="relative inline-flex" ref={containerRef}>
      <Button
        aria-expanded={isOpen}
        className={className}
        onClick={() => setIsOpen((currentValue) => !currentValue)}
        size={triggerSize}
        {...buttonProps}
      >
        {children}
      </Button>

      {isOpen ? (
        <div
          className={composeClassName(
            MENU_PANEL_BASE_CLASS,
            MENU_PANEL_PLACEMENT_CLASS[panelPlacement],
            MENU_PANEL_OFFSET_CLASS[panelOffset],
            MENU_PANEL_SIZE_CLASS[size],
          )}
        >
          <ul className="space-y-1">
            {options.map((option) => (
              <li key={option.label}>
                <button
                  className={composeClassName(
                    MENU_OPTION_BASE_CLASS,
                    MENU_OPTION_SIZE_CLASS[size],
                    option.tone === 'danger' && MENU_OPTION_DANGER_CLASS,
                  )}
                  disabled={option.disabled}
                  onClick={() => selectOption(option)}
                  type="button"
                >
                  {option.Icon ? <option.Icon aria-hidden="true" className={`shrink-0 ${MENU_OPTION_ICON_TONE_CLASS[option.tone ?? 'default']}`} size={MENU_OPTION_ICON_SIZE[size]} /> : null}
                  <span className="whitespace-nowrap">{option.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  )
}

export default MenuButton
