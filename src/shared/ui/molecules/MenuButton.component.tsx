import { useEffect, useRef, useState } from 'react'
import type { ComponentProps, ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import Button from '../atoms/Button.component'
import { themeClass } from '../../styles/theme.styles'

type ButtonProps = ComponentProps<typeof Button>

export interface MenuButtonOption {
  Icon?: LucideIcon
  label: string
  onSelect: () => void
}

interface MenuButtonProps extends Omit<ButtonProps, 'onClick'> {
  children: ReactNode
  options: readonly MenuButtonOption[]
}

const MENU_PANEL_CLASS =
  `absolute right-0 top-full z-[80] mt-2 min-w-52 rounded-2xl p-2 ${themeClass.surface.elevated}`
const MENU_OPTION_CLASS =
  `flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-colors ${themeClass.interactive.ghost} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40`

function MenuButton({ children, className = '', options, ...buttonProps }: Readonly<MenuButtonProps>) {
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
    option.onSelect()
    setIsOpen(false)
  }

  return (
    <div className="relative inline-flex" ref={containerRef}>
      <Button aria-expanded={isOpen} className={className} onClick={() => setIsOpen((currentValue) => !currentValue)} {...buttonProps}>
        {children}
      </Button>

      {isOpen ? (
        <div className={MENU_PANEL_CLASS}>
          <ul className="space-y-1">
            {options.map((option) => (
              <li key={option.label}>
                <button className={MENU_OPTION_CLASS} onClick={() => selectOption(option)} type="button">
                  {option.Icon ? <option.Icon aria-hidden="true" className={`shrink-0 ${themeClass.text.primary}`} size={16} /> : null}
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
