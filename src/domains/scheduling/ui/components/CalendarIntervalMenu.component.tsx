import { createPortal } from 'react-dom'
import { ChevronDown } from 'lucide-react'
import { themeClass } from '@shared/styles/theme.styles'
import { CALENDAR_SLOT_INTERVALS } from '../../model/calendar.constants'
import type { CalendarSlotIntervalMinutes } from '../../model/scheduling.types'

interface CalendarIntervalMenuProps {
  disabled?: boolean
  intervalMinutes: CalendarSlotIntervalMinutes
  isOpen: boolean
  onChange: (minutes: CalendarSlotIntervalMinutes) => void
  onClose: () => void
  onToggle: (rect: DOMRect) => void
  triggerRect: DOMRect | null
}

function CalendarIntervalMenu({ disabled = false, intervalMinutes, isOpen, onChange, onClose, onToggle, triggerRect }: Readonly<CalendarIntervalMenuProps>) {
  return (
    <>
      <button
        type="button"
        data-week-interval-trigger
        disabled={disabled}
        onClick={(event) => onToggle(event.currentTarget.getBoundingClientRect())}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label="Elegir intervalo de la grilla"
        className={`flex flex-col items-center justify-center gap-0.5 border-r p-2 text-center transition-colors hover:bg-ui-surface-hover disabled:pointer-events-none disabled:opacity-50 md:p-3 ${themeClass.border.default} ${themeClass.text.default}`}
      >
        <span className={`text-[10px] font-semibold uppercase tracking-wide md:text-[11px] ${themeClass.text.muted}`}>Hora</span>
        <span className={`flex items-center gap-0.5 text-[10px] font-bold md:text-xs ${themeClass.text.primary}`}>
          {intervalMinutes} min
          <ChevronDown className="size-3 shrink-0 opacity-70 md:size-3.5" aria-hidden="true" />
        </span>
      </button>

      {isOpen && typeof document !== 'undefined'
        ? createPortal(
          <div
            data-week-interval-menu
            className={`fixed z-50 rounded-xl py-1 ${themeClass.surface.elevated}`}
            style={getIntervalMenuStyle(triggerRect)}
            role="listbox"
            aria-label="Intervalo de la grilla"
          >
            {CALENDAR_SLOT_INTERVALS.map((minutes) => (
              <button
                key={minutes}
                type="button"
                role="option"
                aria-selected={minutes === intervalMinutes}
                className={`flex w-full items-center px-3 py-2 text-left text-sm transition-colors ${minutes === intervalMinutes ? `bg-ui-primary-soft font-semibold ${themeClass.text.primary}` : `${themeClass.interactive.ghost}`}`}
                onClick={(event) => {
                  event.stopPropagation()
                  onChange(minutes)
                  onClose()
                }}
              >
                {minutes} min
              </button>
            ))}
          </div>,
          document.body,
        )
        : null}
    </>
  )
}

function getIntervalMenuStyle(rect: DOMRect | null) {
  if (!rect) return { left: 8, minWidth: 140, top: 8 }

  const width = Math.max(rect.width, 140)
  const left = Math.min(Math.max(rect.left, 8), window.innerWidth - width - 8)
  const top = rect.bottom + 6

  return { left, minWidth: width, top }
}

export default CalendarIntervalMenu
