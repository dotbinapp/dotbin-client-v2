import { createPortal } from 'react-dom'
import { CalendarClock, Lock } from 'lucide-react'
import { themeClass } from '@shared/styles/theme.styles'
import type { CalendarSlotIntent } from '../../model/scheduling.types'

interface CalendarSlotIntentMenuProps {
  isOpen: boolean
  left: number
  onSelect: (intent: CalendarSlotIntent) => void
  top: number
}

function CalendarSlotIntentMenu({ isOpen, left, onSelect, top }: Readonly<CalendarSlotIntentMenuProps>) {
  if (!isOpen || typeof document === 'undefined') return null

  return createPortal(
    <div
      data-week-slot-menu
      className={`fixed z-50 min-w-[200px] rounded-xl py-1 ${themeClass.surface.elevated}`}
      style={{ left, top }}
      role="menu"
      aria-label="Acciones del horario"
    >
      <button
        type="button"
        className={`flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm ${themeClass.interactive.ghost}`}
        onClick={(event) => {
          event.stopPropagation()
          onSelect('appointment')
        }}
      >
        <CalendarClock size={16} className={`shrink-0 ${themeClass.text.primary}`} aria-hidden="true" />
        Nuevo turno
      </button>
      <button
        type="button"
        className={`flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm ${themeClass.interactive.ghost}`}
        onClick={(event) => {
          event.stopPropagation()
          onSelect('block')
        }}
      >
        <Lock size={16} className={`shrink-0 ${themeClass.text.muted}`} aria-hidden="true" />
        Bloquear horario
      </button>
    </div>,
    document.body,
  )
}

export default CalendarSlotIntentMenu
